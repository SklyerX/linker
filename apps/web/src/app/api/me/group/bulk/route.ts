import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { GroupLinkValidator, TabsGroupValidator } from "@/lib/validators/link";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "../../link/[id]/route";
import { Link } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    let { links, groupName } = TabsGroupValidator.parse(body);

    const group = await db.group.create({
      data: {
        groupName,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: session.user.id,
      },
    });

    let newLinks: Omit<Link, "id" | "createdAt" | "updatedAt">[] = [];

    for (const link of links) {
      // todo: change this to createMany
      newLinks.push({
        image:
          link.icon ||
          `https://api.dicebear.com/7.x/thumbs/svg?seed=${Date.now()}`,
        groupId: group.id,
        url: link.url,
        description: 'Imported from the "Chrome Tabs" page.',
        title: link.title ? link.title : link.url,
        userId: session.user.id,
      });
    }

    await db.groupedLink.createMany({
      data: newLinks,
    });

    return new Response(
      JSON.stringify({
        id: group.id,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });

    console.log(err);

    return new Response(JSON.stringify(err), { status: 500 });
  }
}
