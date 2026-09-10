import type { WorkflowExecution } from "@/lib/domain/workflow";
import { InMemoryWorkflowExecutionRepository } from "@/lib/repositories/in-memory-workflow-execution-repository";
import {
  executeWorkflow,
  failExecution,
  getExecutionForOrchestration,
} from "@/lib/services/workflow-execution-orchestration-service";

describe("Workflow execution orchestration", () => {
  it("executes a queued workflow from start to completion", () => {
    const repository = new InMemoryWorkflowExecutionRepository();

    const result = executeWorkflow(
      {
        id: "execution-orchestration",
        workflowId: "workflow-demo",
        status: "queued",
      },
      "2026-09-08T00:00:00.000Z",
      "2026-09-08T00:05:00.000Z",
      repository,
    );

    expect(result).toEqual({
      id: "execution-orchestration",
      workflowId: "workflow-demo",
      status: "completed",
      startedAt: "2026-09-08T00:00:00.000Z",
      completedAt: "2026-09-08T00:05:00.000Z",
    });
  });

  it("retrieves an execution for orchestration", () => {
    const execution: WorkflowExecution = {
      id: "execution-retrieve",
      workflowId: "workflow-demo",
      status: "queued",
    };

    const repository = new InMemoryWorkflowExecutionRepository();
    repository.create(execution);

    expect(
      getExecutionForOrchestration("execution-retrieve", repository),
    ).toEqual(execution);
  });

  it("fails an execution through orchestration", () => {
    const execution: WorkflowExecution = {
      id: "execution-fail",
      workflowId: "workflow-demo",
      status: "running",
      startedAt: "2026-09-08T00:00:00.000Z",
    };

    const repository = new InMemoryWorkflowExecutionRepository();
    repository.create(execution);

    const result = failExecution(
      "execution-fail",
      "2026-09-08T00:06:00.000Z",
      repository,
      {
        errorCode: "EXECUTION_TIMEOUT",
        errorMessage: "Workflow exceeded execution deadline",
      },
    );

    expect(result).toEqual({
      id: "execution-fail",
      workflowId: "workflow-demo",
      status: "failed",
      startedAt: "2026-09-08T00:00:00.000Z",
      completedAt: "2026-09-08T00:06:00.000Z",
      errorCode: "EXECUTION_TIMEOUT",
      errorMessage: "Workflow exceeded execution deadline",
    });
  });
});

