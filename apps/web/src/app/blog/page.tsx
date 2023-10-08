import RegularNavbar from "@/components/misc/RegularNavbar";
import { MDX } from "@/lib/mdx";
import { allBlogs } from "contentlayer/generated";
import { ArrowLeft, Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getDocs() {
  const docs = allBlogs;

  if (!docs) return notFound();

  return docs;
}

export default async function Page() {
  const docs = await getDocs();

  return (
    <>
      <RegularNavbar />
      <section className="container my-10 max-w-[800px]">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Blog</h3>
          <p>Get the latest from Linker.</p>
        </div>
        <div className="mt-10">
          {docs.map((doc, index) => (
            <Link
              href={`/blog/${doc.slugAsParams}`}
              className="w-full rounded-md border block"
              key={index}
            >
              <img
                src={doc.thumbnail}
                alt="Blog Thumbnail"
                className="rounded-t-md object-cover border-b"
              />
              <div className="p-3">
                <h2 className="text-xl font-semibold">{doc.title}</h2>
                <span className="inline-flex text-sm items-center gap-1">
                  by <strong>{doc.author}</strong> <Dot className="w-3 h-3" />{" "}
                  {doc.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
