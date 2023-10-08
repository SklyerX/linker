"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MarkdownPost from "../MarkdownPost";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Markdown } from "@/types";

export default function Markdown() {
  const [markdowns, setMarkdowns] = useState<Array<Markdown> | []>([]);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["markdownRepo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`/api/me/markdown?page=${page}`);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        return toast.error(
          err.response?.data.message ||
            "Something went wrong while fetching markdown notes!"
        );
      toast.error(
        "Something went wrong while fetching markdown notes! Please try again later."
      );
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      console.log(data);
      setMarkdowns([...markdowns, ...data.markdowns]);
    }
  }, [isSuccess]);

  const loadMore = () => {
    setPage(page + 1);
    refetch().then((res) => {
      setMarkdowns(res.data.markdowns);
    });
  };

  return (
    <div className="flex justify-center w-full sm:p-0 p-3">
      <div className="mt-12 flex flex-col max-w-[600px] w-full gap-y-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-xl">Markdown Notes</h2>
          <Link
            href="/dashboard/markdown/new"
            className={buttonVariants({ variant: "default" })}
          >
            Create new
          </Link>
        </div>
        <div className="mt-0">
          {markdowns.length !== 0 && !isLoading ? (
            <>
              {markdowns?.map((item, index: number) => (
                <MarkdownPost post={item} key={index} />
              ))}
              <div className="mt-20 inline-flex items-center justify-center w-full">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={data?.totalPages === page}
                >
                  Load more
                </Button>
              </div>
            </>
          ) : null}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full">
              <Skeleton className="w-full h-[70px] max-w-[500px] mb-2" />
              <Skeleton className="w-full h-[70px] max-w-[500px] mb-2" />
              <Skeleton className="w-full h-[70px] max-w-[500px] mb-2" />
              <Skeleton className="w-full h-[70px] max-w-[500px] mb-2" />
              <Skeleton className="w-full h-[70px] max-w-[500px] mb-2" />
            </div>
          ) : null}
          {markdowns.length === 0 && !isLoading ? (
            <div className="items-center justify-center flex flex-col mt-3 border-2 p-10 rounded-md border-dotted">
              <Ghost className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Pretty empty here</h2>
              <p className="text-foreground/60">
                Let's add your first markdown post
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
