import { getAuthSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "../../link/[id]/route";
import { MarkdownValidator } from "@/lib/validators/markdown";
import { db } from "@/lib/db";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const markdown = await db.markdown.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify(markdown, null, 2), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while editing this post", {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, content } = MarkdownValidator.parse(body);

    await db.markdown.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    return new Response("Successfully updated markdown post", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while editing this post", {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    await db.markdown.delete({
      where: {
        id: params.id,
      },
    });

    return new Response("Successfully deleted markdown post", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while deleting this post", {
      status: 500,
    });
  }
}
