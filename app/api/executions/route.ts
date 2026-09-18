import { NextResponse } from "next/server";
import { z } from "zod";
import { createWorkflowExecution } from "@/lib/services/workflow-execution-service";

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

    const execution = createWorkflowExecution(parsed.data);

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
