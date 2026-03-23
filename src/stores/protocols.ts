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
  reorderProtocol: (id: string, direction: "left" | "right") => void;
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

      reorderProtocol: (id, direction) =>
        set((state) => {
          const idx = state.protocols.findIndex((p) => p.id === id);
          if (idx < 0) return state;
          const newIdx = direction === "left" ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= state.protocols.length) return state;
          const arr = [...state.protocols];
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
          return { protocols: arr };
        }),
    }),
    { name: "saved-protocols" }
  )
);
