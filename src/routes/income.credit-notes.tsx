import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/income/credit-notes")({
  component: () => (
    <AppLayout title="Notas de Crédito">
      <Card>
        <CardHeader><CardTitle>Notas emitidas</CardTitle></CardHeader>
        <CardContent>8 notas de crédito — Total $2,140.</CardContent>
      </Card>
    </AppLayout>
  ),
});
