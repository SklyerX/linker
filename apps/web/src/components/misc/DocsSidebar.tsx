"use client";

import { Docs, allDocs } from "contentlayer/generated";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import clsx from "clsx";

function SidebarContent(categoryMap, slug) {
  return (
    <ul>
      {Object.entries(categoryMap).map(([category, pages]) => {
        const _pages = pages as Docs[];
        return (
          <li key={category} className="mb-4">
            <h2 className="text-xl font-semibold">{toTitleCase(category)}</h2>
            <ul className="border-l">
              {_pages.map((page) => (
                <li
                  key={page._id}
                  className={clsx(
                    "pl-3 my-1",
                    page.slugAsParams === slug
                      ? "border-sky-500 border-l-2"
                      : null
                  )}
                >
                  <Link
                    href={`/docs/${page.slugAsParams}`}
                    className="text-foreground/60 hover:text-foreground/80 transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^|[\s-/])\w/g, function (match) {
      return match.toUpperCase();
    })
    .replaceAll("-", " ");
}

interface Props {
  slug: string;
}

export default function DocsSidebar({ slug }: Props) {
  const [breadcrumbs, setBreadcrumbs] = useState<Array<string> | []>([]);

  const categoryMap = {};

  useEffect(() => {
    const breadcrumbs = location.pathname.split("/").filter((x) => x); // the filter is to get rid of empty strings
    setBreadcrumbs(breadcrumbs);
  }, []);

  allDocs.sort((a, b) => a.index - b.index); // Sort the allDocs array by index in ascending order

  allDocs.forEach((page) => {
    const parts = page._id.split("/");
    if (parts.length >= 2) {
      const category = parts[1]; // Get the second part of _id as category
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(page);
    }
  });

  return (
    <>
      <div className="border-b md:border-none flex pb-4 mb-5 md:mb-0 z-40 bg-background md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu className="w-6 h-6 mr-4" />
          </SheetTrigger>
          <SheetContent side="left">
            {SidebarContent(categoryMap, slug)}
          </SheetContent>
        </Sheet>
        {breadcrumbs.map((breadcrumb, i) => (
          <p className="inline-flex items-center">
            {toTitleCase(breadcrumb)}
            {i !== breadcrumbs.length - 1 ? (
              <ChevronRight className="w-4 h-4 mx-1.5" />
            ) : null}
          </p>
        ))}
      </div>
      <div className="min-w-[200px] pb-4 mb-5 z-40 bg-background hidden md:flex">
        {SidebarContent(categoryMap, slug)}
      </div>
    </>
  );
}
