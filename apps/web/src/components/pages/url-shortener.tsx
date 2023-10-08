"use client";

import { isUrl } from "@/lib/utils";
import { useLinkStore } from "@/states/link-item";
import { Url } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import clsx from "clsx";
import { concat } from "lodash";
import { RefreshCw, Sliders } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import URLItem from "../URLItem";
import CreateNewURL from "../modals/create-new-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

type Search = {
  searchBy: keyof Url;
  query: string;
};

const init: Search = {
  query: "",
  searchBy: "title",
};

const getData = async () => {
  const { data } = await axios.get("/api/me/url");
  return data;
};

export default function URLShortner() {
  const { eventType, payload, resetActions } = useLinkStore();
  const [urls, setUrls] = useState<Array<Url> | []>([]);

  const { data, isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ["groupsRepo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const data = await getData();
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response && typeof err.response.data === "string") {
          return toast.error(err.response.data);
        }
        return toast.error(
          "Something went wrong while sending delete request!"
        );
      }
      return toast.error(
        "Something went wrong while sending delete request! Try again later."
      );
    },
  });

  const [search, setSearch] = useState<Search>(init);

  const filteredLinks = useMemo(() => {
    return urls?.filter((item) => {
      return String(item[search.searchBy])
        .toLowerCase()
        .includes(search.query.toLowerCase());
    });
  }, [urls, search.query]);

  useEffect(() => {
    if (eventType === "linkitem/update") {
      if (!payload) return;
      const index = urls.findIndex((x: Url) => x.id === payload.id);

      if (index === -1 || !isUrl(payload)) return;

      setUrls([...urls.slice(0, index), payload, ...urls.slice(index + 1)]);
      resetActions();
    } else if (eventType === "linkitem/delete") {
      if (!payload) return;
      console.log("delete event");
      setUrls(urls.filter((x) => x.id !== payload.id));
      resetActions();
    }
  }, [eventType]);

  useEffect(() => {
    if (isSuccess) {
      setUrls(data.urls);
    }
  }, [isSuccess]);

  return (
    <>
      <div className="mx-auto max-w-[600px] w-full sm:p-0 p-3">
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl">Shortened URLs</h3>
            <CreateNewURL
              onChange={async () => {
                const data = await getData();

                setUrls(data.urls);
              }}
            />
          </div>
          <button
            onClick={() =>
              refetch().then((res) => {
                setUrls(res.data.urls);
              })
            }
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={clsx("w-4 h-4", isRefetching ? "animate-spin" : null)}
            />
            Refetch
          </button>
        </div>
        <div className="my-4 relative">
          <Input
            value={search.query}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, query: e.target.value }))
            }
            placeholder={`Search by ${search.searchBy}`}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="absolute right-2 top-2.5">
                <Sliders className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={search.searchBy}
                onValueChange={(e) =>
                  setSearch((prev) => ({ ...prev, searchBy: e as keyof Url }))
                }
              >
                <DropdownMenuRadioItem value="title">
                  title
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="redirectUrl">
                  url
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isLoading ? (
          <>
            <Skeleton className="w-full h-[62px] mb-2" />
            <Skeleton className="w-full h-[62px] mb-2" />
            <Skeleton className="w-full h-[62px] mb-2" />
            <Skeleton className="w-full h-[62px] mb-2" />
            <Skeleton className="w-full h-[62px] mb-2" />
          </>
        ) : null}
        {!isLoading &&
          urls?.length !== 0 &&
          filteredLinks?.map((url: Url, index: number) => (
            <URLItem url={url} key={index} />
          ))}
      </div>
    </>
  );
}
