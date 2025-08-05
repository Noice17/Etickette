// src/app/(main)/layout.tsx
import AppShell from "../components/AppShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}