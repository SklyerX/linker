"use client";

import { isLink, sleep } from "@/lib/utils";
import { useLinkStore } from "@/states/link-item";
import { Link } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { concat, union } from "lodash";
import { Ghost, RefreshCw, Sliders } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import LinkItem from "../LinkItem";
import AddNewLink from "../modals/add-new-link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

type Search = {
  searchBy: keyof Link;
  query: string;
};

const getData = async (
  currentPage: number,
  perPage: number = 10,
  increment = true
) => {
  const { data } = await axios.get(
    `/api/me/link?page=${currentPage + (increment ? 1 : 0)}&per_page=${perPage}`
  );
  return data;
};

const init: Search = {
  query: "",
  searchBy: "title",
};

export default function UnorderedLinks() {
  const [links, setLinks] = useState<Array<Link> | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>();
  const { eventType, payload, resetActions } = useLinkStore();

  const [search, setSearch] = useState<Search>(init);

  const filteredLinks = useMemo(() => {
    return links?.filter((item) => {
      return String(item[search.searchBy])
        .toLowerCase()
        .includes(search.query.toLowerCase());
    });
  }, [links, search.query]);

  const { data, isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ["unorderedLinksRepo"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      setCurrentPage((prev) => {
        return prev + 1;
      });

      const data = await getData(currentPage, 10);

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

  useEffect(() => {
    if (isSuccess) {
      setLinks(data.links);
      setTotalPages(data.totalPages);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (eventType === "linkitem/update") {
      if (!payload) return;
      const index = links.findIndex((x: Link) => x.id === payload.id);

      console.log(links[index], payload);

      if (index === -1 || !isLink(payload)) return;
      setLinks([...links.slice(0, index), payload, ...links.slice(index + 1)]);
      resetActions();
    } else if (eventType === "linkitem/delete") {
      if (!payload) return;
      setLinks(links.filter((x) => x.id !== payload.id));
      resetActions();
    }
  }, [eventType]);

  useEffect(() => {
    console.log(links[0]);
  }, [links]);

  return (
    <div className="max-w-[700px] w-full mt-5 p-2">
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Unordered Links (<CountUp end={links.length} duration={1.5} />)
          </h3>
          <AddNewLink
            onChange={async () => {
              const data = await getData(1, 10, false);

              console.log(data.links[0], data.links.length, links.length);

              setLinks([data.links[0], ...links]);
              setTotalPages(data.totalPages);
            }}
          />
        </div>
        <button
          onClick={async () => {
            const data = await getData(1, 10, false);

            setLinks([data.links[0], ...links]);
            setTotalPages(data.totalPages);
          }}
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
                setSearch((prev) => ({ ...prev, searchBy: e as keyof Link }))
              }
            >
              <DropdownMenuRadioItem value="title">title</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="url">url</DropdownMenuRadioItem>
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
      {links.length !== 0 &&
        filteredLinks.map((link, index) => (
          <LinkItem link={link} key={link.id} />
        ))}
      {links.length === 0 && !isLoading ? (
        <div className="items-center justify-center flex flex-col mt-5 border-2 p-10 rounded-md border-dotted">
          <Ghost className="w-6 h-6" />
          <h2 className="text-2xl font-semibold">Pretty empty here</h2>
          <p className="text-foreground/60">Let's add your first link</p>
        </div>
      ) : null}
      {!isLoading && links.length !== 0 ? (
        <div className="w-full h-auto my-5 grid place-items-center">
          <Button
            variant="outline"
            isLoading={isLoading}
            onClick={() => {
              refetch().then(async (res) => {
                setLinks([...links, ...res.data.links]);
                await sleep(50);
                window.scrollTo(0, window.innerHeight);
              });
            }}
            disabled={totalPages === currentPage}
          >
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
}
