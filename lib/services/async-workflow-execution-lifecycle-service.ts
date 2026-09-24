import type {
  WorkflowExecution,
  WorkflowExecutionFailureCode,
} from "@/lib/domain/workflow";
import type { AsyncWorkflowExecutionRepository } from "@/lib/repositories/async-workflow-execution-repository";
import {
  getWorkflowExecutionAsync,
  updateWorkflowExecutionAsync,
} from "@/lib/services/async-workflow-execution-service";
import { isValidWorkflowExecutionTimestamp } from "@/lib/services/workflow-execution-timestamp-service";

export async function startWorkflowExecutionAsync(
  id: string,
  startedAt: string,
  repository: AsyncWorkflowExecutionRepository,
): Promise<WorkflowExecution> {
  if (!isValidWorkflowExecutionTimestamp(startedAt)) {
    throw new Error(`Invalid startedAt timestamp: ${startedAt}`);
  }

  const execution = await getWorkflowExecutionAsync(id, repository);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "queued") {
    throw new Error(
      `Cannot start workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecutionAsync(
    {
      ...execution,
      status: "running",
      startedAt,
    },
    repository,
  );
}

export async function completeWorkflowExecutionAsync(
  id: string,
  completedAt: string,
  repository: AsyncWorkflowExecutionRepository,
): Promise<WorkflowExecution> {
  if (!isValidWorkflowExecutionTimestamp(completedAt)) {
    throw new Error(`Invalid completedAt timestamp: ${completedAt}`);
  }

  const execution = await getWorkflowExecutionAsync(id, repository);

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

  return updateWorkflowExecutionAsync(
    {
      ...execution,
      status: "completed",
      completedAt,
    },
    repository,
  );
}

export interface AsyncWorkflowExecutionFailureOptions {
  errorCode?: WorkflowExecutionFailureCode;
  errorMessage?: string;
}

export async function failWorkflowExecutionAsync(
  id: string,
  completedAt: string,
  repository: AsyncWorkflowExecutionRepository,
  options: AsyncWorkflowExecutionFailureOptions = {},
): Promise<WorkflowExecution> {
  if (!isValidWorkflowExecutionTimestamp(completedAt)) {
    throw new Error(`Invalid completedAt timestamp: ${completedAt}`);
  }

  const execution = await getWorkflowExecutionAsync(id, repository);

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

  return updateWorkflowExecutionAsync(
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
