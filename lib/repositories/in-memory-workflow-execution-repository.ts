import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { WorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository";

export class InMemoryWorkflowExecutionRepository
  implements WorkflowExecutionRepository
{
  private readonly executions = new Map<string, WorkflowExecution>();

  create(execution: WorkflowExecution): WorkflowExecution {
    if (this.executions.has(execution.id)) {
      throw new Error(
        `Workflow execution already exists: ${execution.id}`,
      );
    }

    const stored = { ...execution };
    this.executions.set(stored.id, stored);
    return { ...stored };
  }

  getById(id: string): WorkflowExecution | undefined {
    const execution = this.executions.get(id);
    return execution ? { ...execution } : undefined;
  }

  listByWorkflowId(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter((execution) => execution.workflowId === workflowId)
      .map((execution) => ({ ...execution }));
  }

  update(execution: WorkflowExecution): WorkflowExecution {
    if (!this.executions.has(execution.id)) {
      throw new Error(
        `Workflow execution not found: ${execution.id}`,
      );
    }

    const stored = { ...execution };
    this.executions.set(stored.id, stored);
    return { ...stored };
  }
}
