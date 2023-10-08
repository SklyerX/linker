import { getAuthSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { DBOutput } from "../../link/[id]/route";
import { db } from "@/lib/db";
import { RedirectUrlValidator } from "@/lib/validators/redirectUrl";

// TODO: add analytics to user info to this [like time of click + country]

interface Props {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, active, redirectUrl } = RedirectUrlValidator.parse(body);

    await db.url.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        active,
        redirectUrl,
        updatedAt: new Date(),
      },
    });

    return new Response("Successfully updated url", { status: 200 });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while editing this url", {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    await db.url.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return new Response("Successfully deleted link", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while deleting this url", {
      status: 500,
    });
  }
}
