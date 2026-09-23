import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { AsyncWorkflowExecutionRepository } from "@/lib/repositories/async-workflow-execution-repository";

export async function createWorkflowExecutionAsync(
  execution: WorkflowExecution,
  repository: AsyncWorkflowExecutionRepository,
): Promise<WorkflowExecution> {
  return repository.create(execution);
}

export async function getWorkflowExecutionAsync(
  id: string,
  repository: AsyncWorkflowExecutionRepository,
): Promise<WorkflowExecution | undefined> {
  return repository.getById(id);
}

export async function listWorkflowExecutionsAsync(
  workflowId: string,
  repository: AsyncWorkflowExecutionRepository,
): Promise<WorkflowExecution[]> {
  return repository.listByWorkflowId(workflowId);
}

export async function updateWorkflowExecutionAsync(
  execution: WorkflowExecution,
  repository: AsyncWorkflowExecutionRepository,
): Promise<WorkflowExecution> {
  return repository.update(execution);
}
