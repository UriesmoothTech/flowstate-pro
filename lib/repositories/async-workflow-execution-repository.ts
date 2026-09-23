import type { WorkflowExecution } from "@/lib/domain/workflow";

export interface AsyncWorkflowExecutionRepository {
  create(execution: WorkflowExecution): Promise<WorkflowExecution>;
  getById(id: string): Promise<WorkflowExecution | undefined>;
  listByWorkflowId(workflowId: string): Promise<WorkflowExecution[]>;
  update(execution: WorkflowExecution): Promise<WorkflowExecution>;
}
