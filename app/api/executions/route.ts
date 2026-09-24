import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createWorkflowExecutionAsync,
  listWorkflowExecutionsAsync,
} from "@/lib/services/async-workflow-execution-service";
import { createWorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository-factory";

const workflowExecutionSchema = z.object({
  id: z.string().min(1),
  workflowId: z.string().min(1),
  status: z.enum(["queued", "running", "completed", "failed"]),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  errorCode: z
    .enum([
      "EXECUTION_RUNTIME_ERROR",
      "EXECUTION_TIMEOUT",
      "EXECUTION_CANCELLED",
      "EXECUTION_UNKNOWN_ERROR",
    ])
    .optional(),
  errorMessage: z.string().optional(),
});

export async function GET(request: Request) {
  const workflowId = new URL(request.url).searchParams.get("workflowId");

  if (!workflowId) {
    return NextResponse.json(
      {
        error: "WORKFLOW_ID_REQUIRED",
        message: "workflowId query parameter is required",
      },
      { status: 400 },
    );
  }

  try {
    const repository = await createWorkflowExecutionRepository();

    const executions = await listWorkflowExecutionsAsync(
      workflowId,
      repository,
    );

    return NextResponse.json(executions, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to list executions";

    return NextResponse.json(
      {
        error: "EXECUTION_LIST_FAILED",
        message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = workflowExecutionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "EXECUTION_VALIDATION_FAILED",
          message: "Invalid workflow execution payload",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const repository = await createWorkflowExecutionRepository();

    const execution = await createWorkflowExecutionAsync(
      parsed.data,
      repository,
    );

    return NextResponse.json(execution, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create execution";

    return NextResponse.json(
      {
        error: "EXECUTION_CREATE_FAILED",
        message,
      },
      { status: 400 },
    );
  }
}
