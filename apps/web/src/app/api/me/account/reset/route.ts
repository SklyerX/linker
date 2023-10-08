import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DBOutput } from "../../link/[id]/route";

export async function DELETE(req: Request) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

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

    return new Response("Successfully resetted all account information", {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(
      "Something went wrong while resetting account information!",
      { status: 500 }
    );
  }
}
