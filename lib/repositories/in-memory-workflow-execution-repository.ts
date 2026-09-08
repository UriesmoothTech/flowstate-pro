import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";

export class InMemoryWorkflowExecutionRepository
  implements WorkflowExecutionRepository
{
  private readonly executions = new Map<string, WorkflowExecution>();

  create(execution: WorkflowExecution): WorkflowExecution {
    this.executions.set(execution.id, execution);

    return execution;
  }

  getById(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  listByWorkflowId(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter(
      (execution) => execution.workflowId === workflowId,
    );
  }

  update(execution: WorkflowExecution): WorkflowExecution {
    this.executions.set(execution.id, execution);

    return execution;
  }
}
