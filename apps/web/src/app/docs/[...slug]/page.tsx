import DocsSidebar from "@/components/misc/DocsSidebar";
import RegularNavbar from "@/components/misc/RegularNavbar";
import { MDX } from "@/lib/mdx";
import { allDocs } from "contentlayer/generated";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string[];
  };
}

async function getDocFromParams(slug: string) {
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) return notFound();

  return doc;
}

export default async function Page({ params }: Props) {
  const doc = await getDocFromParams(params.slug.join("/"));

  return (
    <>
      <RegularNavbar />
      <div className="container md:flex">
        <DocsSidebar slug={params.slug.join("/")} />
        <div className="flex flex-col ml-3 max-w-[1000px]">
          <MDX code={doc.body.code} />
        </div>
      </div>
    </>
  );
}
