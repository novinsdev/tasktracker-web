export const runtime = "nodejs";
import { forward } from "../_proxy";

export async function GET(req: Request) {
  const u = new URL(req.url);
  return forward(req, `/api/tasks${u.search}`);
}

export async function POST(req: Request) {
  return forward(req, "/api/tasks");
}
