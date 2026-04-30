import { createHardwareRepositoryContractTestSuite } from "../src/domain/hardware/repository-contract.js";

function createFakeRepository() {
  const categories = [
    {
      id: "gpu",
      label: "GPU"
    }
  ];
  const items = new Map([
    [
      "rtx-4090",
      {
        id: "rtx-4090",
        categoryId: "gpu",
        name: "GeForce RTX 4090",
        status: "published",
        metrics: {
          "gpu.memory.size": 24
        }
      }
    ]
  ]);

  return {
    async listCategories() {
      return categories;
    },

    async getCategory(categoryId) {
      return categories.find((category) => category.id === categoryId) || null;
    },

    async listItems({ categoryId }) {
      return Array.from(items.values()).filter((item) => item.categoryId === categoryId);
    },

    async getItemDetail(itemId) {
      return items.get(itemId) || null;
    },

    async saveItem(item) {
      items.set(item.id, item);
      return item;
    }
  };
}

createHardwareRepositoryContractTestSuite({
  name: "fake hardware repository",
  createRepository: createFakeRepository
});
