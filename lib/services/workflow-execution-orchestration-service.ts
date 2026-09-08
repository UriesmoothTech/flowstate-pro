import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";
import {
  createWorkflowExecution,
  getWorkflowExecution,
} from "@/lib/services/workflow-execution-service";
import {
  startWorkflowExecution,
  completeWorkflowExecution,
  failWorkflowExecution,
} from "@/lib/services/workflow-execution-lifecycle-service";

export function executeWorkflow(
  execution: WorkflowExecution,
  startedAt: string,
  completedAt: string,
  repository: WorkflowExecutionRepository,
): WorkflowExecution {
  createWorkflowExecution(execution, repository);

  const runningExecution = startWorkflowExecution(
    execution.id,
    startedAt,
    repository,
  );

  return completeWorkflowExecution(
    runningExecution.id,
    completedAt,
    repository,
  );
}

export function getExecutionForOrchestration(
  id: string,
  repository: WorkflowExecutionRepository,
): WorkflowExecution | undefined {
  return getWorkflowExecution(id, repository);
}

export function failExecution(
  id: string,
  completedAt: string,
  repository: WorkflowExecutionRepository,
): WorkflowExecution {
  return failWorkflowExecution(id, completedAt, repository);
}
