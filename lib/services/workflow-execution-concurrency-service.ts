const DEFAULT_MAX_CONCURRENT_EXECUTIONS = 3;

function readConcurrencyLimit(): number {
  const configured = Number(
    process.env.FLOWSTATE_MAX_CONCURRENT_EXECUTIONS ??
      DEFAULT_MAX_CONCURRENT_EXECUTIONS,
  );

  if (!Number.isInteger(configured) || configured < 1) {
    return DEFAULT_MAX_CONCURRENT_EXECUTIONS;
  }

  return configured;
}

interface Waiter {
  resolve: () => void;
}

class WorkflowExecutionConcurrencyController {
  private active = 0;
  private readonly waiters: Waiter[] = [];

  get limit(): number {
    return readConcurrencyLimit();
  }

  get activeCount(): number {
    return this.active;
  }

  get queuedCount(): number {
    return this.waiters.length;
  }

  async acquire(): Promise<() => void> {
    if (this.active < this.limit) {
      this.active += 1;
      return this.createRelease();
    }

    await new Promise<void>((resolve) => {
      this.waiters.push({ resolve });
    });

    this.active += 1;
    return this.createRelease();
  }

  private createRelease(): () => void {
    let released = false;

    return () => {
      if (released) {
        return;
      }

      released = true;
      this.active -= 1;

      const next = this.waiters.shift();

      if (next) {
        next.resolve();
      }
    };
  }
}

export const workflowExecutionConcurrencyController =
  new WorkflowExecutionConcurrencyController();

export async function runWithWorkflowExecutionConcurrency<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const release =
    await workflowExecutionConcurrencyController.acquire();

  try {
    return await operation();
  } finally {
    release();
  }
}
