import { getAuthSession } from "@/lib/auth";
import { Command } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetTrigger } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default async function RegularNavbar() {
  const session = await getAuthSession();

  return (
    <>
      <div className="container border-b md:border-none mb-5 md:mb-0 z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 items-center md:gap-10">
            <Link href="/" className="items-center md:flex hidden space-x-2">
              <Command className="w-6 h-6" />
              <span className="text-2xl font-semibold">Linker</span>
            </Link>
            <nav className="gap-6 md:flex hidden">
              <Link
                href="#features"
                className="text-foreground/60 hover:text-foreground/80 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="/docs"
                className="text-foreground/60 hover:text-foreground/80 transition-colors font-medium"
              >
                Documentation
              </Link>
              <Link
                href="/blog"
                className="text-foreground/60 hover:text-foreground/80 transition-colors font-medium"
              >
                Blog
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-1 md:hidden items-center">
                <Command className="w-5 h-5" />
                <span className="text-xl font-semibold">Menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="text-foreground/60 hover:text-foreground/80 hover:underline transition-colors font-medium"
                  >
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/#features"
                    className="text-foreground/60 hover:text-foreground/80 hover:underline transition-colors font-medium"
                  >
                    Features
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/docs"
                    className="text-foreground/60 hover:text-foreground/80 hover:underline transition-colors font-medium"
                  >
                    Documentation
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/blog"
                    className="text-foreground/60 hover:text-foreground/80 hover:underline transition-colors font-medium"
                  >
                    Blog
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {session ? (
            <Link href="/dashboard">
              <img
                src={session.user?.image!}
                className="w-10 h-10 rounded-full"
              />
            </Link>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "default" })}
            >
              Get Started -
              <span className="italic font-normal ml-1">it's free</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
