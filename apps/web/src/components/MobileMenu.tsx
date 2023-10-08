import {
  Chrome,
  Link as LinkIcon,
  Menu,
  Scissors,
  Scroll,
  Settings,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-2">
        <div className="bg-input rounded-md p-2 active:scale-90">
          <Menu className="w-5 h-5" />
        </div>
        <h3 className="font-semibold">Linker</h3>
      </SheetTrigger>
      <SheetContent side="left">
        <h3 className="font-semibold text-foreground/70 text-l my-2">Main</h3>
        <div>
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
          >
            <LinkIcon className="w-4 h-4" />
            <span>Unordered Links</span>
          </Link>
          <Link
            href="/dashboard/grouped"
            className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
          >
            <Table2 className="w-4 h-4" />
            <span>Grouped Links</span>
          </Link>
        </div>
        <h3 className="font-semibold text-foreground/70 text-lg my-2">
          Helpers
        </h3>
        <div>
          <Link
            href="/dashboard/markdown"
            className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
          >
            <Scroll className="w-4 h-4" />
            <span>Markdown</span>
          </Link>
          <Link
            href="/dashboard/chrome"
            className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
          >
            <Chrome className="w-4 h-4" />
            <span>Chrome Tools</span>
          </Link>
          <Link
            href="/dashboard/shortener"
            className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
          >
            <Scissors className="w-4 h-4" />
            <span>URL Shortner</span>
          </Link>
        </div>
        <h3 className="font-semibold text-foreground/70 text-lg my-2">Other</h3>
        <div>
          <Link
            href="/dashboard/settings"
            className="w-full flex items-center gap-2 border py-2 px-3 hover:bg-input/20 transition-colors rounded-xl mt-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
