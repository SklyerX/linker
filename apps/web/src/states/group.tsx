import { create } from "zustand";

interface ICreateGroup {
  created: boolean;
  setCreated: (created: boolean) => void;
}

export const groupStore = create<ICreateGroup>()((set) => ({
  created: false,
  setCreated: (created: boolean) => set({ created }),
}));
