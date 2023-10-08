"use client";

import getMarkdownContent from "@/hooks/react-query/get-markdown-content";
import CreateNewNote from "../modals/create-new-note";

export default function MarkdownContent() {
  const { data, isLoading } = getMarkdownContent();

  return (
    <div className="px-10 pr-2 w-full">
      {data ? <CreateNewNote post={data} update /> : <p>Loading editor...</p>}
    </div>
  );
}
