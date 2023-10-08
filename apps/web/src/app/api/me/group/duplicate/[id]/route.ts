import { getAuthSession } from "@/lib/auth";
import { DBOutput } from "../../../link/[id]/route";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

interface Props {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const existingGroup = await db.group.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingGroup) return new Response("Group not found", { status: 404 });

    const links = await db.groupedLink.findMany({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
      select: {
        title: true,
        image: true,
        description: true,
        groupId: true,
        url: true,
        userId: true,
      },
    });

    const newGroup = await db.group.create({
      data: {
        groupName: `${existingGroup?.groupName} - Duplicate`,
        userId: session.user.id,
      },
    });

    links.forEach(async (link) => {
      await db.groupedLink.create({
        data: {
          ...link,
          groupId: newGroup.id,
        },
      });
    });

    return new Response("Successfully duplicated group", { status: 500 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
