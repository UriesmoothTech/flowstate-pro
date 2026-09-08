import type { Workflow } from "@/lib/domain/workflow";

export interface WorkflowRepository {
  list(): Workflow[];
  getById(id: string): Workflow | undefined;
}
