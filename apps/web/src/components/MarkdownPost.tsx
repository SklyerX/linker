"use client";

import { Markdown } from "@/types";
import { formatDistanceToNowStrict } from "date-fns";
import { FC, useEffect, useRef, useState } from "react";
import EditorOutput from "./EditorOutput";
import { Dot } from "lucide-react";

interface PostProps {
  post: Markdown;
}

const Post: FC<PostProps> = ({ post }) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-background/20 border shadowfull">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <a
            className="flex items-center"
            href={`/dashboard/markdown/${post.id}`}
          >
            <h1 className="text-lg font-semibold py-2 leading-6">
              {post.title}
            </h1>
            <Dot />
            <span className="text-sm text-foreground/80">
              {formatDistanceToNowStrict(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
