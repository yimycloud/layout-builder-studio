import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AppLayout title="Ajustes">
      <Card><CardContent className="p-6">Configuración de la cuenta.</CardContent></Card>
    </AppLayout>
  ),
});
