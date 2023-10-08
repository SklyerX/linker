import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { isObjectEmpty } from "@/lib/utils";
import { ExportAccountValidator } from "@/lib/validators/export-account";
import { NextRequest } from "next/server";
import { DBOutput } from "../../link/[id]/route";
import axios from "axios";
import { WORKER_ENDPOINT } from "@/lib/constants";
import jwt from "jsonwebtoken";

const validFields = ["links", "groups", "grouped-links", "markdown", "urls"];

// TODO make it like this: https://resend.com/domains/d3dabf73-5cf2-4c45-a5ef-66de0d26970d
// so if the user cancels the request the operation still continues

export async function POST(req: NextRequest) {
  try {
    const session = (await getAuthSession()) as DBOutput | null;

    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { items } = ExportAccountValidator.parse(body);

    for (const item of items) {
      if (!validFields.includes(item))
        return new Response("Array includes invalid value", { status: 400 });
    }

    const queue = await db.exportQueue.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (queue)
      return new Response("You have already requests an account export!", {
        status: 429,
      });

    const data = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        Links: items.includes("links"),
        Groups: items.includes("groups"),
        GroupedLinks: items.includes("grouped-links"),
        Markdowns: items.includes("markdown"),
        Urls: items.includes("urls"),
      },
    });

    if (isObjectEmpty(data as object))
      return new Response("You have no content in your account to export!", {
        status: 409,
      });

    const res = await axios.post(`${WORKER_ENDPOINT}/export`, {
      data: jwt.sign(
        {
          initiatedOn: new Date(),
          userId: session.user.id,
          selectedItems: items,
        },
        process.env.JWT_SECRET!
      ),
    });

    if (res.status !== 201)
      return new Response("Something went wrong and it was uncaught!", {
        status: 500,
      });

    return new Response("Export request initiated please wait.", {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
