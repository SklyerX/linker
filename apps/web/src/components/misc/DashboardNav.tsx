import { getAuthSession } from "@/lib/auth";
import {
  Chrome,
  Link as LinkIcon,
  Scissors,
  Scroll,
  Settings,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import MobileMenu from "../MobileMenu";
import UserButton from "../UserButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const navbar_options = [
  {
    icon: LinkIcon,
    href: "/dashboard",
    tooltip: "Unordered Links",
  },
  {
    icon: Table2,
    href: "/dashboard/grouped",
    tooltip: "Grouped Links",
  },
  { breakpoint: true },
  {
    icon: Scroll,
    href: "/dashboard/markdown",
    tooltip: "Markdown",
  },
  {
    icon: Chrome,
    href: "/dashboard/chrome",
    tooltip: "Chrome Tools",
  },
  {
    icon: Scissors,
    href: "/dashboard/shortener",
    tooltip: "URL Shortner",
  },
  { breakpoint: true },
  {
    icon: Settings,
    href: "/dashboard/settings",
    tooltip: "App Settings",
  },
];

export default async function DashboardNav() {
  const session = await getAuthSession();

  if (!session) return redirect("/");

  return (
    <>
      <div className="w-full flex items-center justify-between h-16 border-b lg:hidden p-3">
        <MobileMenu />
        <UserButton />
      </div>
      <div className="hidden z-20 fixed top-0 left-0 lg:flex flex-col items-center justify-between pt-4 w-16 h-screen border-r p-3.5">
        <div className="flex flex-col gap-3 items-center">
          {navbar_options.map((link, index) => (
            <>
              {link.breakpoint ? (
                <div className="h-[1px] w-full bg-input"></div>
              ) : (
                <TooltipProvider delayDuration={0} key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={link.href!}>
                        <link.icon />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{link.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          ))}
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <UserButton isDesktop />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>User Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
