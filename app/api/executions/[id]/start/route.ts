import { NextResponse } from "next/server";
import { startWorkflowExecutionAsync } from "@/lib/services/async-workflow-execution-lifecycle-service";
import { createWorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository-factory";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const startedAt = new URL(request.url).searchParams.get("startedAt");

  if (!startedAt) {
    return NextResponse.json(
      {
        error: "STARTED_AT_REQUIRED",
        message: "startedAt query parameter is required",
      },
      { status: 400 },
    );
  }

  try {
    const repository = await createWorkflowExecutionRepository();

    const execution = await startWorkflowExecutionAsync(
      id,
      startedAt,
      repository,
    );

    return NextResponse.json(execution, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start execution";

    if (message.startsWith("Invalid startedAt timestamp:")) {
      return NextResponse.json(
        {
          error: "INVALID_STARTED_AT",
          message,
        },
        { status: 400 },
      );
    }

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
        error: "EXECUTION_START_FAILED",
        message,
      },
      { status: 409 },
    );
  }
}
