"use client";

import { GroupLink } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import GroupedSidebar from "../misc/GroupSideBar";
import AddNewGroupLink from "../modals/add-new-group-link";
import { Skeleton } from "../ui/skeleton";
import LinkItem from "../LinkItem";
import { Ghost, RefreshCw, Sliders } from "lucide-react";
import { Button } from "../ui/button";
import { isLink, sleep } from "@/lib/utils";
import { concat } from "lodash";
import { useLinkStore } from "@/states/link-item";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import JumpToTop from "../JumpToTop";
import clsx from "clsx";

type Search = {
  searchBy: keyof GroupLink;
  query: string;
};

const getData = async (
  id,
  currentPage: number,
  perPage: number = 10,
  increment = true
) => {
  const { data } = await axios.get(
    `/api/me/group/${id}?page=${
      currentPage + (increment ? 1 : 0)
    }&per_page=${perPage}`
  );
  return data;
};

const init: Search = {
  query: "",
  searchBy: "title",
};

export default function GroupedLinksWithID() {
  const [links, setLinks] = useState<Array<GroupLink> | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>();

  const { eventType, payload, resetActions } = useLinkStore();

  const params = useParams();

  const router = useRouter();

  const [search, setSearch] = useState<Search>(init);

  const filteredLinks = useMemo(() => {
    return links?.filter((item) => {
      return String(item[search.searchBy])
        .toLowerCase()
        .includes(search.query.toLowerCase());
    });
  }, [links, search.query]);

  useEffect(() => {
    if (eventType === "linkitem/update") {
      if (!payload) return;
      const index = links.findIndex((x: GroupLink) => x.id === payload.id);

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

  const { data, refetch, isLoading, isSuccess, isRefetching } = useQuery({
    queryKey: ["groupLinksRepo"],
    staleTime: 0,
    cacheTime: 0,
    queryFn: async () => {
      setCurrentPage((prev) => {
        return prev + 1;
      });

      const data = await getData(params.id, currentPage, 10);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404)
          return router.push("/dashboard/grouped");
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

  return (
    <div className="w-full lg:flex">
      <GroupedSidebar />
      <JumpToTop />
      <div className="w-full flex flex-col lg:mt-0 mt-20 items-center justify-center p-2 lg:ml-[340px]">
        <div className="mt-3 mx-10 mb-5 max-w-[600px] w-full lg:mx-0">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Grouped Links (<CountUp end={links.length} duration={1.5} />)
              </h3>
              <AddNewGroupLink
                onChange={async () => {
                  const data = await getData(params.id, 1, 10, false);

                  setLinks([data.links[0], ...links]);
                  setTotalPages(data.totalPages);
                }}
              />
            </div>
            <div>
              <button
                onClick={async () => {
                  const data = await getData(params.id, 1, 10, false);

                  setLinks([data.links[0], ...links]);
                  setTotalPages(data.totalPages);
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={clsx(
                    "w-4 h-4",
                    isRefetching ? "animate-spin" : null
                  )}
                />
                Refetch
              </button>
            </div>
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
                    setSearch((prev) => ({
                      ...prev,
                      searchBy: e as keyof GroupLink,
                    }))
                  }
                >
                  <DropdownMenuRadioItem value="title">
                    title
                  </DropdownMenuRadioItem>
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
            filteredLinks.map((link) => (
              <LinkItem link={link} key={link.id} isGroup />
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
                    await sleep(100);
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
      </div>
    </div>
  );
}
