import { eq } from "drizzle-orm";

import type { WorkflowExecution } from "@/lib/domain/workflow";
import type { AsyncWorkflowExecutionRepository } from "@/lib/repositories/async-workflow-execution-repository";
import { db } from "@/lib/db/client";
import { workflowExecutions } from "@/lib/db/schema";
import { workflowExecutionFromRow } from "@/lib/db/workflow-execution-row-mapper";

export class PostgresWorkflowExecutionRepository
  implements AsyncWorkflowExecutionRepository {
  async create(execution: WorkflowExecution): Promise<WorkflowExecution> {
    const [row] = await db
      .insert(workflowExecutions)
      .values({
        id: execution.id,
        workflowId: execution.workflowId,
        status: execution.status,
        startedAt: execution.startedAt ?? null,
        completedAt: execution.completedAt ?? null,
        errorCode: execution.errorCode ?? null,
        errorMessage: execution.errorMessage ?? null,
      })
      .returning();

    if (!row) {
      throw new Error(
        `Workflow execution could not be created: ${execution.id}`,
      );
    }

    return workflowExecutionFromRow(row);
  }

  async getById(id: string): Promise<WorkflowExecution | undefined> {
    const [row] = await db
      .select()
      .from(workflowExecutions)
      .where(eq(workflowExecutions.id, id))
      .limit(1);

    return row ? workflowExecutionFromRow(row) : undefined;
  }

  async listByWorkflowId(
    workflowId: string,
  ): Promise<WorkflowExecution[]> {
    const rows = await db
      .select()
      .from(workflowExecutions)
      .where(eq(workflowExecutions.workflowId, workflowId));

    return rows.map(workflowExecutionFromRow);
  }

  async update(execution: WorkflowExecution): Promise<WorkflowExecution> {
    const [row] = await db
      .update(workflowExecutions)
      .set({
        workflowId: execution.workflowId,
        status: execution.status,
        startedAt: execution.startedAt ?? null,
        completedAt: execution.completedAt ?? null,
        errorCode: execution.errorCode ?? null,
        errorMessage: execution.errorMessage ?? null,
      })
      .where(eq(workflowExecutions.id, execution.id))
      .returning();

    if (!row) {
      throw new Error(
        `Workflow execution not found: ${execution.id}`,
      );
    }

    return workflowExecutionFromRow(row);
  }
}
