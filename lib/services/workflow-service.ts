import type { Workflow } from "@/lib/domain/workflow";

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

export function listWorkflows(): Workflow[] {
  return workflows;
}
