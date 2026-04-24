import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports/distribution")({
  component: () => (
    <AppLayout title="Distribución">
      <Card>
        <CardHeader><CardTitle>Distribución por categoría</CardTitle></CardHeader>
        <CardContent>Producto A 45% · Producto B 30% · Producto C 25%.</CardContent>
      </Card>
    </AppLayout>
  ),
});
