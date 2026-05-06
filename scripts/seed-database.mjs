import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createPool, closePool } from "../src/infrastructure/postgres/pool.js";
import {
  mapLegacyGpuToHardwareItem,
  mapLegacyGpuToMetricValues,
  mapLegacyGpuToRankingScore,
  mapLegacyGpuToSources,
  GPU_RANKING_PROFILE_ID,
  LEGACY_GPU_FORMULA_VERSION,
  LEGACY_IMPORT_TIMESTAMP
} from "./import-legacy-gpus.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "..", "src", "data");

// ── Schema files ──
const SCHEMA_FILES = [
  { file: "categories/gpu.schema.json", dataFile: "gpus.json", format: "legacy" },
  { file: "categories/desktop-cpu.schema.json", dataFile: "hardware/desktop-cpu.items.json", format: "wrapped" },
  { file: "categories/mobile-soc.schema.json", dataFile: "hardware/mobile-soc.items.json", format: "wrapped" },
  { file: "categories/apple-silicon.schema.json", dataFile: "hardware/apple-silicon.items.json", format: "wrapped" }
];

async function readJson(relPath) {
  return JSON.parse(await readFile(join(SRC_DIR, relPath), "utf8"));
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://hardware:hardware_dev@localhost:5432/hardware_platform";
  console.log("Connecting to:", databaseUrl.replace(/:[^:@]+@/, ":***@"));

  const pool = createPool(databaseUrl);
  const client = await pool.connect();

  try {
    // 1. Insert categories
    console.log("\n[1/6] Inserting categories...");
    let categoryCount = 0;
    for (const { file } of SCHEMA_FILES) {
      const schema = await readJson(file);
      await client.query(
        `INSERT INTO hardware_categories (id, label, description, item_name_singular, item_name_plural, list_view_config, detail_view_config, admin_form_config, compare_presets, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           label = EXCLUDED.label, description = EXCLUDED.description,
           item_name_singular = EXCLUDED.item_name_singular, item_name_plural = EXCLUDED.item_name_plural,
           list_view_config = EXCLUDED.list_view_config, detail_view_config = EXCLUDED.detail_view_config,
           admin_form_config = EXCLUDED.admin_form_config, compare_presets = EXCLUDED.compare_presets,
           updated_at = NOW()`,
        [
          schema.id,
          schema.label,
          schema.description || null,
          schema.itemName?.singular || null,
          schema.itemName?.plural || null,
          JSON.stringify(schema.listView || null),
          JSON.stringify(schema.detailView || null),
          JSON.stringify(schema.adminForm || null),
          JSON.stringify(schema.comparePresets || null)
        ]
      );
      categoryCount++;
    }
    console.log(`  ${categoryCount} categories inserted`);

    // 2. Extract and insert manufacturers
    console.log("\n[2/6] Inserting manufacturers...");
    const manufacturerMap = new Map();
    for (const { file, dataFile, format } of SCHEMA_FILES) {
      const schema = await readJson(file);
      const categoryId = schema.id;
      let items;
      if (format === "legacy") {
        items = await readJson(dataFile);
        for (const gpu of items) {
          const brand = gpu.brand;
          if (brand && !manufacturerMap.has(brand)) {
            manufacturerMap.set(brand, { id: brand, label: capitalize(brand) });
          }
        }
      } else {
        items = await readJson(dataFile);
        for (const entry of items) {
          const brand = entry.item?.manufacturerId;
          if (brand && !manufacturerMap.has(brand)) {
            manufacturerMap.set(brand, { id: brand, label: capitalize(brand) });
          }
        }
      }
    }
    for (const mfr of manufacturerMap.values()) {
      await client.query(
        `INSERT INTO manufacturers (id, label, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, updated_at = NOW()`,
        [mfr.id, mfr.label]
      );
    }
    console.log(`  ${manufacturerMap.size} manufacturers inserted`);

    // 3. Extract and insert metric definitions
    console.log("\n[3/6] Inserting metric definitions...");
    let metricCount = 0;
    for (const { file } of SCHEMA_FILES) {
      const schema = await readJson(file);
      const categoryId = schema.id;
      for (const metric of schema.metrics || []) {
        await client.query(
          `INSERT INTO metric_definitions (id, category_id, label, value_type, formatter_id, unit, higher_is_better, sort_order, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
           ON CONFLICT (id) DO UPDATE SET
             category_id = EXCLUDED.category_id, label = EXCLUDED.label,
             value_type = EXCLUDED.value_type, formatter_id = EXCLUDED.formatter_id,
             unit = EXCLUDED.unit, updated_at = NOW()`,
          [
            metric.id,
            categoryId,
            metric.label,
            metric.valueType || "text",
            metric.formatterId || "text",
            metric.unit || null,
            metric.higherIsBetter !== false,
            metric.sortOrder || 0
          ]
        );
        metricCount++;
      }
    }
    console.log(`  ${metricCount} metric definitions inserted`);

    // 4. Insert ranking profiles
    console.log("\n[4/6] Inserting ranking profiles...");
    const profiles = [
      { id: GPU_RANKING_PROFILE_ID, categoryId: "gpu", label: "GPU Gaming Performance", formulaVersion: LEGACY_GPU_FORMULA_VERSION },
      { id: "cpu-performance", categoryId: "desktop-cpu", label: "CPU Performance", formulaVersion: "cpu-mark-v1" },
      { id: "soc-performance", categoryId: "mobile-soc", label: "SoC Performance", formulaVersion: "soc-index-v1" },
      { id: "apple-performance", categoryId: "apple-silicon", label: "Apple Silicon Performance", formulaVersion: "apple-index-v1" }
    ];
    for (const profile of profiles) {
      await client.query(
        `INSERT INTO ranking_profiles (id, category_id, label, formula_version, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           label = EXCLUDED.label, formula_version = EXCLUDED.formula_version, updated_at = NOW()`,
        [profile.id, profile.categoryId, profile.label, profile.formulaVersion]
      );
    }
    console.log(`  ${profiles.length} ranking profiles inserted`);

    // 5. Insert items
    console.log("\n[5/6] Inserting hardware items...");
    let totalItems = 0;
    let totalMetrics = 0;
    let totalScores = 0;
    let totalSources = 0;

    for (const { file, dataFile, format } of SCHEMA_FILES) {
      const schema = await readJson(file);
      const categoryId = schema.id;
      const data = await readJson(dataFile);

      let wrappedDetails;
      if (format === "legacy") {
        wrappedDetails = data.map((gpu) => ({
          item: mapLegacyGpuToHardwareItem(gpu),
          metricValues: mapLegacyGpuToMetricValues(gpu),
          rankingScore: mapLegacyGpuToRankingScore(gpu),
          sources: mapLegacyGpuToSources(gpu)
        }));
      } else {
        wrappedDetails = data;
      }

      for (const detail of wrappedDetails) {
        const item = detail.item;
        if (!item?.id) continue;

        await client.query(
          `INSERT INTO hardware_items (id, category_id, manufacturer_id, name, generation, architecture, release_date, market_segment_ids, status, notes, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
           ON CONFLICT (id) DO UPDATE SET
             category_id = EXCLUDED.category_id, manufacturer_id = EXCLUDED.manufacturer_id,
             name = EXCLUDED.name, generation = EXCLUDED.generation, architecture = EXCLUDED.architecture,
             release_date = EXCLUDED.release_date, market_segment_ids = EXCLUDED.market_segment_ids,
             status = EXCLUDED.status, notes = EXCLUDED.notes, updated_at = NOW()`,
          [
            item.id,
            item.categoryId || categoryId,
            item.manufacturerId,
            item.name,
            item.generation || null,
            item.architecture || null,
            item.releaseDate || null,
            item.marketSegmentIds || [],
            item.status || "published",
            item.notes || []
          ]
        );
        totalItems++;

        // Metric values
        for (const mv of detail.metricValues || []) {
          await client.query(
            `INSERT INTO metric_values (id, item_id, variant_id, metric_id, value_number, value_text, value_min, value_max, value_boolean, unit, confidence, note, source_ids, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
             ON CONFLICT (item_id, variant_id, metric_id) DO UPDATE SET
               value_number = EXCLUDED.value_number, value_text = EXCLUDED.value_text,
               value_min = EXCLUDED.value_min, value_max = EXCLUDED.value_max,
               value_boolean = EXCLUDED.value_boolean, unit = EXCLUDED.unit,
               confidence = EXCLUDED.confidence, note = EXCLUDED.note,
               source_ids = EXCLUDED.source_ids, updated_at = NOW()`,
            [
              mv.id || `${item.id}:${mv.metricId}`,
              mv.itemId || item.id,
              mv.variantId || null,
              mv.metricId,
              mv.valueNumber ?? null,
              mv.valueText ?? null,
              mv.valueMin ?? null,
              mv.valueMax ?? null,
              mv.valueBoolean ?? null,
              mv.unit || null,
              mv.confidence || "estimated",
              mv.note || null,
              mv.sourceIds || []
            ]
          );
          totalMetrics++;
        }

        // Ranking score
        const rs = detail.rankingScore;
        if (rs) {
          const profileId = rs.profileId || rs.rankingProfileId;
          await client.query(
            `INSERT INTO ranking_scores (id, item_id, profile_id, score, tier_id, confidence, formula_version, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
             ON CONFLICT (item_id, profile_id) DO UPDATE SET
               score = EXCLUDED.score, tier_id = EXCLUDED.tier_id,
               confidence = EXCLUDED.confidence, formula_version = EXCLUDED.formula_version,
               updated_at = NOW()`,
            [
              rs.id || `${item.id}:ranking:${profileId}`,
              rs.itemId || item.id,
              profileId,
              rs.score,
              rs.tierId || null,
              rs.confidence || "estimated",
              rs.formulaVersion || "v1"
            ]
          );
          totalScores++;
        }

        // Sources
        for (const src of detail.sources || []) {
          await client.query(
            `INSERT INTO source_documents (id, item_id, label, url, source_type, publisher, retrieval_date, notes, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
             ON CONFLICT (id) DO UPDATE SET
               item_id = EXCLUDED.item_id, label = EXCLUDED.label, url = EXCLUDED.url,
               source_type = EXCLUDED.source_type, publisher = EXCLUDED.publisher,
               retrieval_date = EXCLUDED.retrieval_date, notes = EXCLUDED.notes, updated_at = NOW()`,
            [
              src.id || `${item.id}:source:${totalSources + 1}`,
              src.itemId || item.id,
              src.label || "Source",
              src.url || "",
              src.sourceType || "other",
              src.publisher || null,
              src.retrievalDate || src.retrievedAt || null,
              src.notes || null
            ]
          );
          totalSources++;
        }
      }
      console.log(`  ${categoryId}: ${wrappedDetails.length} items`);
    }

    // 6. Summary
    console.log("\n[6/6] Seed complete.");
    console.log(`  Categories: ${categoryCount}`);
    console.log(`  Manufacturers: ${manufacturerMap.size}`);
    console.log(`  Metric definitions: ${metricCount}`);
    console.log(`  Ranking profiles: ${profiles.length}`);
    console.log(`  Hardware items: ${totalItems}`);
    console.log(`  Metric values: ${totalMetrics}`);
    console.log(`  Ranking scores: ${totalScores}`);
    console.log(`  Source documents: ${totalSources}`);

  } finally {
    client.release();
    await closePool();
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
