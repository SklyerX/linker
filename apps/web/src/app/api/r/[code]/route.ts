import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";

interface Props {
  params: {
    code: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  // try {
  const url = await db.url.findFirst({
    where: {
      urlId: params.code,
    },
    select: {
      active: true,
      redirectUrl: true,
    },
  });

  if (!url || !url.active) return notFound();

  return redirect(url.redirectUrl);
  // } catch (err) {
  //   console.error(err);
  //   return new Response("Something went wrong while redirecting you!", {
  //     status: 500,
  //   });
  // }
}
