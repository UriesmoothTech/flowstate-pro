import type { WorkflowExecution } from "@/lib/domain/workflow";
import { getWorkflowExecution, updateWorkflowExecution } from "@/lib/services/workflow-execution-service";

export function startWorkflowExecution(
  id: string,
  startedAt: string,
): WorkflowExecution {
  const execution = getWorkflowExecution(id);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "queued") {
    throw new Error(
      `Cannot start workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecution({
    ...execution,
    status: "running",
    startedAt,
  });
}

export function completeWorkflowExecution(
  id: string,
  completedAt: string,
): WorkflowExecution {
  const execution = getWorkflowExecution(id);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "running") {
    throw new Error(
      `Cannot complete workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecution({
    ...execution,
    status: "completed",
    completedAt,
  });
}

export function failWorkflowExecution(
  id: string,
  completedAt: string,
): WorkflowExecution {
  const execution = getWorkflowExecution(id);

  if (!execution) {
    throw new Error(`Workflow execution not found: ${id}`);
  }

  if (execution.status !== "running") {
    throw new Error(
      `Cannot fail workflow execution ${id} from status ${execution.status}`,
    );
  }

  return updateWorkflowExecution({
    ...execution,
    status: "failed",
    completedAt,
  });
}
