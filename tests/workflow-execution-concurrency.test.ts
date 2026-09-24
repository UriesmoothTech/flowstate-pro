import {
  runWithWorkflowExecutionConcurrency,
  workflowExecutionConcurrencyController,
} from "@/lib/services/workflow-execution-concurrency-service";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("workflow execution concurrency", () => {
  const originalLimit =
    process.env.FLOWSTATE_MAX_CONCURRENT_EXECUTIONS;

  beforeEach(() => {
    process.env.FLOWSTATE_MAX_CONCURRENT_EXECUTIONS = "3";
  });

  afterAll(() => {
    if (originalLimit === undefined) {
      delete process.env.FLOWSTATE_MAX_CONCURRENT_EXECUTIONS;
    } else {
      process.env.FLOWSTATE_MAX_CONCURRENT_EXECUTIONS =
        originalLimit;
    }
  });

  it("allows three executions to run concurrently", async () => {
    let active = 0;
    let maximumObserved = 0;

    const executions = Array.from({ length: 3 }, (_, index) =>
      runWithWorkflowExecutionConcurrency(async () => {
        active += 1;
        maximumObserved = Math.max(maximumObserved, active);

        await wait(25);

        active -= 1;

        return index;
      }),
    );

    const results = await Promise.all(executions);

    expect(results).toEqual([0, 1, 2]);
    expect(maximumObserved).toBe(3);
    expect(
      workflowExecutionConcurrencyController.activeCount,
    ).toBe(0);
  });

  it("queues work beyond the three-execution limit", async () => {
    let active = 0;
    let maximumObserved = 0;

    const executions = Array.from({ length: 6 }, (_, index) =>
      runWithWorkflowExecutionConcurrency(async () => {
        active += 1;
        maximumObserved = Math.max(maximumObserved, active);

        await wait(30);

        active -= 1;

        return index;
      }),
    );

    const results = await Promise.all(executions);

    expect(results).toEqual([0, 1, 2, 3, 4, 5]);
    expect(maximumObserved).toBe(3);
    expect(
      workflowExecutionConcurrencyController.activeCount,
    ).toBe(0);
  });

  it("releases a slot when an execution fails", async () => {
    await expect(
      runWithWorkflowExecutionConcurrency(async () => {
        throw new Error("execution failed");
      }),
    ).rejects.toThrow("execution failed");

    expect(
      workflowExecutionConcurrencyController.activeCount,
    ).toBe(0);

    const result = await runWithWorkflowExecutionConcurrency(
      async () => "next execution",
    );

    expect(result).toBe("next execution");
    expect(
      workflowExecutionConcurrencyController.activeCount,
    ).toBe(0);
  });
});
