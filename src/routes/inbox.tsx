import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/inbox")({
  component: () => (
    <AppLayout title="Bandeja">
      <Card><CardContent className="p-6">No tienes mensajes nuevos.</CardContent></Card>
    </AppLayout>
  ),
});
