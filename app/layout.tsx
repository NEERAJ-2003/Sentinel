import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel — Agent Trust Dashboard",
  description: "Cryptographic trust and governance layer for IBM Bob",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-brand">Sentinel</Link>
          <div className="nav-links">
            <Link href="/">Dashboard</Link>
            <Link href="/approvals">Approvals</Link>
          </div>
        </nav>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
