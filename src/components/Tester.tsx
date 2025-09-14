import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";
import { type QueryParam, QueryParams } from "./QueryParams.tsx";
import { type Header, Headers } from "./Headers.tsx";
import { Body } from "./Body.tsx";

/** HTTP methods for the dropdown */
const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

/** Tab items */
const TAB_ITEMS = [
    { value: "params", label: "Params" },
    { value: "headers", label: "Headers" },
    { value: "body", label: "Body" },
    { value: "settings", label: "Settings" }
];

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

function Tester() {
    const [selectedMethod, setSelectedMethod] = useState("GET");
    const [inputURL, setInputURL] = useState("");

    const [queryParams, setQueryParams] = useState<QueryParam[]>([
        { enabled: true, key: "", value: "", description: "" }
    ]);
    const [headers, setHeaders] = useState<Header[]>(AUTO_HEADERS);

    // build a query string from enabled params that have a non-empty key
    const buildQueryString = (list = queryParams) => {
        const qs = new URLSearchParams();
        list.forEach(({ enabled, key, value }) => {
            if (!enabled) return;
            const k = key.trim();
            if (k === "") return;
            qs.append(k, value);
        });
        return qs.toString();
    };

    const sendRequestHandler = () => {
        const qs = buildQueryString();
        const urlWithQs = qs ? `${inputURL}${inputURL.includes("?") ? "&" : "?"}${qs}` : inputURL;
        alert(`Sending ${selectedMethod} request to ${urlWithQs}`);
    };

    return (
        <div className="relative flex h-full flex-col overflow-hidden">
            <div className="w-full flex-1 overflow-auto p-5">
                {/* Header */}
                <div className="flex items-center space-x-3">
                    {/* URL input with HTTP method selector */}
                    <div className="w-full">
                        <DropdownMenu.Root>
                            <div className="flex items-stretch rounded-lg border border-gray-200 bg-white">
                                <DropdownMenu.Trigger asChild style={{ minWidth: 100 }}>
                                    <button
                                        type="button"
                                        className="flex items-center justify-between gap-2.5 rounded-l-lg border-r border-gray-200 bg-gray-50 px-3 py-2 text-[13px] font-semibold text-blue-600 hover:bg-gray-100 focus:outline-none">
                                        {selectedMethod}
                                        <ChevronDownIcon className="block shrink-0 text-gray-800" />
                                    </button>
                                </DropdownMenu.Trigger>

                                <input
                                    type="text"
                                    placeholder="Enter URL or paste text"
                                    value={inputURL}
                                    onChange={(e) => setInputURL(e.target.value)}
                                    className="w-full rounded-r-lg border-none bg-gray-50 px-3 py-2 text-[13px] font-normal text-gray-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </div>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    side="bottom"
                                    align="start"
                                    sideOffset={8}
                                    className="min-w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-md">
                                    <div className="px-2 py-1.5 text-[10px] font-normal text-gray-400">
                                        HTTP Methods
                                    </div>

                                    {HTTP_METHODS.map((method) => (
                                        <DropdownMenu.Item
                                            key={method}
                                            onSelect={() => setSelectedMethod(method)}
                                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-800 outline-none data-[highlighted]:bg-indigo-50 data-[highlighted]:text-blue-600">
                                            <span className="w-6 text-xs font-medium">
                                                {method}
                                            </span>
                                            {selectedMethod === method && (
                                                <CheckIcon className="ml-auto text-blue-600" />
                                            )}
                                        </DropdownMenu.Item>
                                    ))}

                                    <hr className="mx-1.5 my-1 border-t border-gray-100" />

                                    <div className="px-2 py-1.5 text-[11px] font-normal text-gray-400">
                                        Choose a method
                                    </div>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>

                    {/* Send request button */}
                    <button
                        type="button"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none"
                        onClick={sendRequestHandler}>
                        Send
                    </button>
                </div>

                {/* Main content area */}
                <div className="mx-0.5 mt-6">
                    <Tabs.Root defaultValue="params">
                        <Tabs.List className="flex gap-6 border-b border-gray-200">
                            {TAB_ITEMS.map((tab) => (
                                <Tabs.Trigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="border-b-2 border-transparent px-1 pb-2 text-[12px] font-medium text-gray-600 select-none hover:text-gray-900 focus:outline-none data-[state=active]:border-blue-600 data-[state=active]:text-blue-600">
                                    {tab.label}
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        {/* Params */}
                        <Tabs.Content value="params" className="text-sm text-gray-500">
                            <QueryParams
                                queryParams={queryParams}
                                setQueryParams={setQueryParams}
                            />
                        </Tabs.Content>

                        {/* Headers */}
                        <Tabs.Content value="headers" className="text-sm text-gray-500">
                            <Headers headers={headers} setHeaders={setHeaders} />
                        </Tabs.Content>

                        {/* Body */}
                        <Tabs.Content value="body" className="text-sm text-gray-500">
                            <Body />
                        </Tabs.Content>

                        {/* Settings */}
                        <Tabs.Content value="settings" className="text-sm text-gray-500">
                            {/* Settings content */}
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>

            <div className="h-9 w-full shrink-0 border-t border-gray-200/70 bg-white p-3"></div>
        </div>
    );
}

export default Tester;
