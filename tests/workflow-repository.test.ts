import { InMemoryWorkflowRepository } from "@/lib/repositories/in-memory-workflow-repository";

describe("InMemoryWorkflowRepository", () => {
  it("lists workflows", () => {
    const repository = new InMemoryWorkflowRepository();

    const workflows = repository.list();

    expect(workflows).toHaveLength(1);
    expect(workflows[0].id).toBe("workflow-demo");
  });

  it("finds a workflow by id", () => {
    const repository = new InMemoryWorkflowRepository();

    const workflow = repository.getById("workflow-demo");

    expect(workflow?.name).toBe("Example Workflow");
  });

  it("returns undefined for an unknown workflow", () => {
    const repository = new InMemoryWorkflowRepository();

    expect(repository.getById("does-not-exist")).toBeUndefined();
  });
});
