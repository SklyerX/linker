import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LinkValidator } from "@/lib/validators/link";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "./[id]/route";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 400 });

    const body = await req.json();
    const { url, title, description } = LinkValidator.parse(body);

    let res = await axios.get(url);

    const imageMatchShortcutIcon = res.data.match(
      /<link rel="shortcut icon" href="(.*?)"/
    );
    const imageMatchIcon = res.data.match(/<link rel="icon" href="(.*?)"/);

    const imageUrl = imageMatchShortcutIcon
      ? imageMatchShortcutIcon[1]
      : imageMatchIcon
      ? imageMatchIcon[1]
      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${Date.now()}`;

    console.log(imageUrl, imageMatchShortcutIcon, imageMatchIcon);
    await db.user.update({
      where: {
        email: session.user.email as string,
      },
      data: {
        Links: {
          create: {
            image: imageUrl,
            url,
            title,
            description,
          },
        },
      },
    });

    return new Response("Created link", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify(err), { status: 400 });
    }
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
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
      await db.link.findMany({
        where: {
          userId: session.user.id,
        },
      })
    ).length;

    const totalPages = Math.ceil(totalCount / limit);

    const links = await db.link.findMany({
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
        links,
        totalPages,
        totalCount,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
