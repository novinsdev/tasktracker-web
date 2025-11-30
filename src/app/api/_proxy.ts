export const runtime = "nodejs";

export function backendUrl(pathWithQuery: string) {
  const base = process.env.BACKEND_URL;
  if (!base) throw new Error("Missing BACKEND_URL env var");
  return `${base.replace(/\/$/, "")}${pathWithQuery}`;
}

export async function forward(req: Request, pathWithQuery: string) {
  const url = backendUrl(pathWithQuery);

  const method = req.method.toUpperCase();
  const headers = new Headers();
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  headers.set("accept", "application/json");

  const body = method === "GET" || method === "HEAD" ? undefined : await req.text();

  const upstream = await fetch(url, { method, headers, body });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
