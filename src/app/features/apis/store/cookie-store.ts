/** Imported modules */
import { create } from "zustand/react";

/** Cookie jar key */
const COOKIE_JAR_KEY = "apiflows_cookie_jar";

/** Cookie store type */
type CookieStore = {
    serializedCookieJar: string;
    setSerializedCookieJar: (jar: string) => void;
    loadCookieJar: () => void;
    clearCookieJar: () => void;
};

/** Cookie store */
export const useCookieStore = create<CookieStore>((set) => ({
    serializedCookieJar: "",

    /** Set the serialized cookie jar */
    setSerializedCookieJar: (jar: string) => {
        localStorage.setItem(COOKIE_JAR_KEY, jar);
        set({ serializedCookieJar: jar });
    },

    /** Load the cookie jar from localStorage */
    loadCookieJar: () => {
        const jar = localStorage.getItem(COOKIE_JAR_KEY) || "";
        set({ serializedCookieJar: jar });
    },

    /** Clear the cookie jar */
    clearCookieJar: () => {
        localStorage.removeItem(COOKIE_JAR_KEY);
        set({ serializedCookieJar: "" });
    }
}));
