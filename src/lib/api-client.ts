import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Cliente API unificado con dos implementaciones (axios y fetch)
 * intercambiables. Aplica buenas prácticas de seguridad:
 *
 * - Timeouts para evitar requests colgadas
 * - AbortController para cancelación
 * - Headers de seguridad (Content-Type, Accept)
 * - Manejo centralizado de errores (no se filtran detalles internos)
 * - Validación de URL para prevenir SSRF en runtime de cliente
 * - Credenciales same-origin por defecto (evita CSRF cross-site)
 * - No se loguean tokens ni payloads sensibles
 * - Token de auth se inyecta vía interceptor / función getter
 *   (NUNCA hardcodear API keys en el cliente)
 */

export type ApiClientType = "axios" | "fetch";

const STORAGE_KEY = "api_client_preference";
const DEFAULT_TIMEOUT_MS = 10_000;

// Base URL pública (no secreta). Para APIs privadas usar un proxy backend.
const BASE_URL = "https://jsonplaceholder.typicode.com";

// Lista blanca de hosts permitidos (defensa contra SSRF/abuso)
const ALLOWED_HOSTS = new Set(["jsonplaceholder.typicode.com"]);

export interface ApiResponse<T> {
  data: T;
  status: number;
  source: ApiClientType;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public source?: ApiClientType,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function assertSafeUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url, BASE_URL);
  } catch {
    throw new ApiError("URL inválida");
  }
  if (parsed.protocol !== "https:") {
    throw new ApiError("Solo se permite HTTPS");
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new ApiError("Host no permitido");
  }
  return parsed;
}

// Token getter: en producción leerlo de un store seguro (no localStorage).
// Idealmente usar cookies httpOnly + sameSite=strict gestionadas por backend.
function getAuthToken(): string | null {
  return null;
}

// ───────── Axios ─────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: false, // explícito: no enviar cookies cross-site
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (r) => r,
  (error) => {
    // No exponer detalles internos del error al usuario final
    const status = error?.response?.status;
    const safeMsg = status ? `Error ${status}` : "Error de red";
    return Promise.reject(new ApiError(safeMsg, status, "axios"));
  },
);

async function axiosRequest<T>(path: string, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
  assertSafeUrl(BASE_URL + path);
  const res = await axiosInstance.request<T>({ url: path, ...config });
  return { data: res.data, status: res.status, source: "axios" };
}

// ───────── Fetch ─────────
async function fetchRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = assertSafeUrl(BASE_URL + path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const res = await fetch(url.toString(), {
      ...init,
      headers,
      signal: controller.signal,
      credentials: "same-origin", // evita CSRF cross-origin
      mode: "cors",
      referrerPolicy: "no-referrer",
    });
    if (!res.ok) {
      throw new ApiError(`Error ${res.status}`, res.status, "fetch");
    }
    const data = (await res.json()) as T;
    return { data, status: res.status, source: "fetch" };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new ApiError("Timeout de la petición", 408, "fetch");
    }
    throw new ApiError("Error de red", undefined, "fetch");
  } finally {
    clearTimeout(timeout);
  }
}

// ───────── API pública ─────────
export function getClientType(): ApiClientType {
  if (typeof window === "undefined") return "axios";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "fetch" ? "fetch" : "axios";
}

export function setClientType(type: ApiClientType): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, type);
  }
}

export async function apiGet<T>(path: string, type?: ApiClientType): Promise<ApiResponse<T>> {
  const client = type ?? getClientType();
  return client === "axios" ? axiosRequest<T>(path) : fetchRequest<T>(path);
}
