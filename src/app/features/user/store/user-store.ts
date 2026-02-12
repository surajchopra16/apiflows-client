/** Imported modules */
import { create } from "zustand";

/** Current user type */
export type CurrentUser = { role: "user" | "guest"; _id: string; email: string } | null;

/** User store type */
type UserStore = {
    user: CurrentUser;
    isInitialState: boolean;
    setUser: (user: CurrentUser) => void;
    clearUser: () => void;
};

/** User store */
export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isInitialState: false,

    /** Set the user */
    setUser: (user: CurrentUser) => {
        set({ user, isInitialState: true });
    },

    /** Clean the user */
    clearUser: () => {
        set({ user: null });
    }
}));
