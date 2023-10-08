"use client";

import { Input } from "@/components/ui/input";
import getGroups from "@/hooks/react-query/get-groups";
import { Group } from "@/types";
import clsx from "clsx";
import { ChevronDown, RefreshCcw, Table2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MobileGroupsMenu from "../MobileGroupsMenu";
import HandleGroup from "../controllers/handle-group";
import CreateNewGroup from "../modals/create-new-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { groupStore } from "@/states/group";

export default function GroupedSidebar() {
  const { created, setCreated } = groupStore();
  const { data, isSuccess, refetch, isRefetching } = getGroups();
  const [groups, setGroups] = useState<Array<Group> | []>([]);
  const [query, setQuery] = useState<string>("");

  const filteredGroups = useMemo(() => {
    return groups?.filter((item: Group) => {
      return item?.groupName?.toLowerCase().includes(query.toLowerCase());
    });
  }, [groups, query]);

  const changeSort = (by: "alphabet" | "date") => {
    let sortedGroups;

    if (by === "alphabet") {
      sortedGroups = [...groups].sort((a, b) =>
        a.groupName.localeCompare(b.groupName)
      );
    } else {
      sortedGroups = [...groups].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setGroups(sortedGroups);
  };

  useEffect(() => {
    if (created) {
      refetch().then((res) => {
        setGroups(res.data.groups);
        setCreated(true);
      });
    }
  }, [created]);

  useEffect(() => {
    if (isSuccess) {
      setGroups(data.groups);
    }
  }, [isSuccess]);

  return (
    <>
      <div className="w-full absolute left-0 flex items-center gap-2 border-b p-4 lg:hidden">
        <MobileGroupsMenu
          groups={groups}
          isRefetching={isRefetching}
          refetch={() =>
            refetch().then((res) => {
              setGroups(res.data.groups);
            })
          }
        />
      </div>
      <div className="border-r z-10 w-64 h-screen fixed top-0 left-16 lg:block hidden">
        <div className="w-full border-b p-4">
          <h3>Link Tables - Groups</h3>
        </div>
        <div className="mt-1 p-3 w-full">
          <CreateNewGroup />
          <Input
            className="mt-2"
            placeholder="search"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
          />
        </div>
        <div className="p-3">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-sm">Groups ({groups?.length})</h3>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => changeSort("date")}>
                    Sort by date added
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => changeSort("alphabet")}>
                    Sort by alphabet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() =>
                  refetch().then((res) => {
                    setGroups(res.data.groups);
                  })
                }
              >
                <RefreshCcw
                  className={clsx(
                    "w-3.5 h-3.5",
                    isRefetching ? "animate-spin" : null
                  )}
                />
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {filteredGroups?.map((group, index) => (
              <Link
                href={`/dashboard/grouped/${group.id}`}
                className="w-full flex justify-between items-center"
                key={index}
              >
                <div className="inline-flex gap-2 items-center text-sm">
                  <Table2 className="w-4 h-4" />
                  {group.groupName.length > 15
                    ? group.groupName.substring(0, 15) + "..."
                    : group.groupName}
                </div>
                <HandleGroup id={group.id} onChange={() => refetch()} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
