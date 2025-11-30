export const runtime = "nodejs";

import { forward } from "../../_proxy";

type RouteParams = {
  id: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  const { id } = await params;          // ✅ unwrap the Promise
  return forward(req, `/api/projects/${id}`);
}
