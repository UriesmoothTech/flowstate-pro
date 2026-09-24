import { NextResponse } from "next/server";
import { completeWorkflowExecutionAsync } from "@/lib/services/async-workflow-execution-lifecycle-service";
import { createWorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository-factory";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const completedAt = new URL(request.url).searchParams.get("completedAt");

  if (!completedAt) {
    return NextResponse.json(
      {
        error: "COMPLETED_AT_REQUIRED",
        message: "completedAt query parameter is required",
      },
      { status: 400 },
    );
  }

  try {
    const repository = await createWorkflowExecutionRepository();

    const execution = await completeWorkflowExecutionAsync(
      id,
      completedAt,
      repository,
    );

    return NextResponse.json(execution, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to complete execution";

    if (message === `Workflow execution not found: ${id}`) {
      return NextResponse.json(
        {
          error: "EXECUTION_NOT_FOUND",
          message,
        },
        { status: 404 },
      );
    }

    if (message.startsWith("Invalid completedAt timestamp:")) {
      return NextResponse.json(
        {
          error: "INVALID_COMPLETED_AT",
          message,
        },
        { status: 400 },
      );
    }

    if (
      message.startsWith(
        "completedAt cannot be earlier than startedAt",
      )
    ) {
      return NextResponse.json(
        {
          error: "INVALID_COMPLETED_AT_ORDER",
          message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "EXECUTION_COMPLETE_FAILED",
        message,
      },
      { status: 409 },
    );
  }
}
