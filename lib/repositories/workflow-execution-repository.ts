import type { WorkflowExecution } from "@/lib/domain/workflow";

export interface WorkflowExecutionRepository {
  create(execution: WorkflowExecution): WorkflowExecution;
  getById(id: string): WorkflowExecution | undefined;
  listByWorkflowId(workflowId: string): WorkflowExecution[];
  update(execution: WorkflowExecution): WorkflowExecution;
}
