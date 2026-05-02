import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";

export async function exportStaticData(options = {}) {
  const { outputDir } = options;

  if (!outputDir) {
    throw new Error("exportStaticData requires outputDir");
  }

  const repository = createJsonHardwareRepository();
  const categories = await repository.listCategories();

  await mkdir(outputDir, { recursive: true });

  await writeFile(
    path.join(outputDir, "categories.json"),
    JSON.stringify(categories, null, 2) + "\n"
  );

  for (const category of categories) {
    const items = await repository.listItems({ categoryId: category.id });
    const categoryDir = path.join(outputDir, category.id);
    await mkdir(categoryDir, { recursive: true });

    for (const item of items) {
      const detail = await repository.getItemDetail(item.id);
      await writeFile(
        path.join(categoryDir, `${item.id}.json`),
        JSON.stringify(detail, null, 2) + "\n"
      );
    }
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));

if (isDirectRun) {
  const outputDir = process.argv[2] || path.resolve(process.cwd(), "dist", "data");
  exportStaticData({ outputDir })
    .then(() => console.log(`Exported to ${outputDir}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
