import { NextResponse } from "next/server";
import { getWorkflowExecution } from "@/lib/services/workflow-execution-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const execution = getWorkflowExecution(id);

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
}
