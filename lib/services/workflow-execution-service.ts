import type { WorkflowExecution } from "@/lib/domain/workflow";
import { InMemoryWorkflowExecutionRepository } from "@/lib/repositories/in-memory-workflow-execution-repository";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";

export const defaultWorkflowExecutionRepository: WorkflowExecutionRepository =
  new InMemoryWorkflowExecutionRepository();

export function createWorkflowExecution(
  execution: WorkflowExecution,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution {
  return repository.create(execution);
}

export function getWorkflowExecution(
  id: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution | undefined {
  return repository.getById(id);
}

export function listWorkflowExecutions(
  workflowId: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution[] {
  return repository.listByWorkflowId(workflowId);
}

export function updateWorkflowExecution(
  execution: WorkflowExecution,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution {
  return repository.update(execution);
}
