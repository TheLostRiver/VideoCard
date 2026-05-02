import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { validateCategorySchema } from "../src/domain/hardware/category-schema.js";

export async function validateHardwareData(options = {}) {
  const root = options.root || process.cwd();
  const categoriesDir = options.categoriesDir || path.join(root, "src", "data", "categories");
  const hardwareDir = options.hardwareDir || path.join(root, "src", "data", "hardware");

  const errors = [];
  let categoryCount = 0;
  let itemCount = 0;

  // Validate category schemas
  let categoryFiles;
  try {
    categoryFiles = (await readdir(categoriesDir)).filter((f) => f.endsWith(".schema.json"));
  } catch {
    errors.push(`Cannot read categories directory: ${categoriesDir}`);
    return { categoryCount, itemCount, errors };
  }

  const categoryIds = new Set();

  for (const file of categoryFiles) {
    const filePath = path.join(categoriesDir, file);
    let schema;
    try {
      const raw = await readFile(filePath, "utf8");
      schema = JSON.parse(raw);
    } catch (err) {
      errors.push(`${file}: invalid JSON — ${err.message}`);
      continue;
    }

    const schemaErrors = validateCategorySchema(schema);
    for (const err of schemaErrors) {
      errors.push(`${file}: ${err}`);
    }

    if (schema?.id) {
      if (categoryIds.has(schema.id)) {
        errors.push(`${file}: duplicate category id: ${schema.id}`);
      }
      categoryIds.add(schema.id);
    }

    categoryCount++;
  }

  // Validate item files
  let itemFiles;
  try {
    itemFiles = (await readdir(hardwareDir)).filter((f) => f.endsWith(".items.json"));
  } catch {
    itemFiles = [];
  }

  // Also validate legacy GPU data
  const legacyGpuPath = path.join(root, "src", "data", "gpus.json");
  try {
    await readFile(legacyGpuPath, "utf8");
    itemFiles.push("gpus.json");
  } catch {
    // legacy file may not exist
  }

  for (const file of itemFiles) {
    const isLegacy = file === "gpus.json";
    const filePath = isLegacy ? path.join(root, "src", "data", file) : path.join(hardwareDir, file);
    let items;
    try {
      const raw = await readFile(filePath, "utf8");
      items = JSON.parse(raw);
    } catch (err) {
      errors.push(`${file}: invalid JSON — ${err.message}`);
      continue;
    }

    if (!Array.isArray(items)) {
      errors.push(`${file}: expected an array of items`);
      continue;
    }

    for (const entry of items) {
      const item = isLegacy ? entry : entry.item;
      const itemId = item?.id || "unknown";

      if (!item?.id) {
        errors.push(`${file}: entry missing id`);
        continue;
      }

      if (!isLegacy) {
        if (!item?.categoryId) {
          errors.push(`${file}: ${itemId} missing item.categoryId`);
        }
        if (!item?.name) {
          errors.push(`${file}: ${itemId} missing item.name`);
        }

        // Validate metric values
        if (Array.isArray(entry.metricValues)) {
          for (const mv of entry.metricValues) {
            if (!mv.metricId) {
              errors.push(`${file}: ${itemId} metric value missing metricId`);
            }
          }
        }

        // Validate ranking score
        if (entry.rankingScore) {
          if (entry.rankingScore.score == null) {
            errors.push(`${file}: ${itemId} rankingScore missing score`);
          }
        }
      } else {
        // Legacy format validation
        if (!item?.name) {
          errors.push(`${file}: ${itemId} missing name`);
        }
      }

      itemCount++;
    }
  }

  return { categoryCount, itemCount, errors };
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));

if (isDirectRun) {
  const result = await validateHardwareData();
  if (result.errors.length > 0) {
    console.error(`Validation failed with ${result.errors.length} error(s):`);
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
  console.log(`Validated ${result.categoryCount} categories, ${result.itemCount} items.`);
}
