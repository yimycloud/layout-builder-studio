import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/team")({
  component: () => (
    <AppLayout title="Equipo">
      <Card><CardContent className="p-6">Miembros del equipo.</CardContent></Card>
    </AppLayout>
  ),
});
