import { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABELS: Record<string, string> = {
  "": "Inicio",
  inbox: "Bandeja",
  calendar: "Calendario",
  team: "Equipo",
  settings: "Ajustes",
  reports: "Reportes",
  sales: "Ventas",
  trends: "Tendencias",
  distribution: "Distribución",
  documents: "Documentos",
  income: "Ingresos",
  invoices: "Facturas",
  "credit-notes": "Notas de crédito",
  payments: "Pagos",
};

const labelFor = (seg: string) =>
  LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");

export function AppLayout({ children, title }: { children: ReactNode; title: string }) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: labelFor(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b bg-background px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="h-6 w-px bg-border" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  {crumbs.length === 0 ? (
                    <BreadcrumbPage>Inicio</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to="/" className="hover:text-foreground">
                        Inicio
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 1;
                  return (
                    <span key={c.href} className="flex items-center gap-1.5 sm:gap-2.5">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{c.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={c.href} className="hover:text-foreground">
                              {c.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </span>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            <h1 className="sr-only">{title}</h1>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
