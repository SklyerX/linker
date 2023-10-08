import { ChevronDown, List, RefreshCcw, Table2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import clsx from "clsx";
import CreateNewGroup from "./modals/create-new-group";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import { Group } from "@/types";
import Link from "next/link";
import HandleGroup from "./controllers/handle-group";

interface Props {
  groups: Group[];
  isRefetching: boolean;
  refetch: () => void;
}

export default function MobileGroupsMenu({
  groups: _groups,
  refetch,
  isRefetching,
}: Props) {
  const [groups, setGroups] = useState<Array<Group> | []>(_groups);

  useEffect(() => {
    setGroups(_groups);
  }, [_groups]);

  const [query, setQuery] = useState<string>("");

  const filteredGroups = useMemo(() => {
    return groups?.filter((item) => {
      return item.groupName.toLowerCase().includes(query.toLowerCase());
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <List className="w-5 h-5" />
          <h3>Group Sidebar</h3>
        </div>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="p-3 w-full">
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
              <RefreshCcw
                onClick={refetch}
                className={clsx(
                  "w-3.5 h-3.5 cursor-pointer",
                  isRefetching ? "animate-spin" : null
                )}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {filteredGroups?.map((group, index) => (
              <div className="flex items-center justify-between">
                <Link
                  href={`/dashboard/grouped/${group.id}`}
                  className="inline-flex gap-2 items-center"
                  key={index}
                >
                  <Table2 className="w-4 h-4" />
                  {group.groupName.length > 20
                    ? group.groupName.substring(0, 20) + "..."
                    : group.groupName}
                </Link>
                <HandleGroup id={group.id} onChange={() => refetch()} />
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
