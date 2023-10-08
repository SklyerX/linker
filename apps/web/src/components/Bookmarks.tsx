import clsx from "clsx";
import CryptoJS from "crypto-js";
import { CornerDownRight, Folder } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./ui/input";

interface Props {
  file: File;
  onError: () => void;
}

interface Bookmark {
  dateAdded: number;
  id: string;
  index: number;
  parentId: string;
  title: string;
  url: string;
  children?: Bookmark[];
}

interface BookmarkSearch {
  by: "url" | "title";
  query: string;
}

export default function Bookmarks({ file, onError }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [otherBookmarks, setOtherBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [filteredOthers, setFilteredOthers] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState({ bookmark: "", other: "" });

  // Define a common function to filter bookmarks
  function filterBookmarks(items: Bookmark[], query: string): Bookmark[] {
    return items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }

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

          setBookmarks(parsedData[0].children[0].children);
          setOtherBookmarks(parsedData[0].children[1].children);
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
  }, [file, onError]);

  useEffect(() => {
    setFilteredBookmarks(filterBookmarks(bookmarks, search.bookmark));
  }, [search.bookmark, bookmarks]);

  useEffect(() => {
    setFilteredOthers(filterBookmarks(otherBookmarks, search.other));
  }, [search.other, otherBookmarks]);

  function RenderBookmarks(bookmarks: Bookmark[], isNested: boolean = false) {
    return (
      <ul className={clsx(isNested && "ml-12")}>
        {bookmarks.map((item) => (
          <li key={item.id}>
            <div className="inline-flex items-center gap-2">
              {isNested ? (
                <CornerDownRight className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              )}

              <Link href={item.url || "#"} target="_blank">
                <>
                  {item.title ? (
                    <>
                      {item.title.length > 86
                        ? item.title.substring(0, 83) + "..."
                        : item.title}
                    </>
                  ) : (
                    <>
                      {item.url && item.url.length > 86
                        ? item.url.substring(0, 83) + "..."
                        : item.url}
                    </>
                  )}
                </>
              </Link>
            </div>
            {item.children && RenderBookmarks(item.children, true)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="max-w-[700px]">
      <Input
        value={search.bookmark}
        placeholder="Search by title"
        className="h-10 text-ellipsis my-3"
        onChange={({ target }) =>
          setSearch((prev) => ({ ...prev, bookmark: target.value }))
        }
      />
      <h3 className="text-xl font-semibold mb-3">Bookmark Bar</h3>
      <div>{RenderBookmarks(filteredBookmarks)}</div>
      <Input
        value={search.other}
        placeholder="Search by title"
        className="h-10 text-ellipsis mb-3 mt-10"
        onChange={({ target }) =>
          setSearch((prev) => ({ ...prev, other: target.value }))
        }
      />
      <h3 className="text-xl font-semibold mb-3">Others</h3>
      <div className="mb-10">{RenderBookmarks(filteredOthers)}</div>
    </div>
  );
}
