import test from "node:test";
import assert from "node:assert/strict";

export const HARDWARE_REPOSITORY_METHODS = Object.freeze([
  "listCategories",
  "getCategory",
  "listItems",
  "getItemDetail",
  "saveItem"
]);

export function createHardwareRepositoryContractTestSuite({ name, createRepository }) {
  if (!name) {
    throw new Error("repository contract requires a suite name");
  }
  if (typeof createRepository !== "function") {
    throw new Error(`${name} contract requires createRepository`);
  }

  test(`${name} exposes required repository methods`, async () => {
    const repository = await createRepository();

    for (const method of HARDWARE_REPOSITORY_METHODS) {
      assert.equal(typeof repository[method], "function", `${method} must be a function`);
    }
  });

  test(`${name} lists categories and fetches category detail`, async () => {
    const repository = await createRepository();
    const categories = await repository.listCategories();

    assert.ok(Array.isArray(categories), "listCategories must return an array");
    assert.ok(categories.length > 0, "repository contract needs at least one category fixture");

    const category = categories[0];
    assert.ok(category.id, "category fixtures must include an id");

    const categoryDetail = await repository.getCategory(category.id);
    assert.equal(categoryDetail?.id, category.id);
  });

  test(`${name} lists items and fetches item detail`, async () => {
    const repository = await createRepository();
    const categories = await repository.listCategories();
    const category = categories[0];
    const items = await repository.listItems({ categoryId: category.id });

    assert.ok(Array.isArray(items), "listItems must return an array");
    assert.ok(items.length > 0, "repository contract needs at least one item fixture");

    const item = items[0];
    assert.ok(item.id, "item fixtures must include an id");
    assert.equal(item.categoryId, category.id);

    const itemDetail = await repository.getItemDetail(item.id);
    assert.equal(itemDetail?.id, item.id);
  });

  test(`${name} saves an item and returns it from detail lookups`, async () => {
    const repository = await createRepository();
    const categories = await repository.listCategories();
    const category = categories[0];
    const item = {
      id: "contract-test-item",
      categoryId: category.id,
      name: "Contract Test Item",
      status: "draft"
    };

    const savedItem = await repository.saveItem(item);
    assert.equal(savedItem?.id, item.id);

    const itemDetail = await repository.getItemDetail(item.id);
    assert.equal(itemDetail?.name, item.name);
    assert.equal(itemDetail?.categoryId, category.id);
  });
}
