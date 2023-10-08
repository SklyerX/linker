import { List, Lock, Palette, Wrench } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function MobileSettingsBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <List className="w-5 h-5" />
          <h3>Settings</h3>
        </div>
      </SheetTrigger>
      <SheetContent side="left">
        <h3 className="font-semibold text-foreground/70 text-l my-2">Main</h3>
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
      </SheetContent>
    </Sheet>
  );
}
