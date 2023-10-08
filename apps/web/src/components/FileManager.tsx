import { Tab } from "@/types";
import CryptoJS from "crypto-js";
import { MoreVertical, Sliders } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SaveTabs from "./modals/save-tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { isTab } from "@/lib/utils";

interface Props {
  file: File;
  onError: () => void;
}

type GatheredLink =
  | {
      id: string;
      icon: string;
      title: string;
      url: string;
    }
  | undefined;

interface Search {
  by: "title" | "url";
  query: string;
}

export default function FileManager({ file, onError }: Props) {
  const [links, setLinks] = useState<Array<GatheredLink> | []>([]);
  const [search, setSearch] = useState<Search>({
    by: "title",
    query: "",
  });

  const filteredLinks = useMemo(() => {
    if (links.length === 0) return;

    return links.filter((item: GatheredLink) => {
      if (item !== undefined)
        return item[search.by]
          .toLowerCase()
          .includes(search.query.toLowerCase());
    });
  }, [links, search]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const decryptedData = CryptoJS.AES.decrypt(
            text,
            "YourSecretKey"
          ).toString(CryptoJS.enc.Utf8);

          const parsedData = JSON.parse(decryptedData);

          if (!isTab(parsedData[0])) {
            onError();
            toast.error("Incorrect documnet provided!");
          }

          setLinks(parsedData);
        } catch (err) {
          onError();
          console.error(err);
          toast.error(
            (err as { message: string }).message ||
              "Something went wrong while reading the document"
          );
        }
      };
    }
  }, []);

  const updateList = (id: string) => {
    let list = [...links] as GatheredLink[];

    const x = list.find((x) => x?.id === id);

    console.log("x.id:", x?.id);
    console.log("params.id:", id);

    console.log(list.length - 1);

    list = list.filter((x) => x?.id !== id);

    setLinks([...list]);
  };

  return (
    <div className="h-[10vh]">
      <div className="w-full flex items-center justify-between mb-10">
        <div className="text-lg">
          <strong>{links.length}</strong> tabs found
        </div>
        {links.length !== 0 ? <SaveTabs tabs={links as Array<Tab>} /> : null}
      </div>
      <div className="relative mb-5">
        <Input
          value={search.query}
          placeholder={`Search by ${search.by}`}
          className="h-10 !pr-10 text-ellipsis"
          onChange={({ target }) =>
            setSearch((prev) => ({ ...prev, query: target.value }))
          }
        />
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Sliders className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Search by</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setSearch((prev) => ({ ...prev, by: "url" }))}
              >
                url
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSearch((prev) => ({ ...prev, by: "title" }))}
              >
                title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="hidden sm:grid place-items-center">
        {filteredLinks?.map((link, index) => (
          <Link
            href={link?.url as string}
            target="_blank"
            className="flex cursor-pointer w-full lg:min-w-[512.6px] max-w-[600px] items-center gap-2 border-b pb-3 mb-3"
            key={index}
          >
            <div className="bg-foreground/10 p-2 rounded-md">
              <img
                src={
                  link?.icon
                    ? link.icon
                    : `https://api.dicebear.com/7.x/thumbs/svg?seed=${index}`
                }
                alt="Site Favicon / Logo"
                className="sm:w-8 sm:h-8 w-5 h-5 object-cover rounded-md"
              />
            </div>
            <div className="ml-1 w-full">
              <div className="w-full flex items-center justify-between">
                <h3 className="sm:text-xl text-base font-semibold">
                  {link?.title && link?.title.length > 35
                    ? link?.title.substring(0, 35) + "..."
                    : link?.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => updateList(link?.id as string)}
                    >
                      Remove from list
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span className="sm:text-base text-xs">
                {link?.url && link?.url.length > 50
                  ? link?.url.substring(0, 50) + "..."
                  : link?.url}
              </span>
            </div>
          </Link>
        ))}
        {filteredLinks?.length === 0 ? (
          <div className="max-w-[600px] lg:min-w-[512.6px] w-full">
            <p>No links found</p>
          </div>
        ) : null}
      </div>
      <div className="sm:hidden">
        {links.map((link, index) => (
          <Link
            href={link?.url as string}
            target="_blank"
            className="flex cursor-pointer w-full max-w-[600px] items-center gap-2 border-b pb-3 mb-3"
            key={index}
          >
            <div className="ml-1 w-full">
              <div className="w-full flex items-center justify-between">
                <h3 className="sm:text-xl text-base font-semibold">
                  {link?.title && link?.title.length > 25
                    ? link?.title.substring(0, 25) + "..."
                    : link?.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => updateList(link?.id as string)}
                    >
                      Remove from list
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span className="sm:text-base text-xs">
                {link?.url && link?.url.length > 40
                  ? link?.url.substring(0, 40) + "..."
                  : link?.url}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
