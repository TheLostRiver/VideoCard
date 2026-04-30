export function createHardwareMutationService(repository) {
  if (!repository || typeof repository.saveItem !== "function") {
    throw new Error("hardware mutation service requires a repository with saveItem");
  }

  return {
    async saveItemDetail(detail) {
      if (!detail?.item?.id) {
        throw new Error("saveItemDetail requires detail.item.id");
      }

      return repository.saveItem(detail);
    }
  };
}
