import type { User } from "@farmei/types";
import { create } from "zustand";

type SessionState = {
  user: User | null;
  isHydrating: boolean;
  setUser: (user: User | null) => void;
  setHydrating: (value: boolean) => void;
};

export const useSession = create<SessionState>((set) => ({
  user: null,
  isHydrating: true,
  setUser: (user) => set({ user }),
  setHydrating: (value) => set({ isHydrating: value })
}));
