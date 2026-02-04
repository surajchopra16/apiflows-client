/** Imported modules */
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Params from "./request-components/Params.tsx";
import Headers from "./request-components/Headers.tsx";
import BodyEditor from "./request-components/BodyEditor.tsx";
import Settings from "./request-components/Settings.tsx";
import { useTabStore } from "../store/tab-store.ts";
import { useRequestStore } from "../store/request-store.ts";
import { requestAPI } from "../api/request-api.ts";
import Overview from "./Overview.tsx";
import ResponsePanel, { type ResponsePanelRef } from "./ResponsePanel.tsx";
import { validateRequest } from "../utils/request-validator.ts";
import { serializeRequest } from "../utils/request-serializer.ts";
import type { HttpMethod } from "../utils/types.ts";
import { cloudAgentAPI } from "../api/cloud-agent-api.ts";
import { useResponseStore } from "../store/response-store.ts";
import { METHOD_COLORS } from "../utils/data.ts";
import { useCollectionStore } from "../store/collection-store.ts";
import { useCookieStore } from "../store/cookie-store.ts";

/** HTTP methods for the dropdown */
const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

/** Tab items */
const TAB_ITEMS = ["params", "headers", "body", "settings"];

/** Request builder component */
const RequestBuilder = () => {
    /** States */
    const [activeTab, setActiveTab] = useState("params");

    /** Refs */
    const responsePanelRef = useRef<ResponsePanelRef | null>(null);

    /** Collection store */
    const getRequestNodeLocation = useCollectionStore((state) => state.getRequestNodeLocation);

    /** Tab store */
    const activeTabId = useTabStore((state) => state.activeTabId);

    /** Request store */
    const requests = useRequestStore((state) => state.requests);
    const addRequest = useRequestStore((state) => state.addRequest);
    const addPendingChange = useRequestStore((state) => state.addPendingChange);

    /** Response store */
    const responses = useResponseStore((state) => state.responses);
    const addLoadingResponse = useResponseStore((state) => state.addLoadingResponse);
    const addSuccessResponse = useResponseStore((state) => state.addSuccessResponse);
    const addErrorResponse = useResponseStore((state) => state.addErrorResponse);
    const cancelResponse = useResponseStore((state) => state.cancelResponse);

    /** Cookie store */
    const serializedCookieJar = useCookieStore((state) => state.serializedCookieJar);
    const setSerializedCookieJar = useCookieStore((state) => state.setSerializedCookieJar);

    /** Current active request */
    const request = useMemo(() => {
        const activeRequest = requests.find((request) => request.original._id === activeTabId);
        if (!activeRequest) return undefined;

        // Retrieve the breadcrumb
        const breadcrumb = [];

        const requestNodeLocation = getRequestNodeLocation(activeTabId!);
        if (requestNodeLocation) {
            breadcrumb.push(requestNodeLocation.collectionName);
            if (requestNodeLocation.folderName) breadcrumb.push(requestNodeLocation.folderName);
            breadcrumb.push(activeRequest.original.name);
        }

        return { ...activeRequest.original, ...activeRequest.pendingChanges, breadcrumb };
    }, [requests, activeTabId]);

    /** Current active response */
    const response = responses.find((response) => response.requestId === activeTabId);

    /** Load the request */
    useEffect(() => {
        (async () => {
            if (!activeTabId || request) return;

            try {
                const data = await requestAPI.getRequest(activeTabId);
                addRequest(data);
            } catch (err) {
                console.error("Failed to load request:", err);
            }
        })();
    }, [activeTabId, request]);

    /** Handle the sending the request */
    const handleSendRequest = async () => {
        if (!request) return;

        // Validate the request
        const result = validateRequest(request);
        if (!result.valid) {
            alert(`Request validation failed: ${result.error}`);
            return;
        }

        // Open the response panel
        responsePanelRef.current?.open();

        // Serialize the request
        const serializedRequest = serializeRequest(request, serializedCookieJar);

        const controller = new AbortController();
        addLoadingResponse(request._id, controller);
        try {
            const response = await cloudAgentAPI.sendUpstreamRequest(
                serializedRequest,
                controller.signal
            );
            addSuccessResponse(request._id, response);

            // Update the cookie jar from response
            if (response.serializedCookieJar) setSerializedCookieJar(response.serializedCookieJar);
        } catch {
            addErrorResponse(request._id, "Failed to fetch request");
        }
    };

    /** Handle cancelling the request */
    const handleCancelRequest = () => {
        if (!request) return;
        cancelResponse(request._id);
    };

    // No active tab
    if (!activeTabId) {
        return <Overview />;
    }

    // Request is loading
    if (!request) {
        return (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[#FAFAFA]">
                <div className="text-sm text-gray-500">Loading request...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* Content */}
            <div className="flex min-h-0 flex-1 flex-col px-5 pt-5">
                {/* Breadcrumb */}
                <div className="mt-1 mb-4.5 flex items-center">
                    {request.breadcrumb.map((item, index, breadcrumb) => (
                        <div
                            key={index}
                            className={`text-xs ${breadcrumb.length - 1 === index ? "font-medium text-gray-700" : "font-normal text-gray-500"}`}>
                            {item}
                            {index < breadcrumb.length - 1 && (
                                <span className="mx-2 text-gray-300">{"/"}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="flex items-center space-x-3">
                    {/* URL input with HTTP method selector */}
                    <div className="w-full">
                        <DropdownMenu.Root>
                            <div className="flex items-stretch rounded-lg border border-gray-200 bg-white">
                                <DropdownMenu.Trigger asChild style={{ minWidth: 100 }}>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-between gap-2.5 rounded-l-lg border-r border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium ${METHOD_COLORS[request.method]} hover:bg-zinc-100 focus:outline-none`}>
                                        {request.method}
                                        <ChevronDown
                                            width="14"
                                            height="14"
                                            className="block shrink-0 text-gray-800"
                                        />
                                    </button>
                                </DropdownMenu.Trigger>

                                <input
                                    type="text"
                                    placeholder="Enter URL or paste text"
                                    value={request.url}
                                    onChange={(e) =>
                                        addPendingChange(request._id, { url: e.target.value })
                                    }
                                    className="w-full rounded-r-lg border-none bg-zinc-50 px-3 py-1.5 text-[12px] font-normal text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    side="bottom"
                                    align="start"
                                    sideOffset={8}
                                    className="rounded-10 min-w-40 border border-[#EBEBEB] bg-white p-1 shadow-md">
                                    <div className="px-2 py-1.5 text-[10px] font-normal text-gray-400">
                                        HTTP Methods
                                    </div>

                                    {HTTP_METHODS.map((method) => (
                                        <DropdownMenu.Item
                                            key={method}
                                            onSelect={() => {
                                                addPendingChange(request._id, { method });
                                            }}
                                            className="flex cursor-pointer items-center rounded-md px-3 py-2 outline-none data-[highlighted]:bg-[#F5F5F5] data-[highlighted]:text-blue-500">
                                            <span
                                                className={`w-6 text-xs font-medium ${METHOD_COLORS[method]}`}>
                                                {method}
                                            </span>
                                            {request.method === method && (
                                                <Check
                                                    width="14"
                                                    height="14"
                                                    className="ml-auto text-blue-500"
                                                />
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

                    {/* Send/Cancel button */}
                    <button
                        type="button"
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none ${
                            response?.loading
                                ? "bg-gray-200 hover:bg-gray-300"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        onClick={response?.loading ? handleCancelRequest : handleSendRequest}>
                        {response?.loading ? "Cancel" : "Send"}
                    </button>
                </div>

                {/* Main content */}
                <div className="mt-6 flex min-h-0 flex-1 flex-col">
                    {/* Tab list */}
                    <div
                        role="tablist"
                        tabIndex={0}
                        className="flex gap-6 border-b border-[#EBEBEB]">
                        {TAB_ITEMS.map((item, index) => (
                            <button
                                key={index}
                                role="tab"
                                type="button"
                                onClick={() => setActiveTab(item)}
                                data-state={item === activeTab ? "active" : "inactive"}
                                className="border-b-[1.5px] border-transparent px-1 pb-2 text-xs font-medium text-gray-600 capitalize select-none hover:text-gray-900 focus:outline-none data-[state=active]:border-blue-500 data-[state=active]:text-blue-500">
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="hide-scrollbar min-h-0 flex-1 overflow-auto">
                        {activeTab === "params" ? (
                            <Params
                                queryParams={request.queryParams}
                                setQueryParams={(queryParams) =>
                                    addPendingChange(request._id, { queryParams })
                                }
                            />
                        ) : activeTab === "headers" ? (
                            <Headers
                                headers={request.headers}
                                setHeaders={(headers) => addPendingChange(request._id, { headers })}
                            />
                        ) : activeTab === "body" ? (
                            <BodyEditor
                                body={request.body}
                                setBody={(body) => addPendingChange(request._id, { body })}
                            />
                        ) : (
                            <Settings />
                        )}
                    </div>
                </div>
            </div>

            {/* Response panel */}
            <ResponsePanel ref={responsePanelRef} response={response} />
        </div>
    );
};

export default RequestBuilder;
