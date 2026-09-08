import type { WorkflowExecution } from "@/lib/domain/workflow";
import { InMemoryWorkflowExecutionRepository } from "@/lib/repositories/in-memory-workflow-execution-repository";

describe("InMemoryWorkflowExecutionRepository", () => {
  const execution: WorkflowExecution = {
    id: "execution-1",
    workflowId: "workflow-demo",
    status: "queued",
  };

  it("creates and retrieves an execution", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    const created = repository.create(execution);

    expect(created).toEqual(execution);
    expect(repository.getById("execution-1")).toEqual(execution);
  });

  it("lists executions for a workflow", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    repository.create(execution);
    repository.create({
      id: "execution-2",
      workflowId: "workflow-demo",
      status: "running",
    });
    repository.create({
      id: "execution-3",
      workflowId: "workflow-other",
      status: "completed",
    });

    expect(repository.listByWorkflowId("workflow-demo")).toHaveLength(2);
  });

  it("updates an execution", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    repository.create(execution);

    const updated: WorkflowExecution = {
      ...execution,
      status: "running",
      startedAt: "2026-09-08T00:00:00.000Z",
    };

    expect(repository.update(updated)).toEqual(updated);
    expect(repository.getById("execution-1")).toEqual(updated);
  });

  it("returns undefined for an unknown execution", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    expect(repository.getById("does-not-exist")).toBeUndefined();
  });
});
