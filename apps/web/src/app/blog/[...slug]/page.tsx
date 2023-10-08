import RegularNavbar from "@/components/misc/RegularNavbar";
import { MDX } from "@/lib/mdx";
import { allBlogs } from "contentlayer/generated";
import { ArrowLeft, Dot } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

async function getDocFromParams(slug: string) {
  const doc = allBlogs.find((doc) => doc.slugAsParams === slug);

  if (!doc) return notFound();

  return doc;
}

export default async function Page({ params }: Props) {
  const doc = await getDocFromParams(params.slug[0]);

  return (
    <>
      <RegularNavbar />
      <section className="container max-w-[1000px]">
        <Link href="/blog" className="my-3 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="border p-2 rounded-md">
          <img src={doc.thumbnail} />
        </div>
        <div className="my-2">
          <h1 className="text-2xl font-semibold">{doc.title}</h1>
          <span className="inline-flex text-sm items-center gap-1">
            by <strong>{doc.author}</strong> <Dot className="w-3 h-3" />{" "}
            {doc.date}
          </span>
        </div>
        <MDX code={doc.body.code} />
      </section>
    </>
  );
}
