export function createPostgresHardwareRepository(options = {}) {
  const { queryClient } = options;

  if (!queryClient) {
    throw new Error("postgres repository requires a queryClient");
  }

  async function listCategories() {
    const { rows } = await queryClient.query(
      "SELECT id, label, description, item_name_singular, item_name_plural, list_view_config, detail_view_config, admin_form_config, compare_presets FROM hardware_categories ORDER BY id"
    );
    return rows.map(mapCategoryRow);
  }

  async function getCategory(categoryId) {
    const { rows } = await queryClient.query(
      "SELECT id, label, description, item_name_singular, item_name_plural, list_view_config, detail_view_config, admin_form_config, compare_presets FROM hardware_categories WHERE id = $1",
      [categoryId]
    );
    return rows.length > 0 ? mapCategoryRow(rows[0]) : null;
  }

  async function listItems(query = {}) {
    const { categoryId } = query;
    const { rows } = await queryClient.query(
      "SELECT id, category_id, family_id, manufacturer_id, name, generation, architecture, release_date, market_segment_ids, status, notes FROM hardware_items WHERE category_id = $1 ORDER BY name",
      [categoryId]
    );
    return rows.map(mapItemRow);
  }

  async function getItemDetail(itemId) {
    const { rows: itemRows } = await queryClient.query(
      "SELECT id, category_id, family_id, manufacturer_id, name, generation, architecture, release_date, market_segment_ids, status, notes FROM hardware_items WHERE id = $1",
      [itemId]
    );
    if (itemRows.length === 0) return null;

    const item = mapItemRow(itemRows[0]);

    const { rows: metricRows } = await queryClient.query(
      "SELECT id, item_id, variant_id, metric_id, value_number, value_text, value_min, value_max, value_boolean, unit, confidence, note, source_ids FROM metric_values WHERE item_id = $1",
      [itemId]
    );

    const { rows: rankingRows } = await queryClient.query(
      "SELECT id, item_id, profile_id, score, tier_id, confidence, formula_version FROM ranking_scores WHERE item_id = $1",
      [itemId]
    );

    const { rows: sourceRows } = await queryClient.query(
      "SELECT id, item_id, label, url, source_type, publisher, retrieval_date, notes FROM source_documents WHERE item_id = $1",
      [itemId]
    );

    return {
      ...item,
      metricValues: metricRows.map(mapMetricValueRow),
      rankingScore: rankingRows.length > 0 ? mapRankingScoreRow(rankingRows[0]) : null,
      sources: sourceRows.map(mapSourceRow),
    };
  }

  async function saveItem(detail) {
    const item = detail.item || detail;
    const metricValues = detail.metricValues || [];
    const rankingScore = detail.rankingScore || null;
    const sources = detail.sources || [];

    await queryClient.query(
      `INSERT INTO hardware_items (id, category_id, family_id, manufacturer_id, name, generation, architecture, release_date, market_segment_ids, status, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET
         category_id = EXCLUDED.category_id,
         family_id = EXCLUDED.family_id,
         manufacturer_id = EXCLUDED.manufacturer_id,
         name = EXCLUDED.name,
         generation = EXCLUDED.generation,
         architecture = EXCLUDED.architecture,
         release_date = EXCLUDED.release_date,
         market_segment_ids = EXCLUDED.market_segment_ids,
         status = EXCLUDED.status,
         notes = EXCLUDED.notes,
         updated_at = NOW()`,
      [
        item.id,
        item.categoryId,
        item.familyId || null,
        item.manufacturerId,
        item.name,
        item.generation || null,
        item.architecture || null,
        item.releaseDate || null,
        item.marketSegmentIds || [],
        item.status || "draft",
        item.notes || [],
      ]
    );

    if (Array.isArray(metricValues)) {
      for (const mv of metricValues) {
        await queryClient.query(
          `INSERT INTO metric_values (id, item_id, variant_id, metric_id, value_number, value_text, value_min, value_max, value_boolean, unit, confidence, note, source_ids, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
           ON CONFLICT (item_id, variant_id, metric_id) DO UPDATE SET
             value_number = EXCLUDED.value_number,
             value_text = EXCLUDED.value_text,
             value_min = EXCLUDED.value_min,
             value_max = EXCLUDED.value_max,
             value_boolean = EXCLUDED.value_boolean,
             unit = EXCLUDED.unit,
             confidence = EXCLUDED.confidence,
             note = EXCLUDED.note,
             source_ids = EXCLUDED.source_ids,
             updated_at = NOW()`,
          [
            mv.id || `${mv.itemId}:${mv.metricId}`,
            mv.itemId,
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
            mv.sourceIds || [],
          ]
        );
      }
    }

    if (rankingScore) {
      await queryClient.query(
        `INSERT INTO ranking_scores (id, item_id, profile_id, score, tier_id, confidence, formula_version, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (item_id, profile_id) DO UPDATE SET
           score = EXCLUDED.score,
           tier_id = EXCLUDED.tier_id,
           confidence = EXCLUDED.confidence,
           formula_version = EXCLUDED.formula_version,
           updated_at = NOW()`,
        [
          rankingScore.id || `${rankingScore.itemId}:ranking:${rankingScore.profileId}`,
          rankingScore.itemId,
          rankingScore.profileId,
          rankingScore.score,
          rankingScore.tierId || null,
          rankingScore.confidence || "estimated",
          rankingScore.formulaVersion,
        ]
      );
    }

    if (Array.isArray(sources)) {
      for (const src of sources) {
        await queryClient.query(
          `INSERT INTO source_documents (id, item_id, label, url, source_type, publisher, retrieval_date, notes, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
           ON CONFLICT (id) DO UPDATE SET
             item_id = EXCLUDED.item_id,
             label = EXCLUDED.label,
             url = EXCLUDED.url,
             source_type = EXCLUDED.source_type,
             publisher = EXCLUDED.publisher,
             retrieval_date = EXCLUDED.retrieval_date,
             notes = EXCLUDED.notes,
             updated_at = NOW()`,
          [
            src.id,
            src.itemId || item.id,
            src.label,
            src.url,
            src.sourceType || "other",
            src.publisher || null,
            src.retrievalDate || null,
            src.notes || null,
          ]
        );
      }
    }

    return getItemDetail(item.id);
  }

  return { listCategories, getCategory, listItems, getItemDetail, saveItem };
}

