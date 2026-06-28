// lib/api.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

const DEFAULT_API_URL = "http://localhost:4000/api/v1";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("LP_API_BASE_URL") || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_URL;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_URL;
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("LP_AUTH_TOKEN");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("LP_AUTH_TOKEN", token);
  }
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("LP_AUTH_TOKEN");
    window.localStorage.removeItem("LP_USER");
  }
}

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: any
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${cleanPath}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login?unauthorized=true";
        }
      }
      throw {
        error: {
          code: "UNAUTHORIZED",
          message: "Sesi Anda telah berakhir, silakan masuk kembali.",
        },
      } as ApiErrorResponse;
    }

    // Handle empty or 204 responses gracefully
    if (res.status === 204) {
      return { data: null as any };
    }

    let json: any;
    try {
      json = await res.json();
    } catch (e) {
      if (!res.ok) {
        throw {
          error: {
            code: "SERVER_ERROR",
            message: `Gagal memproses respon dari server (Status: ${res.status}).`,
          },
        } as ApiErrorResponse;
      }
      return { data: null as any };
    }

    if (!res.ok) {
      throw json as ApiErrorResponse;
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    // Check if it's already an ApiErrorResponse thrown above
    if (error && error.error && typeof error.error.message === "string") {
      throw error;
    }

    // Network error / unreachable backend
    if (error instanceof TypeError || (error.message && error.message.includes("fetch"))) {
      throw {
        error: {
          code: "BACKEND_UNREACHABLE",
          message: "Backend Lentera Pasar belum bisa dijangkau. Pastikan API berjalan di http://localhost:4000.",
        },
      } as ApiErrorResponse;
    }

    throw {
      error: {
        code: "UNKNOWN_ERROR",
        message: error.message || "Terjadi kesalahan yang tidak diketahui.",
      },
    } as ApiErrorResponse;
  }
}

// Wrapper alias for apiRequest (retaining compatibility with original code calls)
export async function apiCall<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  payload?: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(method, path, payload);
}

// Syntactic sugar methods
export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return apiRequest<T>('GET', path);
}

export async function apiPost<T>(path: string, body?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>('POST', path, body);
}

export async function apiPut<T>(path: string, body?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>('PUT', path, body);
}

export async function apiPatch<T>(path: string, body?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>('PATCH', path, body);
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return apiRequest<T>('DELETE', path);
}
