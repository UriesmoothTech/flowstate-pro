import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/workflows", label: "Workflows" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <span className="brand-mark">F</span>
        <div>
          <strong>FlowState Pro</strong>
          <small>UriesmoothTech</small>
        </div>
      </div>

      <nav>
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
