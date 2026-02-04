/** Imported modules */
import { useState, useImperativeHandle, type FC, type Ref, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCookieStore } from "../store/cookie-store.ts";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

/** Cookie type */
type Cookie = {
    key: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    hostOnly: boolean;
    creation: string;
    lastAccessed: string;
    sameSite: "lax" | "strict" | "none" | "no_restriction";
};

/** Cookie overlay ref type */
export type CookieOverlayRef = { open: () => void; close: () => void };

/** Parse the serialized cookie jar */
const parseCookieJar = (serializedCookieJar?: string): Cookie[] => {
    if (!serializedCookieJar) return [];

    try {
        const parsedJar = JSON.parse(serializedCookieJar);
        let cookies: Cookie[] = [];

        if (parsedJar.cookies && Array.isArray(parsedJar.cookies)) cookies = parsedJar.cookies;

        return cookies;
    } catch {
        toast.error("Failed to parse cookie jar");
        return [];
    }
};

/** Cookie overlay component */
const CookieOverlay: FC<{ ref: Ref<CookieOverlayRef> }> = ({ ref }) => {
    /** States */
    const [open, setOpen] = useState(false);
    const [cookies, setCookies] = useState<Cookie[]>([]);

    /** Cookie store */
    const serializedCookieJar = useCookieStore((state) => state.serializedCookieJar);
    const setSerializedCookieJar = useCookieStore((state) => state.setSerializedCookieJar);

    /** Parse cookies when overlay opens */
    useEffect(() => {
        if (open) setCookies(parseCookieJar(serializedCookieJar));
    }, [open, serializedCookieJar]);

    /** Expose open and close methods */
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false)
    }));

    /** Handle the deletion of a cookie */
    const handleDeleteCookie = (index: number) => {
        try {
            const parsed = JSON.parse(serializedCookieJar || "{}");
            if (parsed.cookies && Array.isArray(parsed.cookies)) {
                parsed.cookies.splice(index, 1);
                const updated = JSON.stringify(parsed);
                setSerializedCookieJar(updated);
                setCookies(parseCookieJar(updated));
                toast.success("Cookie deleted");
            }
        } catch {
            toast.error("Failed to delete cookie");
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

                {/* Content */}
                <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl duration-200">
                    {/* Header */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                        {/* Title & Description */}
                        <div className="space-y-1.5">
                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                Cookie Manager
                            </Dialog.Title>

                            <Dialog.Description className="text-sm font-normal text-gray-500">
                                Manage cookies stored in your session. Cookies are automatically
                                sent with requests
                            </Dialog.Description>
                        </div>

                        {/* Close icon */}
                        <button
                            aria-label="Close"
                            type="button"
                            onClick={() => setOpen(false)}
                            className="shrink-0 rounded-md bg-white p-1 text-gray-500 hover:bg-zinc-100 focus:outline-none">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17 7L7 17M7 7L17 17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Cookies */}
                    <div className="max-h-[500px] overflow-y-auto p-1">
                        {cookies.length === 0 ? (
                            <div className="flex h-32 items-center justify-center text-sm font-normal text-gray-400">
                                No cookies found
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {cookies.map((cookie, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-xl bg-[#F5F5F5] p-4 ring ring-[#EBEBEB]">
                                        {/* Header */}
                                        <div className="mb-1 flex items-start justify-between">
                                            {/* Title & domain */}
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <div className="truncate text-sm font-bold text-gray-900">
                                                    {cookie.key}
                                                </div>

                                                <div className="text-xs font-normal text-gray-500">
                                                    {cookie.domain}
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                aria-label="Delete Cookie"
                                                onClick={() => handleDeleteCookie(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 focus:outline-none">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div className="mb-3 rounded-lg border border-[#EBEBEB] bg-white px-3 py-2 font-mono text-[11px] font-normal break-all text-gray-600">
                                            {cookie.value}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex flex-col gap-3">
                                            {/* Attributes Row */}
                                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium text-gray-600">
                                                {/* Path */}
                                                <span className="inline-flex items-center rounded-md border border-[#EBEBEB] bg-white px-2.5 py-1 capitalize">
                                                    Path: {cookie.path}
                                                </span>

                                                {/* SameSite */}
                                                <span className="inline-flex items-center rounded-md border border-[#EBEBEB] bg-white px-2.5 py-1 capitalize">
                                                    {cookie.sameSite || "Lax"}
                                                </span>

                                                {cookie.secure && (
                                                    <span className="inline-flex items-center rounded-md border border-[#EBEBEB] bg-white px-2.5 py-1 capitalize">
                                                        Secure
                                                    </span>
                                                )}

                                                {cookie.httpOnly && (
                                                    <span className="inline-flex items-center rounded-md border border-[#EBEBEB] bg-white px-2.5 py-1 capitalize">
                                                        HttpOnly
                                                    </span>
                                                )}

                                                {cookie.hostOnly && (
                                                    <span className="inline-flex items-center rounded-md border border-[#EBEBEB] bg-white px-2.5 py-1 capitalize">
                                                        HostOnly
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CookieOverlay;
