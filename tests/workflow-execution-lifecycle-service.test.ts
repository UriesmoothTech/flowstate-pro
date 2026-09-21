import type { WorkflowExecution } from "@/lib/domain/workflow";
import { InMemoryWorkflowExecutionRepository } from "@/lib/repositories/in-memory-workflow-execution-repository";
import {
  createWorkflowExecution,
  getWorkflowExecution,
} from "@/lib/services/workflow-execution-service";
import {
  completeWorkflowExecution,
  failWorkflowExecution,
  startWorkflowExecution,
} from "@/lib/services/workflow-execution-lifecycle-service";

describe("Workflow execution lifecycle", () => {
  it("starts a queued execution", () => {
    createWorkflowExecution({
      id: "execution-start",
      workflowId: "workflow-demo",
      status: "queued",
    });

    const result = startWorkflowExecution(
      "execution-start",
      "2026-09-08T00:00:00.000Z",
    );

    expect(result.status).toBe("running");
    expect(result.startedAt).toBe("2026-09-08T00:00:00.000Z");
    expect(getWorkflowExecution("execution-start")).toEqual(result);
  });

  it("completes a running execution", () => {
    createWorkflowExecution({
      id: "execution-complete",
      workflowId: "workflow-demo",
      status: "running",
      startedAt: "2026-09-08T00:00:00.000Z",
    });

    const result = completeWorkflowExecution(
      "execution-complete",
      "2026-09-08T00:05:00.000Z",
    );

    expect(result.status).toBe("completed");
    expect(result.completedAt).toBe("2026-09-08T00:05:00.000Z");
    expect(getWorkflowExecution("execution-complete")).toEqual(result);
  });

  it("fails a running execution", () => {
    createWorkflowExecution({
      id: "execution-fail",
      workflowId: "workflow-demo",
      status: "running",
      startedAt: "2026-09-08T00:00:00.000Z",
    });

    const result = failWorkflowExecution(
      "execution-fail",
      "2026-09-08T00:06:00.000Z",
      undefined,
      {
        errorCode: "EXECUTION_RUNTIME_ERROR",
        errorMessage: "Worker process exited unexpectedly",
      },
    );

    expect(result.status).toBe("failed");
    expect(result.completedAt).toBe("2026-09-08T00:06:00.000Z");
    expect(result.errorCode).toBe("EXECUTION_RUNTIME_ERROR");
    expect(result.errorMessage).toBe("Worker process exited unexpectedly");
    expect(getWorkflowExecution("execution-fail")).toEqual(result);
  });

  it("uses default failure metadata when none is provided", () => {
    createWorkflowExecution({
      id: "execution-default-failure",
      workflowId: "workflow-demo",
      status: "running",
      startedAt: "2026-09-08T00:00:00.000Z",
    });

    const result = failWorkflowExecution(
      "execution-default-failure",
      "2026-09-08T00:07:00.000Z",
    );

    expect(result.errorCode).toBe("EXECUTION_UNKNOWN_ERROR");
    expect(result.errorMessage).toBe("Workflow execution failed");
  });

  it("rejects starting a non-queued execution", () => {
    createWorkflowExecution({
      id: "execution-invalid-start",
      workflowId: "workflow-demo",
      status: "completed",
    });

    expect(() =>
      startWorkflowExecution(
        "execution-invalid-start",
        "2026-09-08T00:00:00.000Z",
      ),
    ).toThrow(
      "Cannot start workflow execution execution-invalid-start from status completed",
    );
  });

  it("rejects completing a non-running execution", () => {
    createWorkflowExecution({
      id: "execution-invalid-complete",
      workflowId: "workflow-demo",
      status: "queued",
    });

    expect(() =>
      completeWorkflowExecution(
        "execution-invalid-complete",
        "2026-09-08T00:05:00.000Z",
      ),
    ).toThrow(
      "Cannot complete workflow execution execution-invalid-complete from status queued",
    );
  });

  it("rejects failing a non-running execution", () => {
    createWorkflowExecution({
      id: "execution-invalid-fail",
      workflowId: "workflow-demo",
      status: "completed",
    });

    expect(() =>
      failWorkflowExecution(
        "execution-invalid-fail",
        "2026-09-08T00:06:00.000Z",
      ),
    ).toThrow(
      "Cannot fail workflow execution execution-invalid-fail from status completed",
    );
  });

  it("rejects an unknown execution", () => {
    expect(() =>
      startWorkflowExecution(
        "does-not-exist",
        "2026-09-08T00:00:00.000Z",
      ),
    ).toThrow("Workflow execution not found: does-not-exist");
  });
});

describe("workflow execution timestamp validation", () => {
  it("rejects an invalid startedAt timestamp", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    createWorkflowExecution(
      {
        id: "execution-invalid-started-at",
        workflowId: "workflow-timestamp-validation",
        status: "queued",
      },
      repository,
    );

    expect(() =>
      startWorkflowExecution(
        "execution-invalid-started-at",
        "not-a-timestamp",
        repository,
      ),
    ).toThrow(
      "Invalid startedAt timestamp: not-a-timestamp",
    );
  });

  it("rejects an impossible startedAt date", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    createWorkflowExecution(
      {
        id: "execution-impossible-started-at",
        workflowId: "workflow-timestamp-validation",
        status: "queued",
      },
      repository,
    );

    expect(() =>
      startWorkflowExecution(
        "execution-impossible-started-at",
        "2026-02-30T14:00:00.000Z",
        repository,
      ),
    ).toThrow(
      "Invalid startedAt timestamp: 2026-02-30T14:00:00.000Z",
    );
  });

  it("rejects an invalid completedAt timestamp", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    createWorkflowExecution(
      {
        id: "execution-invalid-completed-at",
        workflowId: "workflow-timestamp-validation",
        status: "running",
        startedAt: "2026-09-19T14:00:00.000Z",
      },
      repository,
    );

    expect(() =>
      completeWorkflowExecution(
        "execution-invalid-completed-at",
        "not-a-timestamp",
        repository,
      ),
    ).toThrow(
      "Invalid completedAt timestamp: not-a-timestamp",
    );
  });

  it("rejects completion before startedAt", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    createWorkflowExecution(
      {
        id: "execution-complete-before-start",
        workflowId: "workflow-timestamp-validation",
        status: "running",
        startedAt: "2026-09-19T14:00:00.000Z",
      },
      repository,
    );

    expect(() =>
      completeWorkflowExecution(
        "execution-complete-before-start",
        "2026-09-19T13:59:59.999Z",
        repository,
      ),
    ).toThrow(
      "completedAt cannot be earlier than startedAt for workflow execution execution-complete-before-start",
    );
  });

  it("rejects failure before startedAt", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    createWorkflowExecution(
      {
        id: "execution-fail-before-start",
        workflowId: "workflow-timestamp-validation",
        status: "running",
        startedAt: "2026-09-19T14:00:00.000Z",
      },
      repository,
    );

    expect(() =>
      failWorkflowExecution(
        "execution-fail-before-start",
        "2026-09-19T13:59:59.999Z",
        repository,
      ),
    ).toThrow(
      "completedAt cannot be earlier than startedAt for workflow execution execution-fail-before-start",
    );
  });
});
