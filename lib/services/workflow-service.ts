import type { Workflow } from "@/lib/domain/workflow";
import { InMemoryWorkflowRepository } from "@/lib/repositories/in-memory-workflow-repository";
import type { WorkflowRepository } from "@/lib/repositories/workflow-repository";

const repository: WorkflowRepository = new InMemoryWorkflowRepository();

export function listWorkflows(): Workflow[] {
  return repository.list();
}

export function getWorkflow(id: string): Workflow | undefined {
  return repository.getById(id);
}
