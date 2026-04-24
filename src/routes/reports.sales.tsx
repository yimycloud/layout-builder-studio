import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports/sales")({
  component: () => (
    <AppLayout title="Reporte de Ventas">
      <Card>
        <CardHeader><CardTitle>Ventas del mes</CardTitle></CardHeader>
        <CardContent>Total: $48,230 — +12% vs mes anterior.</CardContent>
      </Card>
    </AppLayout>
  ),
});
