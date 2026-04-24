import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/calendar")({
  component: () => (
    <AppLayout title="Calendario">
      <Card><CardContent className="p-6">Próximos eventos aparecerán aquí.</CardContent></Card>
    </AppLayout>
  ),
});
