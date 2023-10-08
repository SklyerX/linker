"use client";

import { Palette, Wrench, Lock } from "lucide-react";
import Link from "next/link";
import MobileSettingsBar from "../MobileSettingsBar";

export default function SettingsSidebar() {
  return (
    <>
      <div className="w-full flex items-center absolute left-0 gap-2 border-b p-4 lg:hidden">
        <MobileSettingsBar />
      </div>
      <div className="border-r w-64 h-screen fixed top-0 left-16 lg:block hidden">
        <div className="p-3">
          <div className="flex flex-col gap-2">
            <div>
              <Link
                href="/dashboard/settings/migration"
                className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Import & Export</span>
              </Link>
              <Link
                href="/dashboard/settings/themes"
                className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
              >
                <Palette className="w-4 h-4" />
                <span>Themes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
