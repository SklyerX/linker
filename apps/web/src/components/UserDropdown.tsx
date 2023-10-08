"use client";

import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  image?: string | null;
  isDesktop?: boolean;
}

export default function UserDropdown({ image, isDesktop }: Props) {
  const router = useRouter();

  const signUserOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img
          src={image || "https://via.placeholder.com/1000"}
          alt="User Profile Picture"
          className={clsx("rounded-full", isDesktop ? "w-8 h-8" : "w-10 h-10")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuItem onSelect={() => signUserOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
