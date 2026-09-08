export default function SettingsPage() {
  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="eyebrow">SYSTEM</p>
          <h1>Settings</h1>
          <p>Workspace and application configuration will live here.</p>
        </div>
      </header>

      <article className="panel">
        <h2>Architecture foundation</h2>
        <p>
          Authentication, authorization, persistence, integrations, and
          production configuration will be introduced in later phases.
        </p>
      </article>
    </section>
  );
}
