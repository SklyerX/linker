import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LinkValidator } from "@/lib/validators/link";
import axios from "axios";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// TODO: update this file and use proper values like db.link (update) and db.link (delete)

interface Props {
  params: {
    id: string;
  };
}

export interface DBOutput {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 400 });

    const body = await req.json();
    let { url, title, description } = LinkValidator.parse(body);

    const res = await axios.get(url);

    // const imageMatch = res.data.match(
    //   /<meta property="og:image" content="(.*?)"/
    // );

    const imageMatch = res.data.match(/<link rel="shortcut icon" href="(.*?)"/);

    const imageURL = imageMatch
      ? imageMatch[1]
      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${Date.now()}`;

    if (title?.length === 0) title = undefined;

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        Links: true,
      },
    });

    const link = user?.Links.find(
      (link) => link.id === params.id && link.userId === session.user.id
    );

    if (!link)
      return new Response(
        "A link with this id was not found or this link doesn't belong to you.",
        { status: 400 }
      );

    await db.link.update({
      where: {
        id: params.id,
      },
      data: {
        url,
        title,
        image: imageURL,
        updatedAt: new Date(),
        description,
      },
    });

    return new Response("Updated link", {
      status: 200,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify(err), { status: 400 });
    }
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 400 });

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        Links: true,
      },
    });

    const link = user?.Links.find(
      (link) => link.id === params.id && link.userId === session.user.id
    );

    if (!link)
      return new Response(
        "A link with this id was not found or this link doesn't belong to you.",
        { status: 400 }
      );

    await db.link.delete({
      where: {
        id: params.id,
      },
    });

    return new Response("Deleted link", {
      status: 200,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify(err), { status: 400 });
    }
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
