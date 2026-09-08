import type { WorkflowExecution } from "@/lib/domain/workflow";
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
    );

    expect(result.status).toBe("failed");
    expect(result.completedAt).toBe("2026-09-08T00:06:00.000Z");
    expect(getWorkflowExecution("execution-fail")).toEqual(result);
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
