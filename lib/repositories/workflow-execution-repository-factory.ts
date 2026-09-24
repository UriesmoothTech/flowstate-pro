import type { AsyncWorkflowExecutionRepository } from "@/lib/repositories/async-workflow-execution-repository";

let repositoryOverride: AsyncWorkflowExecutionRepository | undefined;
let productionRepository: AsyncWorkflowExecutionRepository | undefined;

export function setWorkflowExecutionRepositoryForTests(
  repository: AsyncWorkflowExecutionRepository,
): void {
  repositoryOverride = repository;
}

export function clearWorkflowExecutionRepositoryForTests(): void {
  repositoryOverride = undefined;
}

export async function createWorkflowExecutionRepository(): Promise<AsyncWorkflowExecutionRepository> {
  if (repositoryOverride) {
    return repositoryOverride;
  }

  if (!productionRepository) {
    const { PostgresWorkflowExecutionRepository } =
      await import(
        "@/lib/repositories/postgres-workflow-execution-repository"
      );

    productionRepository = new PostgresWorkflowExecutionRepository();
  }

  return productionRepository;
}
