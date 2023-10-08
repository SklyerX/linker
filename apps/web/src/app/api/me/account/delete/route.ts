import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { DBOutput } from "../../link/[id]/route";

import { cookies } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    await db.exportQueue.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.link.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.groupedLink.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.markdown.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.url.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.group.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.account.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await db.user.deleteMany({
      where: {
        email: session.user.email,
      },
    });

    await db.session.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    cookies().delete("next-auth.session-token");
    cookies().delete("next-auth.csrf-token");

    return new Response("Successfully deleted all account information", {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(
      "Something went wrong while deleting account information!",
      { status: 500 }
    );
  }
}