function mapCategoryRow(row) {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    itemNameSingular: row.item_name_singular,
    itemNamePlural: row.item_name_plural,
    listViewConfig: row.list_view_config,
    detailViewConfig: row.detail_view_config,
    adminFormConfig: row.admin_form_config,
    comparePresets: row.compare_presets,
  };
}

function mapItemRow(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    familyId: row.family_id,
    manufacturerId: row.manufacturer_id,
    name: row.name,
    generation: row.generation,
    architecture: row.architecture,
    releaseDate: row.release_date,
    marketSegmentIds: row.market_segment_ids || [],
    status: row.status,
    notes: row.notes || [],
  };
}

function mapMetricValueRow(row) {
  return {
    id: row.id,
    itemId: row.item_id,
    variantId: row.variant_id,
    metricId: row.metric_id,
    valueNumber: row.value_number,
    valueText: row.value_text,
    valueMin: row.value_min,
    valueMax: row.value_max,
    valueBoolean: row.value_boolean,
    unit: row.unit,
    confidence: row.confidence,
    note: row.note,
    sourceIds: row.source_ids || [],
  };
}

function mapRankingScoreRow(row) {
  return {
    id: row.id,
    itemId: row.item_id,
    profileId: row.profile_id,
    score: row.score,
    tierId: row.tier_id,
    confidence: row.confidence,
    formulaVersion: row.formula_version,
  };
}

function mapSourceRow(row) {
  return {
    id: row.id,
    itemId: row.item_id,
    label: row.label,
    url: row.url,
    sourceType: row.source_type,
    publisher: row.publisher,
    retrievalDate: row.retrieval_date,
    notes: row.notes,
  };
}
