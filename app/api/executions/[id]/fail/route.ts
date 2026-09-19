import { NextResponse } from "next/server";
import type { WorkflowExecutionFailureCode } from "@/lib/domain/workflow";
import { failWorkflowExecution } from "@/lib/services/workflow-execution-lifecycle-service";

const FAILURE_CODES: WorkflowExecutionFailureCode[] = [
  "EXECUTION_RUNTIME_ERROR",
  "EXECUTION_TIMEOUT",
  "EXECUTION_CANCELLED",
  "EXECUTION_UNKNOWN_ERROR",
];

function isWorkflowExecutionFailureCode(
  value: string,
): value is WorkflowExecutionFailureCode {
  return FAILURE_CODES.includes(value as WorkflowExecutionFailureCode);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const url = new URL(request.url);
  const completedAt = url.searchParams.get("completedAt");
  const errorCodeParam = url.searchParams.get("errorCode");
  const errorMessage = url.searchParams.get("errorMessage") ?? undefined;

  if (!completedAt) {
    return NextResponse.json(
      {
        error: "COMPLETED_AT_REQUIRED",
        message: "completedAt query parameter is required",
      },
      { status: 400 },
    );
  }

  if (
    errorCodeParam !== null &&
    !isWorkflowExecutionFailureCode(errorCodeParam)
  ) {
    return NextResponse.json(
      {
        error: "INVALID_ERROR_CODE",
        message: `Invalid workflow execution error code: ${errorCodeParam}`,
      },
      { status: 400 },
    );
  }

  const errorCode = errorCodeParam ?? undefined;

  try {
    const execution = failWorkflowExecution(id, completedAt, undefined, {
      errorCode,
      errorMessage,
    });

    return NextResponse.json(execution, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fail execution";

    if (message === `Workflow execution not found: ${id}`) {
      return NextResponse.json(
        {
          error: "EXECUTION_NOT_FOUND",
          message,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: "EXECUTION_FAIL_FAILED",
        message,
      },
      { status: 409 },
    );
  }
}
