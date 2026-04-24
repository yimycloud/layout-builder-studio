import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/income/invoices")({
  component: () => (
    <AppLayout title="Facturas">
      <Card>
        <CardHeader><CardTitle>Facturas emitidas</CardTitle></CardHeader>
        <CardContent>142 facturas este mes — Total $98,420.</CardContent>
      </Card>
    </AppLayout>
  ),
});
