"use client";

import clsx from "clsx";
import { FolderDown, FolderUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ImportExportTabNavigator() {
  const pathname = usePathname();

  return (
    <div className="border-b h-14 flex items-center fixed top-32 lg:top-0 left-0 lg:left-80 w-full mx-3 mb-0">
      <div className="flex items-stretch gap-10">
        <Link
          href="/dashboard/settings"
          className={clsx(
            "h-14 inline-flex items-center gap-2",
            pathname === "/dashboard/settings"
              ? "border-b-2 border-foreground"
              : null
          )}
        >
          <FolderDown className="w-4 h-4" />
          Import
        </Link>
        <Link
          href="/dashboard/settings/export"
          className={clsx(
            "h-14 inline-flex items-center gap-2",
            pathname === "/dashboard/settings/export"
              ? "border-b-2 border-foreground"
              : null
          )}
        >
          <FolderUp className="w-4 h-4" />
          Export
        </Link>
      </div>
    </div>
  );
}
