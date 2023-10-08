import { db } from "@/lib/db";
import { utapi } from "../uploadthing/core";

export async function GET(req: Request) {
  try {
    const exports = await db.exportQueue.findMany({
      where: {
        status: "FINISHED",
      },
    });

    if (exports.length === 0)
      return new Response("No exports found!", { status: 204 });

    const documents: Array<{ fileKey: string; id: string }> = [];

    exports.map(async (_export) => {
      if (hasDayPassed(_export.createdAt)) {
        documents.push({
          fileKey: _export.fileKey as string,
          id: _export.id,
        });
      }
    });

    const keys = documents.map((doc) => doc.fileKey);
    const ids = documents.map((doc) => doc.id);

    if (keys.length === 0 || ids.length === 0)
      return new Response(
        "Todays check was skipped as the data returned was empty",
        { status: 204 }
      );

    await utapi.deleteFiles(keys);

    await db.exportQueue.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while executing cron job", {
      status: 500,
    });
  }
}

function hasDayPassed(dateString: Date) {
  const originalDate = new Date(dateString);

  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - originalDate.getTime();

  const millisecondsInADay = 24 * 60 * 60 * 1000;

  if (timeDifference >= millisecondsInADay) {
    return true;
  } else {
    return false;
  }
}
