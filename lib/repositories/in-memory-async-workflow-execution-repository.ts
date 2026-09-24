import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { AsyncWorkflowExecutionRepository } from "@/lib/repositories/async-workflow-execution-repository";

export class InMemoryAsyncWorkflowExecutionRepository
  implements AsyncWorkflowExecutionRepository
{
  private readonly executions = new Map<string, WorkflowExecution>();

  async create(execution: WorkflowExecution): Promise<WorkflowExecution> {
    if (this.executions.has(execution.id)) {
      throw new Error(
        `Workflow execution already exists: ${execution.id}`,
      );
    }

    const stored = { ...execution };
    this.executions.set(stored.id, stored);

    return { ...stored };
  }

  async getById(
    id: string,
  ): Promise<WorkflowExecution | undefined> {
    const execution = this.executions.get(id);

    return execution ? { ...execution } : undefined;
  }

  async listByWorkflowId(
    workflowId: string,
  ): Promise<WorkflowExecution[]> {
    return Array.from(this.executions.values())
      .filter((execution) => execution.workflowId === workflowId)
      .map((execution) => ({ ...execution }));
  }

  async update(
    execution: WorkflowExecution,
  ): Promise<WorkflowExecution> {
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
