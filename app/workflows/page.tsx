import { StatusBadge } from "@/components/ui/status-badge";
import { listWorkflows } from "@/lib/services/workflow-service";

export default function WorkflowsPage() {
  const workflows = listWorkflows();

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="eyebrow">ORCHESTRATION</p>
          <h1>Workflows</h1>
          <p>Create, manage, execute, and monitor FlowState workflows.</p>
        </div>
      </header>

      <div className="panel">
        {workflows.map((workflow) => (
          <div className="workflow-row" key={workflow.id}>
            <div>
              <strong>{workflow.name}</strong>
              <p>{workflow.description}</p>
            </div>
            <StatusBadge status={workflow.status} />
          </div>
        ))}
      </div>
    </section>
  );
}
