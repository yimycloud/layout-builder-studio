import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet, getClientType, setClientType, type ApiClientType, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { RefreshCw, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/api-demo")({
  component: ApiDemoPage,
});

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function ApiDemoPage() {
  const [client, setClient] = useState<ApiClientType>("axios");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSource, setLastSource] = useState<ApiClientType | null>(null);

  useEffect(() => {
    setClient(getClientType());
  }, []);

  const load = async (type: ApiClientType) => {
    setLoading(true);
    try {
      const res = await apiGet<Post[]>("/posts?_limit=6", type);
      setPosts(res.data);
      setLastSource(res.source);
      toast.success(`Datos cargados via ${res.source.toUpperCase()}`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Error desconocido";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = (type: ApiClientType) => {
    setClient(type);
    setClientType(type);
    void load(type);
  };

  useEffect(() => {
    void load(getClientType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout title="API Demo">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Cliente API seguro
            </CardTitle>
            <CardDescription>
              Cambia entre <strong>axios</strong> y <strong>fetch</strong>. Ambos comparten validación
              de URL, timeout, AbortController, headers seguros y manejo centralizado de errores.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-lg border bg-muted p-1">
              <Button
                size="sm"
                variant={client === "axios" ? "default" : "ghost"}
                onClick={() => handleSwitch("axios")}
              >
                Axios
              </Button>
              <Button
                size="sm"
                variant={client === "fetch" ? "default" : "ghost"}
                onClick={() => handleSwitch("fetch")}
              >
                Fetch
              </Button>
            </div>
            <Button size="sm" variant="outline" onClick={() => load(client)} disabled={loading}>
              <RefreshCw className={loading ? "animate-spin" : ""} />
              Recargar
            </Button>
            {lastSource && (
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                Última carga: {lastSource}
              </Badge>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-5/6" />
                  </CardContent>
                </Card>
              ))
            : posts.map((p) => (
                <Card key={p.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base capitalize line-clamp-1">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{p.body}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </AppLayout>
  );
}
