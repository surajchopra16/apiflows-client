/** Imported modules */
import type { Header } from "./types.ts";

/** Auto generated headers */
const AUTO_HEADERS: Header[] = [
    {
        enabled: true,
        key: "Host",
        value: "calculated at runtime",
        description: "Auto generated",
        auto: true
    },
    {
        enabled: true,
        key: "User-Agent",
        value: "APITest/1.0",
        description: "Auto generated",
        auto: true
    },
    {
        enabled: true,
        key: "Accept",
        value: "*/*",
        description: "Auto generated",
        auto: true
    },
    {
        enabled: true,
        key: "Accept-Encoding",
        value: "gzip, deflate, br",
        description: "Auto generated",
        auto: true
    },
    {
        enabled: true,
        key: "Connection",
        value: "keep-alive",
        description: "Auto generated",
        auto: true
    },
    {
        enabled: true,
        key: "Cache-Control",
        value: "no-cache",
        description: "Auto generated",
        auto: true
    }
];

/** HTTP method colors */
const METHOD_COLORS: Record<string, string> = {
    GET: "text-emerald-600",
    POST: "text-yellow-600",
    PUT: "text-indigo-600",
    PATCH: "text-sky-600",
    DELETE: "text-rose-600",
    HEAD: "text-teal-600",
    OPTIONS: "text-purple-600"
};

export { AUTO_HEADERS, METHOD_COLORS };
