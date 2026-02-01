/** Imported modules */
import React, { type FC, type Ref, useImperativeHandle, useRef, useState } from "react";
import type { ResponseState } from "../store/response-store.ts";
import ReactCodeMirror, { EditorState, EditorView } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { vscodeLightInit } from "@uiw/codemirror-theme-vscode";
import { toast } from "sonner";
import { xml } from "@codemirror/lang-xml";
import { html } from "@codemirror/lang-html";

/** Response panel ref type */
export type ResponsePanelRef = { open: () => void; close: () => void };

/** Cookie type */
type Cookie = {
    name?: string;
    key?: string;
    value: string;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    domain?: string;
    expires?: string;
};

/** Props type */
type Props = { ref: Ref<ResponsePanelRef>; response: ResponseState | undefined };

/** Constants */
const MIN_HEIGHT = 43;
const MAX_HEIGHT = 400;
const NORMAL_HEIGHT = 250;

/** Response panel component */
const ResponsePanel: FC<Props> = ({ ref, response }) => {
    /** State */
    const [height, setHeight] = useState(MIN_HEIGHT);
    const [collapsed, setCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("body");

    /** Panel ref */
    const panelRef = useRef<HTMLDivElement | null>(null);

    /** Expose open and close methods */
    useImperativeHandle(ref, () => ({
        open: () => {
            setHeight(NORMAL_HEIGHT);
            setCollapsed(false);
        },
        close: () => {
            setHeight(MIN_HEIGHT);
            setCollapsed(true);
        }
    }));

    /** Toggle between collapsed and expanded states */
    const toggleCollapse = () => {
        setHeight(collapsed ? NORMAL_HEIGHT : MIN_HEIGHT);
        setCollapsed((prev) => !prev);
    };

    /** Handle the pointer down event to initiate resizing */
    const handlePointerDown = (event: React.PointerEvent) => {
        event.preventDefault();
        const controller = new AbortController();

        const startY = event.clientY;
        document.body.style.userSelect = "none";
        document.body.style.touchAction = "none";

        /** Handle the pointer move event to resize the panel */
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const dy = startY - moveEvent.clientY;

            const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height + dy));
            if (panelRef.current) panelRef.current.style.height = `${newHeight}px`;

            setCollapsed(newHeight <= MIN_HEIGHT);
        };

        /** Handle the pointer up event to stop resizing */
        const handlePointerUp = (upEvent: PointerEvent) => {
            controller.abort();

            const dy = startY - upEvent.clientY;
            const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height + dy));

            setHeight(newHeight);
            setCollapsed(newHeight <= MIN_HEIGHT);

            document.body.style.userSelect = "";
            document.body.style.touchAction = "";
        };

        document.addEventListener("pointermove", handlePointerMove, { signal: controller.signal });
        document.addEventListener("pointerup", handlePointerUp, { signal: controller.signal });
    };

    /** Parse the cookies from the serializedCookieJar */
    const parseCookies = (): Cookie[] => {
        if (!response?.data?.serializedCookieJar) return [];

        try {
            const cookieJar = JSON.parse(response.data.serializedCookieJar);

            // Handle the different possible cookie jar formats
            if (Array.isArray(cookieJar)) return cookieJar;
            else if (cookieJar.cookies && Array.isArray(cookieJar.cookies))
                return cookieJar.cookies;
            else if (typeof cookieJar === "object")
                return Object.values(cookieJar).flat() as Cookie[];
            else return [];
        } catch (error) {
            console.error("Error parsing cookie jar:", error);
            return [];
        }
    };

    const cookies = parseCookies();

    return (
        <div
            ref={panelRef}
            style={{ height }}
            className={`flex w-full flex-col bg-white ${collapsed ? "overflow-hidden" : "overflow-visible"}`}>
            {/* Drag handle */}
            <div
                aria-label="Drag handle to resize the panel"
                onDoubleClick={toggleCollapse}
                onPointerDown={handlePointerDown}
                className="h-1 w-full shrink-0 cursor-ns-resize bg-[#F5F5F5] hover:bg-[#EBEBEB]"></div>

            {/* Content */}
            {!response || response.loading || !response.data || response.error ? (
                <div>
                    {/* Header */}
                    <div className="flex h-10 w-full items-center justify-between px-4">
                        {/* Header */}
                        <div className="text-[13px] font-medium text-gray-800">Response</div>

                        {/* Collapse button */}
                        <button
                            type="button"
                            aria-label="Collapse response panel"
                            onClick={toggleCollapse}
                            className={`rounded-md p-1 text-gray-700 hover:bg-[#F5F5F5] ${
                                collapsed && "rotate-180"
                            }`}>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex h-48 w-full items-center justify-center">
                        {!response ? (
                            <div className="text-sm font-normal text-gray-500">
                                Send a request to see the response here
                            </div>
                        ) : response.loading ? (
                            <div className="text-sm font-normal text-gray-500">
                                Sending the request...
                            </div>
                        ) : (
                            <div className="text-sm font-normal text-red-500">
                                Error: {response.error}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                    {/* Header */}
                    <div className="flex h-10 w-full shrink-0 items-center justify-between border-b border-[#EBEBEB] px-4">
                        {/* Tabs */}
                        <div className="flex items-center gap-2">
                            {["Body", "Cookies", "Headers"].map((tab, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Switch to ${tab} tab`}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`rounded-md px-2 py-1 text-xs ${
                                        activeTab === tab.toLowerCase()
                                            ? "bg-[#F5F5F5] font-medium text-gray-800"
                                            : "font-normal text-gray-500 hover:bg-[#F5F5F5]"
                                    }`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Metrics and collapse button */}
                        <div className="flex items-center gap-3.5">
                            {/* Status */}
                            <div
                                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                                    response.data.statusCode >= 200 &&
                                    response.data.statusCode < 300
                                        ? "bg-green-50 text-green-600"
                                        : response.data.statusCode >= 300 &&
                                            response.data.statusCode < 400
                                          ? "bg-yellow-50 text-yellow-600"
                                          : "bg-red-50 text-red-600"
                                }`}>
                                <span>{response.data.statusCode}</span>
                                <span>{response.data.statusMessage}</span>
                            </div>

                            {/* Duration */}
                            <div className="text-xs font-normal text-gray-500">
                                {response.data.timings.total < 1000
                                    ? `${response.data.timings.total} ms`
                                    : `${(response.data.timings.total / 1000).toFixed(2)} s`}
                            </div>

                            {/* Size */}
                            <div className="text-xs font-normal text-gray-500">
                                {response.data.size < 1024
                                    ? `${response.data.size} B`
                                    : response.data.size < 1024 * 1024
                                      ? `${(response.data.size / 1024).toFixed(2)} KB`
                                      : `${(response.data.size / (1024 * 1024)).toFixed(2)} MB`}
                            </div>

                            {/* Collapse button */}
                            <button
                                type="button"
                                aria-label="Collapse response panel"
                                onClick={toggleCollapse}
                                className={`rounded-md p-1 text-gray-700 hover:bg-[#F5F5F5] ${
                                    collapsed && "rotate-180"
                                }`}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body tab */}
                    {activeTab === "body" && (
                        <div className="flex min-h-0 flex-1 flex-col">
                            {/* Header */}
                            <div className="flex h-10 w-full shrink-0 items-center justify-between border-b border-[#EBEBEB] px-4">
                                {/* Body type */}
                                <div className="flex items-center gap-2">
                                    <div className="text-xs font-medium tracking-wide text-gray-600">
                                        Response
                                    </div>
                                    <div className="rounded-md bg-[#F5F5F5] px-2 py-1 text-xs font-medium text-gray-800 uppercase">
                                        {response.data.body.type}
                                    </div>
                                </div>

                                {/* Copy button */}
                                <button
                                    type="button"
                                    aria-label="Copy response body to clipboard"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(
                                            response!.data!.body.value
                                        );
                                        toast.success("Response body copied to clipboard");
                                    }}
                                    className="rounded-md p-1.25 text-gray-700 hover:bg-[#F5F5F5]">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16 8V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.71569 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.0799 2 5.2V12.8C2 13.9201 2 14.4802 2.21799 14.908C2.40973 15.2843 2.71569 15.5903 3.09202 15.782C3.51984 16 4.0799 16 5.2 16H8M11.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V11.2C22 10.0799 22 9.51984 21.782 9.09202C21.5903 8.71569 21.2843 8.40973 20.908 8.21799C20.4802 8 19.9201 8 18.8 8H11.2C10.0799 8 9.51984 8 9.09202 8.21799C8.71569 8.40973 8.40973 8.71569 8.21799 9.09202C8 9.51984 8 10.0799 8 11.2V18.8C8 19.9201 8 20.4802 8.21799 20.908C8.40973 21.2843 8.71569 21.5903 9.09202 21.782C9.51984 22 10.0799 22 11.2 22Z"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Code mirror */}
                            <ReactCodeMirror
                                value={response.data.body.value}
                                theme={vscodeLightInit({
                                    settings: {
                                        background: "#FCFCFC",
                                        gutterBackground: "#FCFCFC",
                                        gutterBorder: "#FCFCFC",
                                        fontSize: "13px"
                                    }
                                })}
                                extensions={[
                                    ...(response.data.body.type === "json"
                                        ? [json()]
                                        : response.data.body.type === "xml"
                                          ? [xml()]
                                          : response.data.body.type === "html"
                                            ? [html()]
                                            : []),
                                    EditorView.theme({
                                        "&": { height: "100%", width: "100%" },
                                        ".cm-scroller": { overflow: "auto" },
                                        "&.cm-focused": { outline: "none" },
                                        ".cm-gutters": { padding: "0 8px" }
                                    }),
                                    EditorView.lineWrapping,
                                    EditorState.readOnly.of(true)
                                ]}
                                basicSetup={{
                                    highlightActiveLineGutter: false,
                                    highlightActiveLine: false
                                }}
                                className="min-h-0 flex-1"
                            />
                        </div>
                    )}

                    {/* Cookies tab */}
                    {activeTab === "cookies" && (
                        <div className="min-h-0 flex-1 overflow-y-auto p-5">
                            {cookies.length === 0 ? (
                                <div className="flex h-32 items-center justify-center text-sm font-normal text-gray-500">
                                    No cookies in this response
                                </div>
                            ) : (
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {cookies.map((cookie: Cookie, index: number) => (
                                        <li key={index}>
                                            <span className="font-medium">
                                                {cookie.name || cookie.key}
                                            </span>
                                            : {cookie.value}{" "}
                                            {cookie.path && (
                                                <span className="text-xs text-gray-500">
                                                    (Path: {cookie.path})
                                                </span>
                                            )}{" "}
                                            {cookie.httpOnly && (
                                                <span className="text-xs text-gray-500">
                                                    (HttpOnly)
                                                </span>
                                            )}{" "}
                                            {cookie.secure && (
                                                <span className="text-xs text-gray-500">
                                                    (Secure)
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Headers tab */}
                    {activeTab === "headers" && (
                        <div className="min-h-0 flex-1 overflow-y-auto p-5">
                            {/* Headers table */}
                            <table className="table-fixed border-collapse">
                                {/* Table head */}
                                <thead>
                                    <tr className="bg-[#FAFAFA]">
                                        <th className="w-2/6 border border-[#E6E6E6] px-4 py-2 text-left text-xs font-medium text-gray-700">
                                            Key
                                        </th>
                                        <th className="w-4/6 border border-[#E6E6E6] px-4 py-2 text-left text-xs font-medium text-gray-700">
                                            Value
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table body */}
                                <tbody>
                                    {Object.entries(response.data.headers).map(
                                        ([key, value], index) => (
                                            <tr
                                                key={index}
                                                className="bg-white transition-colors hover:bg-[#FAFAFA]">
                                                <td className="border border-[#E6E6E6] px-4 py-2 text-xs font-normal text-gray-700">
                                                    {key}
                                                </td>
                                                <td className="border border-[#E6E6E6] px-4 py-2 text-xs font-normal break-all text-gray-700">
                                                    {value}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResponsePanel;
