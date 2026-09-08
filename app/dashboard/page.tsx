import { StatusBadge } from "@/components/ui/status-badge";
import { listWorkflows } from "@/lib/services/workflow-service";

export default function DashboardPage() {
  const workflows = listWorkflows();

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="eyebrow">FLOWSTATE PRO</p>
          <h1>Workspace overview</h1>
          <p>
            A foundation for intelligent workflow orchestration across the
            UriesmoothTech platform.
          </p>
        </div>
      </header>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Workflows</span>
          <strong>{workflows.length}</strong>
        </article>

        <article className="metric-card">
          <span>Active executions</span>
          <strong>0</strong>
        </article>

        <article className="metric-card">
          <span>System status</span>
          <strong>Operational</strong>
        </article>
      </div>

      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Recent workflows</h2>
            <p>Current workflow definitions available to this workspace.</p>
          </div>
        </div>

        {workflows.map((workflow) => (
          <div className="workflow-row" key={workflow.id}>
            <div>
              <strong>{workflow.name}</strong>
              <p>{workflow.description}</p>
            </div>
            <StatusBadge status={workflow.status} />
          </div>
        ))}
      </article>
    </section>
  );
}
