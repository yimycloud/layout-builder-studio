import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/reports")({
  component: () => (
    <AppLayout title="Reportes">
      <Card><CardContent className="p-6">Reportes y métricas.</CardContent></Card>
    </AppLayout>
  ),
});
