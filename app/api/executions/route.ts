import { NextResponse } from "next/server";
import type { WorkflowExecution } from "@/lib/domain/workflow";
import { createWorkflowExecution } from "@/lib/services/workflow-execution-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WorkflowExecution;

    const execution = createWorkflowExecution(body);

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
