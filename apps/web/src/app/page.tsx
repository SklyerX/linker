import RegularNavbar from "@/components/misc/RegularNavbar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowUpDown,
  Chrome,
  Link2,
  Newspaper,
  Palette,
  Table2,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <RegularNavbar />
      <main className="flex-1 mb-10">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-2xl md:text-2xl lg:text-4xl xl:text-5xl font-bold">
              A link saving app made for those who like to hoard their tabs and
              links
            </h1>
            <p className="max-w-[52rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              I made this app because I have over 170 tabs open at a time and I
              never feel like closing them because I might need them in the
              future 💀. I built this to help those like myself
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                Get Started
              </Link>
              <Link
                href="https://github.com/sklyerx/linker"
                target="_blank"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                GitHub
              </Link>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="container space-y-6 py-8 md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h3 className="font-semibold text-3xl leading-3 flex-col items-center space-y-4 text-center">
              Features
            </h3>
            <p className="max-w-[82%] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              There are many things integrated in this app to make your life
              easier. From link gathering to aesthetics.
            </p>
          </div>
        </section>
        <div className="mx-auto grid p-2 justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="p-4 rounded-md md:min-w-[300px] border-2 border-dotted">
            <Chrome className="w-8 h-8" />
            <h3 className="font-medium mt-2">Chrome</h3>
            <p className="text-muted-foreground w-11/12 text-sm">
              Import bookmarks and open tabs and perform crud operations on
              them!
            </p>
          </div>
          <div className="p-4 rounded-md md:min-w-[300px] border-2 border-dotted">
            <Link2 className="w-8 h-8" />
            <h3 className="font-medium mt-2">URL Shortener</h3>
            <p className="text-muted-foreground w-11/12 text-sm">
              Shorten urls with easy and share them among your friends!
            </p>
          </div>
          <div className="p-4 rounded-md md:min-w-[300px] border-2 border-dotted">
            <Newspaper className="w-8 h-8" />
            <h3 className="font-medium mt-2">Notes</h3>
            <p className="text-muted-foreground w-11/12 text-sm">
              Write and taken notes with ease markdown-like-features.
            </p>
          </div>
          <div className="p-4 rounded-md md:min-w-[300px] border-2 border-dotted">
            <Table2 className="w-8 h-8" />
            <h3 className="font-medium mt-2">Groups</h3>
            <p className="text-muted-foreground w-11/12 text-sm">
              Oragnize your links and easily search through them!
            </p>
          </div>
          <div className="p-4 rounded-md md:min-w-[300px] border-2 border-dotted">
            <Palette className="w-8 h-8" />
            <h3 className="font-medium mt-2">Themes</h3>
            <p className="text-muted-foreground w-11/12 text-sm">
              Pick and choose from a mix of colors and make the app look sleeker
            </p>
          </div>
          <div className="p-4 rounded-md md:min-w-[300px] border-2 border-dotted">
            <ArrowUpDown className="w-8 h-8" />
            <h3 className="font-medium mt-2">Import & Export</h3>
            <p className="text-muted-foreground w-11/12 text-sm">
              Backup your account data or share all your links with a friend
              with absolute ease.
            </p>
          </div>
        </div>
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h3 className="font-semibold text-3xl leading-3 flex-col items-center space-y-4 text-center">
              Open Source
            </h3>
            <p className="max-w-[82%] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              This project is proudly open sourced under the{"  "}
              <Link
                href="https://www.gnu.org/licenses/agpl-3.0.en.html"
                className="text-primary text-lg"
              >
                GNU Affero General Public License version 3 (AGPL-3.0)
              </Link>
              {"   "}
              so feel free to contribute to the project with ease! I'd
              appreciate it very much ❤️
            </p>
          </div>
        </section>
        <footer className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-sm">
              Built by{" "}
              <Link
                href="https://skylerx.ir?ref=linker"
                className="underline underline-offset-4"
              >
                SkylerX
              </Link>{" "}
              , Code available on{" "}
              <Link
                href="https://github.com/sklyerx/linker"
                className="underline underline-offset-4"
              >
                Github
              </Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
