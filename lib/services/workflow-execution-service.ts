import type { WorkflowExecution } from "@/lib/domain/workflow";
import { InMemoryWorkflowExecutionRepository } from "@/lib/repositories/in-memory-workflow-execution-repository";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";

const repository: WorkflowExecutionRepository =
  new InMemoryWorkflowExecutionRepository();

export function createWorkflowExecution(
  execution: WorkflowExecution,
): WorkflowExecution {
  return repository.create(execution);
}

export function getWorkflowExecution(
  id: string,
): WorkflowExecution | undefined {
  return repository.getById(id);
}

export function listWorkflowExecutions(
  workflowId: string,
): WorkflowExecution[] {
  return repository.listByWorkflowId(workflowId);
}

export function updateWorkflowExecution(
  execution: WorkflowExecution,
): WorkflowExecution {
  return repository.update(execution);
}
