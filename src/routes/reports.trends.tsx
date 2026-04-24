import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports/trends")({
  component: () => (
    <AppLayout title="Tendencias">
      <Card>
        <CardHeader><CardTitle>Tendencias trimestrales</CardTitle></CardHeader>
        <CardContent>Crecimiento sostenido del 8% trimestral.</CardContent>
      </Card>
    </AppLayout>
  ),
});
