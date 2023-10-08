import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { DBOutput } from "../../link/[id]/route";

interface Props {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const x = await db.groupedLink.deleteMany({
      where: {
        groupId: params.id,
        userId: session.user.id,
      },
    });

    await db.group.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    console.log(x);

    return new Response("Successfully deleted group", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: Props) {
  // try {
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
    await db.groupedLink.findMany({
      where: {
        userId: session.user.id,
        groupId: params.id,
      },
    })
  ).length;

  const totalPages = Math.ceil(totalCount / limit);

  const group = await db.group.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!group) return new Response("Group Not Found", { status: 404 });

  const links = await db.groupedLink.findMany({
    skip,
    take: limit,
    where: {
      userId: session.user.id,
      groupId: params.id,
    },
    orderBy: {
      id: "desc",
    },
  });

  // const g = await db.groupedLink.findMany({
  //   where: {
  //     userId: session.user.id,
  //     groupId: params.id,
  //   },
  // });

  // console.log(g);
  // console.log(params.id === g[0].groupId);

  return new Response(
    JSON.stringify({
      links,
      totalPages,
      totalCount,
    }),
    { status: 200 }
  );
  // } catch (err) {
  //   return new Response(JSON.stringify(err), { status: 500 });
  // }
}
