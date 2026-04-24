import { createFileRoute } from "@tanstack/react-router";
import { ClientsForm } from "@/components/clients-form";
import { AppLayout } from "@/components/app-layout";

export const Route = createFileRoute("/income/payments")({
  component: () => (
    <AppLayout title="Pagos / Clientes">
      <ClientsForm />
    </AppLayout>
  ),
});
