import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAuthSession();

  return new Response(JSON.stringify(session?.user), { status: 200 });
}
