export const OAA_BASE = process.env.NEXT_PUBLIC_OAA_BASE!;
export async function oaa(path: string, init?: RequestInit) {
  const res = await fetch(`${OAA_BASE}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAA ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}
