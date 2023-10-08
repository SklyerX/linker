import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ImportAccountValidator } from "@/lib/validators/import-account";
import { Group, Link, Markdown } from "@/types";
import { Url } from "database";
import { ZodError } from "zod";
import { DBOutput } from "../../link/[id]/route";
import { nanoid } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthroized", { status: 401 });

    const body = await req.json();
    const { GroupedLinks, Groups, Links, Markdowns, Urls } =
      ImportAccountValidator.parse(body);

    if (
      GroupedLinks?.length === 0 &&
      Groups?.length === 0 &&
      Links?.length === 0 &&
      Markdowns?.length === 0 &&
      Urls?.length === 0
    )
      return new Response("There is nothing to import", { status: 409 });

    const links: Omit<Link, "id" | "createdAt" | "updatedAt" | "groupId">[] =
      [];
    const groupedLinks: Omit<Link, "id" | "createdAt" | "updatedAt">[] = [];
    const groups: Omit<Group, "createdAt" | "id" | "updatedAt">[] = [];
    const markdowns: Omit<Markdown, "id" | "createdAt" | "updatedAt">[] = [];
    const urls: Omit<Url, "id">[] = [];

    if (Links) {
      for (const link of Links) {
        links.push({
          title: link.title ? link.title : link.url,
          url: link.url,
          description: link.description,
          userId: session.user.id,
          image: link.image,
        });
      }
    }

    if (Groups) {
      for (const group of Groups) {
        let g = group as Group;
        groups.push({
          groupName: g.groupName,
          userId: session.user.id,
        });
      }
    }

    if (Markdowns) {
      for (const markdown of Markdowns) {
        markdowns.push({
          content: markdown.content,
          userId: session.user.id,
          title: markdown.title,
        });
      }
    }

    if (Urls) {
      for (const url of Urls) {
        urls.push({
          urlId: nanoid(),
          redirectUrl: url.redirectUrl,
          userId: session.user.id,
          title: url.title,
          active: url.active as boolean,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

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

    if (links.length !== 0)
      await db.link.createMany({
        data: links,
      });

    if (markdowns.length !== 0)
      await db.markdown.createMany({
        data: markdowns,
      });

    if (urls.length !== 0)
      await db.url.createMany({
        data: urls,
      });

    if (GroupedLinks && GroupedLinks?.length !== 0) {
      groups.map(async (group) => {
        const g = await db.group.create({
          data: {
            groupName: group.groupName,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        });

        GroupedLinks.map(async (link) => {
          await db.groupedLink.create({
            data: {
              image: link.image,
              url: link.url,
              title: link.title,
              description: link.description,
              userId: session.user.id,
              groupId: g.id,
            },
          });
        });
      });
    }

    return new Response("Successfuly imported account", { status: 200 });

    // TODO: wipe all the users data and import this instead :)
    // TODO: add singular imports too. Meaning if the user goes to a group or something they can drag and drop it from there.
    // TODO: allow users to share folders
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while importing account", {
      status: 500,
    });
  }
}
