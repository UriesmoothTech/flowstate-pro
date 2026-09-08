import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";
import {
  getWorkflowExecution,
  updateWorkflowExecution,
  defaultWorkflowExecutionRepository,
} from "@/lib/services/workflow-execution-service";

export function startWorkflowExecution(
  id: string,
  startedAt: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution {
  const execution = getWorkflowExecution(id, repository);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "queued") {
    throw new Error(
      `Cannot start workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecution(
    {
      ...execution,
      status: "running",
      startedAt,
    },
    repository,
  );
}

export function completeWorkflowExecution(
  id: string,
  completedAt: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution {
  const execution = getWorkflowExecution(id, repository);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "running") {
    throw new Error(
      `Cannot complete workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecution(
    {
      ...execution,
      status: "completed",
      completedAt,
    },
    repository,
  );
}

export function failWorkflowExecution(
  id: string,
  completedAt: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution {
  const execution = getWorkflowExecution(id, repository);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "running") {
    throw new Error(
      `Cannot fail workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecution(
    {
      ...execution,
      status: "failed",
      completedAt,
    },
    repository,
  );
}
