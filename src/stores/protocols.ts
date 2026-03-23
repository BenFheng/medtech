import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Supplement } from "@/lib/types";

export interface SavedProtocol {
  id: string;
  name: string;
  supplements: Supplement[];
  createdAt: string;
}

interface ProtocolStore {
  protocols: SavedProtocol[];
  activeProtocolId: string | null;
  addProtocol: (name: string, supplements: Supplement[]) => string;
  removeProtocol: (id: string) => void;
  setActive: (id: string) => void;
  updateProtocol: (id: string, updates: Partial<Pick<SavedProtocol, "name" | "supplements">>) => void;
}

export const useProtocolStore = create<ProtocolStore>()(
  persist(
    (set, get) => ({
      protocols: [],
      activeProtocolId: null,

      addProtocol: (name, supplements) => {
        const id = `protocol-${Date.now()}`;
        set((state) => ({
          protocols: [...state.protocols, { id, name, supplements, createdAt: new Date().toISOString() }],
          activeProtocolId: id,
        }));
        return id;
      },

      removeProtocol: (id) =>
        set((state) => {
          const remaining = state.protocols.filter((p) => p.id !== id);
          return {
            protocols: remaining,
            activeProtocolId: state.activeProtocolId === id ? (remaining[0]?.id || null) : state.activeProtocolId,
          };
        }),

      setActive: (id) => set({ activeProtocolId: id }),

      updateProtocol: (id, updates) =>
        set((state) => ({
          protocols: state.protocols.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
    }),
    { name: "saved-protocols" }
  )
);
