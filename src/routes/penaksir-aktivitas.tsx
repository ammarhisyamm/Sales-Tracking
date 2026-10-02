import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/penaksir-aktivitas")({
  component: () => <Outlet />,
});
