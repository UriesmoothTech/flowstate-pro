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

  it("rejects duplicate execution IDs", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    repository.create(execution);

    expect(() => repository.create(execution)).toThrow(
      "Workflow execution already exists: execution-1",
    );
  });

  it("rejects updates for unknown executions", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    expect(() =>
      repository.update({
        id: "does-not-exist",
        workflowId: "workflow-demo",
        status: "running",
      }),
    ).toThrow("Workflow execution not found: does-not-exist");
  });

  it("protects stored state from mutations to returned objects", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    const created = repository.create(execution);
    created.status = "failed";

    expect(repository.getById("execution-1")).toEqual(execution);

    const listed = repository.listByWorkflowId("workflow-demo");
    listed[0].status = "completed";

    expect(repository.getById("execution-1")).toEqual(execution);
  });

  it("isolates stored state when updating an execution", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    repository.create(execution);

    const updated: WorkflowExecution = {
      ...execution,
      status: "running",
      startedAt: "2026-09-08T00:00:00.000Z",
    };

    const result = repository.update(updated);
    result.status = "failed";

    expect(repository.getById("execution-1")).toEqual(updated);
  });

  it("handles a 1,000-execution workflow load without cross-workflow leakage", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    for (let index = 0; index < 1_000; index += 1) {
      repository.create({
        id: `execution-${index}`,
        workflowId: index % 2 === 0 ? "workflow-even" : "workflow-odd",
        status: "queued",
      });
    }

    const evenExecutions = repository.listByWorkflowId("workflow-even");
    const oddExecutions = repository.listByWorkflowId("workflow-odd");

    expect(evenExecutions).toHaveLength(500);
    expect(oddExecutions).toHaveLength(500);

    expect(
      evenExecutions.every(
        (execution) => execution.workflowId === "workflow-even",
      ),
    ).toBe(true);

    expect(
      oddExecutions.every(
        (execution) => execution.workflowId === "workflow-odd",
      ),
    ).toBe(true);
  });
});
