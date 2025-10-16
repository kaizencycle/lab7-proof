"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();

  const links = [
    { href: "/hub", label: "OAA Hub" },
    { href: "/reflections", label: "Reflections" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <nav style={wrap}>
      <div style={left}>
        <span style={{ fontWeight: 800, fontSize: 16 }}>OAA Central</span>
      </div>
      <div style={right}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              ...linkStyle,
              borderBottom: path === href ? "2px solid white" : "2px solid transparent",
              opacity: path === href ? 1 : 0.7,
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const wrap: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 18px",
  background: "#0f172a",
  color: "white",
  borderBottom: "1px solid #1e293b",
};
const left: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };
const right: React.CSSProperties = { display: "flex", gap: 16, alignItems: "center" };
const linkStyle: React.CSSProperties = { textDecoration: "none", color: "white", fontWeight: 500 };