import { Link, Tab } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { Url } from "database";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjectEmpty(obj: Object) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function sleep(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

export function isTab(obj: Object): obj is Tab {
  return (
    typeof obj === "object" &&
    "icon" in obj &&
    "title" in obj &&
    "url" in obj &&
    typeof obj.icon === "string" &&
    typeof obj.url === "string" &&
    typeof obj.title === "string"
  );
}

export function isUrl(obj: Object): obj is Url {
  return (
    typeof obj === "object" &&
    "urlId" in obj &&
    "active" in obj &&
    "redirectUrl" in obj &&
    typeof obj.urlId === "string" &&
    typeof obj.redirectUrl === "string" &&
    typeof obj.active === "boolean"
  );
}

export function isLink(obj: Object): obj is Link {
  return (
    typeof obj === "object" &&
    "image" in obj &&
    "title" in obj &&
    "url" in obj &&
    typeof obj.image === "string" &&
    typeof obj.title === "string" &&
    typeof obj.url === "string"
  );
}

export const nanoid = customAlphabet(
  [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "-_",
  ].join("")
);
