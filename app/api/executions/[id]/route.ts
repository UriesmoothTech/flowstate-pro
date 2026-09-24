import { NextResponse } from "next/server";
import { getWorkflowExecutionAsync } from "@/lib/services/async-workflow-execution-service";
import { createWorkflowExecutionRepository } from "@/lib/repositories/workflow-execution-repository-factory";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const repository = await createWorkflowExecutionRepository();
    const execution = await getWorkflowExecutionAsync(id, repository);

    if (!execution) {
      return NextResponse.json(
        {
          error: "EXECUTION_NOT_FOUND",
          message: `Workflow execution not found: ${id}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(execution, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to get execution";

    return NextResponse.json(
      {
        error: "EXECUTION_GET_FAILED",
        message,
      },
      { status: 500 },
    );
  }
}
