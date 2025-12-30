export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    const text = await safeReadText(res);
    throw new ApiError(res.status, text || res.statusText);
  }

  return (await res.json()) as T;
}

export async function fetchJsonWithFallback<T>(urls: string[], init?: RequestInit): Promise<T> {
  let lastErr: unknown;

  for (const url of urls) {
    try {
      return await fetchJson<T>(url, init);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr;
}

export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}
