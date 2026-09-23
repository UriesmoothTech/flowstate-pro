import type {
  WorkflowExecution,
  WorkflowExecutionFailureCode,
  WorkflowExecutionStatus,
} from "@/lib/domain/workflow";
import { workflowExecutions } from "@/lib/db/schema";

type WorkflowExecutionRow = typeof workflowExecutions.$inferSelect;

export function workflowExecutionFromRow(
  row: WorkflowExecutionRow,
): WorkflowExecution {
  return {
    id: row.id,
    workflowId: row.workflowId,
    status: row.status as WorkflowExecutionStatus,
    ...(row.startedAt !== null ? { startedAt: row.startedAt } : {}),
    ...(row.completedAt !== null ? { completedAt: row.completedAt } : {}),
    ...(row.errorCode !== null
      ? { errorCode: row.errorCode as WorkflowExecutionFailureCode }
      : {}),
    ...(row.errorMessage !== null
      ? { errorMessage: row.errorMessage }
      : {}),
  };
}
