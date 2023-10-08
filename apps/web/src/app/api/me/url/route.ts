import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { RedirectUrlValidator } from "@/lib/validators/redirectUrl";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "../link/[id]/route";

import { nanoid } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { active, redirectUrl, title } = RedirectUrlValidator.parse(body);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        Urls: {
          create: {
            urlId: nanoid(),
            active: active as boolean,
            redirectUrl,
            title,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });

    return new Response("Successfully shorten url", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong creating a link", {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 10;

    console.log(per_page, page);

    let limit: number = per_page;

    if (limit > 25) limit = 25;

    const skip = Math.max((page - 1) * limit, 0);

    const totalCount = (
      await db.url.findMany({
        where: {
          userId: session.user.id,
        },
      })
    ).length;

    const totalPages = Math.ceil(totalCount / limit);

    const urls = await db.url.findMany({
      skip,
      take: limit,
      where: {
        userId: session.user.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        urls,
        totalPages,
        totalCount,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
