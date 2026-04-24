import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports/documents")({
  component: () => (
    <AppLayout title="Documentos">
      <Card>
        <CardHeader><CardTitle>Documentos generados</CardTitle></CardHeader>
        <CardContent>27 reportes disponibles para descarga.</CardContent>
      </Card>
    </AppLayout>
  ),
});
