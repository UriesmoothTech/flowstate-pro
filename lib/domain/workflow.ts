export type WorkflowStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "failed";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type WorkflowExecutionFailureCode =
  | "EXECUTION_RUNTIME_ERROR"
  | "EXECUTION_TIMEOUT"
  | "EXECUTION_CANCELLED"
  | "EXECUTION_UNKNOWN_ERROR";

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  startedAt?: string;
  completedAt?: string;
  errorCode?: WorkflowExecutionFailureCode;
  errorMessage?: string;
}
