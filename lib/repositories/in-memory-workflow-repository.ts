import type { Workflow } from "@/lib/domain/workflow";
import type { WorkflowRepository } from "@/lib/repositories/workflow-repository";

const workflows: Workflow[] = [
  {
    id: "workflow-demo",
    name: "Example Workflow",
    description: "Initial FlowState Pro workflow foundation.",
    status: "draft",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

export class InMemoryWorkflowRepository implements WorkflowRepository {
  list(): Workflow[] {
    return workflows;
  }

  getById(id: string): Workflow | undefined {
    return workflows.find((workflow) => workflow.id === id);
  }
}
