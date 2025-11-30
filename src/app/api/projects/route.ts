export const runtime = "nodejs";
import { forward } from "../_proxy";

export async function GET(req: Request) {
  return forward(req, "/api/projects");
}

export async function POST(req: Request) {
  return forward(req, "/api/projects");
}
