import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LinkValidator } from "@/lib/validators/link";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "../../../link/[id]/route";
import axios from "axios";

interface Props {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    let { url, description, title } = LinkValidator.parse(body);

    if (title?.length === 0) title = undefined;

    const group = await db.group.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!group)
      return new Response("This group doesn't exist", { status: 404 });

    const res = await axios.get(url);

    // const imageMatch = res.data.match(
    //   /<meta property="og:image" content="(.*?)"/
    // );

    const imageMatch = res.data.match(/<link rel="shortcut icon" href="(.*?)"/);

    const imageURL = imageMatch
      ? imageMatch[1]
      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${Date.now()}`;

    await db.groupedLink.create({
      data: {
        image: imageURL,
        groupId: params.id,
        url,
        description,
        title: title || null,
        userId: session.user.id,
      },
    });

    return new Response(`Link created in group '${params.id}'`, {
      status: 200,
    });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    await db.groupedLink.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new Response(`Removed link from group '${params.id}'`, {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    let { url, description, title } = LinkValidator.parse(body);

    const res = await axios.get(url);

    // const imageMatch = res.data.match(
    //   /<meta property="og:image" content="(.*?)"/
    // );

    const imageMatch = res.data.match(/<link rel="shortcut icon" href="(.*?)"/);

    const imageURL = imageMatch
      ? imageMatch[1]
      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${Date.now()}`;

    if (title?.length === 0) title = undefined;

    await db.groupedLink.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        image: imageURL,
        groupId: params.id,
        url,
        description,
        title,
        userId: session.user.id,
      },
    });

    return new Response(`Link updated in group '${params.id}'`, {
      status: 200,
    });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
