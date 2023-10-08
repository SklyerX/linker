"use client";

import clsx from "clsx";
import { FolderHeart, Sticker } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChromeTabsNavigator() {
  const pathname = usePathname();

  return (
    <div className="border-b h-14 z-10 flex items-center absolute lg:fixed backdrop-blur-lg top-16 lg:top-0 left-0 lg:left-16 w-full mx-3 mb-0">
      <div className="flex items-stretch gap-10">
        <Link
          href="/dashboard/chrome"
          className={clsx(
            "h-14 inline-flex items-center gap-2",
            pathname === "/dashboard/chrome"
              ? "border-b-2 border-foreground"
              : null
          )}
        >
          <FolderHeart className="w-4 h-4" />
          Bookmarks
        </Link>
        <Link
          href="/dashboard/chrome/tabs"
          className={clsx(
            "h-14 inline-flex items-center gap-2",
            pathname === "/dashboard/chrome/tabs"
              ? "border-b-2 border-foreground"
              : null
          )}
        >
          <Sticker className="w-4 h-4" />
          My Tabs
        </Link>
      </div>
    </div>
  );
}
