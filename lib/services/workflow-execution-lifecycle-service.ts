import type {
  WorkflowExecution,
  WorkflowExecutionFailureCode,
} from "@/lib/domain/workflow";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";
import {
  getWorkflowExecution,
  updateWorkflowExecution,
  defaultWorkflowExecutionRepository,
} from "@/lib/services/workflow-execution-service";
import { isValidWorkflowExecutionTimestamp } from "@/lib/services/workflow-execution-timestamp-service";

export function startWorkflowExecution(
  id: string,
  startedAt: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
): WorkflowExecution {
  if (!isValidWorkflowExecutionTimestamp(startedAt)) {
    throw new Error(`Invalid startedAt timestamp: ${startedAt}`);
  }

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
  if (!isValidWorkflowExecutionTimestamp(completedAt)) {
    throw new Error(`Invalid completedAt timestamp: ${completedAt}`);
  }

  const execution = getWorkflowExecution(id, repository);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "running") {
    throw new Error(
      `Cannot complete workflow execution ${id} from status ${execution.status}`,
    );
  }

  if (
    execution.startedAt &&
    Date.parse(completedAt) < Date.parse(execution.startedAt)
  ) {
    throw new Error(
      `completedAt cannot be earlier than startedAt for workflow execution ${id}`,
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

export interface WorkflowExecutionFailureOptions {
  errorCode?: WorkflowExecutionFailureCode;
  errorMessage?: string;
}

export function failWorkflowExecution(
  id: string,
  completedAt: string,
  repository: WorkflowExecutionRepository = defaultWorkflowExecutionRepository,
  options: WorkflowExecutionFailureOptions = {},
): WorkflowExecution {
  if (!isValidWorkflowExecutionTimestamp(completedAt)) {
    throw new Error(`Invalid completedAt timestamp: ${completedAt}`);
  }

  const execution = getWorkflowExecution(id, repository);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "running") {
    throw new Error(
      `Cannot fail workflow execution ${id} from status ${execution.status}`,
    );
  }

  if (
    execution.startedAt &&
    Date.parse(completedAt) < Date.parse(execution.startedAt)
  ) {
    throw new Error(
      `completedAt cannot be earlier than startedAt for workflow execution ${id}`,
    );
  }

  return updateWorkflowExecution(
    {
      ...execution,
      status: "failed",
      completedAt,
      errorCode: options.errorCode ?? "EXECUTION_UNKNOWN_ERROR",
      errorMessage: options.errorMessage ?? "Workflow execution failed",
    },
    repository,
  );
}
