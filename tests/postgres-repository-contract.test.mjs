import { createHardwareRepositoryContractTestSuite } from "../src/domain/hardware/repository-contract.js";

createHardwareRepositoryContractTestSuite({
  name: "postgres hardware repository",
  createRepository: async () => {
    const { createPostgresHardwareRepository } = await import(
      "../src/infrastructure/postgres/postgres-hardware-repository.js"
    );
    return createPostgresHardwareRepository({ queryClient: createFakeQueryClient() });
  },
});

function createFakeQueryClient() {
  const categories = [
    {
      id: "gpu",
      label: "GPU",
      description: "Graphics Processing Unit",
      item_name_singular: "GPU",
      item_name_plural: "GPUs",
      list_view_config: null,
      detail_view_config: null,
      admin_form_config: null,
      compare_presets: null,
    },
  ];

  const items = new Map([
    [
      "test-gpu-1",
      {
        id: "test-gpu-1",
        category_id: "gpu",
        family_id: null,
        manufacturer_id: "nvidia",
        name: "Test GPU 1",
        generation: null,
        architecture: null,
        release_date: null,
        market_segment_ids: ["desktop"],
        status: "published",
        notes: [],
      },
    ],
  ]);

  const metricValues = [];
  const rankingScores = [];
  const sources = [];

  return {
    async query(sql, params) {
      const normalized = sql.replace(/\s+/g, " ").trim().toLowerCase();

      if (normalized.startsWith("select") && normalized.includes("from hardware_categories")) {
        if (normalized.includes("where") && params && params.length > 0) {
          return { rows: categories.filter((c) => c.id === params[0]) };
        }
        return { rows: categories };
      }

      if (normalized.startsWith("select") && normalized.includes("from hardware_items")) {
        if (normalized.includes("where") && params) {
          if (normalized.includes("i.id =") || normalized.includes("where id =")) {
            const item = items.get(params[0]);
            return { rows: item ? [item] : [] };
          }
          if (normalized.includes("i.category_id =") || normalized.includes("where category_id =")) {
            return { rows: Array.from(items.values()).filter((r) => r.category_id === params[0]) };
          }
        }
        return { rows: Array.from(items.values()) };
      }

      if (normalized.startsWith("select") && normalized.includes("from metric_values")) {
        if (params && params.length > 0) {
          return { rows: metricValues.filter((mv) => mv.item_id === params[0]) };
        }
        return { rows: metricValues };
      }

      if (normalized.startsWith("select") && normalized.includes("from ranking_scores")) {
        if (params && params.length > 0) {
          return { rows: rankingScores.filter((rs) => rs.item_id === params[0]) };
        }
        return { rows: rankingScores };
      }

      if (normalized.startsWith("select") && normalized.includes("from source_documents")) {
        if (params && params.length > 0) {
          return { rows: sources.filter((s) => s.item_id === params[0]) };
        }
        return { rows: sources };
      }

      if (normalized.startsWith("insert") && normalized.includes("into hardware_items")) {
        const row = {
          id: params[0],
          category_id: params[1],
          family_id: params[2],
          manufacturer_id: params[3],
          name: params[4],
          generation: params[5],
          architecture: params[6],
          release_date: params[7],
          market_segment_ids: params[8],
          status: params[9],
          notes: params[10],
        };
        items.set(row.id, row);
        return { rows: [] };
      }

      return { rows: [] };
    },
  };
}
