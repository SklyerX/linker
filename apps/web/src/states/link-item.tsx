import { GroupLink, Link } from "@/types";
import { Url } from "database";
import { create } from "zustand";

type eventType = "linkitem/delete" | "linkitem/update";
type payload = GroupLink | Link | Url;

type LinkItem = {
  eventType: eventType | undefined;
  payload: payload | undefined;
  setActions: (eventType: eventType, payload: payload) => void;
  resetActions: () => void;
};

export const useLinkStore = create<LinkItem>((set) => ({
  eventType: undefined,
  payload: undefined,
  resetActions: () => set({ eventType: undefined, payload: undefined }),
  setActions: (eventType, payload) => set({ eventType, payload }),
}));
