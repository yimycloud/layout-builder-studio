import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Inbox, Calendar } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const stats = [
  { label: "Usuarios", value: "1,284", icon: Users },
  { label: "Mensajes", value: "342", icon: Inbox },
  { label: "Eventos", value: "27", icon: Calendar },
  { label: "Ingresos", value: "$12.4k", icon: BarChart3 },
];

function Index() {
  return (
    <AppLayout title="Inicio">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
          <p className="text-muted-foreground">Resumen general de tu cuenta.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Últimos eventos en tu workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Nuevo usuario registrado", "Reporte generado", "Evento creado"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm">{t}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
