import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { GroupValidator } from "@/lib/validators/group";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "../link/[id]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { groupName } = GroupValidator.parse(body);

    await db.user.update({
      where: {
        email: session.user.email as string,
      },
      data: {
        Groups: {
          create: {
            groupName,
          },
        },
      },
    });

    return new Response("Created group", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });

    console.log(err);

    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const groups = await db.group.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        groups,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
