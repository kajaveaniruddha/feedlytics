import { rateLimitBlocked } from "@/lib/metrics";

export async function POST(request: Request) {
  const { path } = await request.json();
  rateLimitBlocked.inc({ path });
  return new Response(null, { status: 204 });
}
