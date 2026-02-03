/** Imported modules */
import React, { type ReactNode, useMemo, useRef, useState } from "react";
import { useRequestStore } from "../store/request-store.ts";
import { useTabStore } from "../store/tab-store.ts";
import type { HttpMethod } from "../utils/types.ts";
import { METHOD_COLORS } from "../utils/data.ts";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown, Cloud, X } from "lucide-react";
import SaveDialog, { type SaveDialogRef } from "../overlays/SaveDialog.tsx";
import { useCollectionStore } from "../store/collection-store.ts";
import { requestAPI } from "../api/request-api.ts";
import { toast } from "sonner";
import { useResponseStore } from "../store/response-store.ts";

/** Tab type */
type Tab = { _id: string; name: string; method: HttpMethod; status: "synced" | "unsynced" | "new" };

/** Tabs component */
const Tabs = () => {
    /** Agent state */
    const [agent, setAgent] = useState("Cloud Agent");

    /** Save dialog ref */
    const saveDialogRef = useRef<SaveDialogRef | null>(null);

    /** Collection store */
    const getRequestNodeLocation = useCollectionStore((state) => state.getRequestNodeLocation);
    const updateRequestNode = useCollectionStore((state) => state.updateRequestNode);

    /** Tab store */
    const tabIds = useTabStore((state) => state.tabIds);
    const activeTabId = useTabStore((state) => state.activeTabId);
    const addTab = useTabStore((state) => state.addTab);
    const removeTab = useTabStore((state) => state.removeTab);
    const updateActiveTab = useTabStore((state) => state.updateActiveTab);

    /** Request store */
    const requests = useRequestStore((state) => state.requests);
    const addUntitledRequest = useRequestStore((state) => state.addUntitledRequest);
    const removeRequest = useRequestStore((state) => state.removeRequest);
    const commitPendingChanges = useRequestStore((state) => state.commitPendingChanges);

    /** Response store */
    const removeResponse = useResponseStore((state) => state.removeResponse);

    /** Map of requests for quick lookup */
    const requestMap = useMemo(
        () =>
            new Map<string, Tab>(
                requests.map((request) => {
                    const req = {
                        ...request.original,
                        ...request.pendingChanges,
                        status: request.status
                    };
                    return [
                        req._id,
                        { _id: req._id, name: req.name, method: req.method, status: req.status }
                    ];
                })
            ),
        [requests]
    );

    /** Tabs data */
    const tabs = useMemo(
        () => tabIds.map((id) => requestMap.get(id)).filter((tab) => tab !== undefined),
        [tabIds, requestMap]
    );

    /** Handle the key down event for the tab navigation */
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!tabIds.length) return;
        const activeTabIndex = tabIds.findIndex((id) => id === activeTabId);

        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = tabIds[(activeTabIndex + 1) % tabIds.length];
                if (next) updateActiveTab(next);
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = tabIds[(activeTabIndex - 1 + tabIds.length) % tabIds.length];
                if (prev) updateActiveTab(prev);
                break;
            }
            case "Delete":
                event.preventDefault();
                removeTab(activeTabId ?? "");
                removeRequest(activeTabId ?? "");
                break;
            default:
                break;
        }
    };

    /** Handle close tab */
    const handleCloseTab = async (tab: Tab) => {
        const close = () => {
            removeTab(tab._id);
            removeRequest(tab._id);
            removeResponse(tab._id);
        };

        // Close directly if there are no unsaved changes
        if (tab.status === "synced") return close();

        // Show the save dialog
        if (!saveDialogRef.current) return;
        const action = await saveDialogRef.current.open();

        if (action === "cancel") return;
        if (action === "dont_save") return close();

        // Save the request changes
        const requestId = tab._id;

        const request = requests.find((request) => request.original._id === requestId);
        if (!request) return;

        if (tab.status === "new") {
            // Implement in the future for untitled requests
        } else {
            const location = getRequestNodeLocation(requestId);
            if (!location) return;

            const toastId = toast.loading("Saving changes...");
            try {
                const updates = { ...request.pendingChanges };
                const nodeUpdates = { ...(updates.method && { method: updates.method }) };

                await requestAPI.updateRequest(requestId, { ...location, updates });
                commitPendingChanges(requestId);
                updateRequestNode(location.collectionId, requestId, nodeUpdates);

                toast.success("Changes saved successfully!", { id: toastId });
            } catch {
                toast.error("Failed to save changes", { id: toastId });
            }
        }

        close();
    };

    return (
        <div className="flex h-10 w-full shrink-0 border-b border-[#EBEBEB]">
            {/* Tabs */}
            <div className="hide-scrollbar flex h-full min-w-0 flex-1 items-center overflow-x-auto px-4">
                {/* Tab list */}
                <div
                    role="tablist"
                    onKeyDown={handleKeyDown}
                    className="h-full space-x-2.5 whitespace-nowrap select-none">
                    {tabs.map((tab, index) => {
                        const isActive = tab._id === activeTabId;
                        return (
                            <div
                                key={index}
                                aria-label={tab.name}
                                aria-selected={isActive}
                                className={`group inline-flex h-full items-center border-b-[1.5px] transition-colors ${
                                    isActive ? "border-blue-500" : "border-transparent"
                                }`}>
                                {/* Tab button */}
                                <button
                                    role="tab"
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => updateActiveTab(tab._id)}
                                    className={`flex max-w-36 items-center gap-2 p-2 focus:outline-none`}>
                                    <span
                                        className={`text-[11px] font-medium ${METHOD_COLORS[tab.method]}`}>
                                        {tab.method.length > 4
                                            ? tab.method.slice(0, 3)
                                            : tab.method}
                                    </span>

                                    <span className="truncate text-xs font-normal text-gray-700">
                                        {tab.name}
                                    </span>
                                </button>

                                <div className="relative flex h-full w-6 items-center justify-center">
                                    {/* Status dot */}
                                    {(tab.status === "unsynced" || tab.status === "new") && (
                                        <div
                                            aria-label={
                                                tab.status === "new"
                                                    ? "New changes"
                                                    : "Unsynced changes"
                                            }
                                            className="absolute h-1.25 w-1.25 shrink-0 rounded-full bg-blue-500 opacity-100 transition-opacity group-hover:opacity-0"
                                        />
                                    )}

                                    {/* Close button */}
                                    <button
                                        aria-label="Close tab button"
                                        onClick={() => handleCloseTab(tab)}
                                        className="absolute p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                {tabs.length > 0 && <div className="mx-3 h-5 w-px shrink-0 bg-[#EBEBEB]" />}

                {/* Add tab button */}
                <button
                    type="button"
                    aria-label="Add tab"
                    onClick={() => {
                        const request = addUntitledRequest();
                        addTab(request._id);
                    }}
                    className="shrink-0 rounded-md p-1 text-gray-700 hover:bg-[#F5F5F5]">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 5V19M5 12H19"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Request agent dropdown menu */}
            <div className="flex h-full shrink-0 items-center border-l border-[#EBEBEB] px-2">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            aria-label="Select request agent"
                            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-900 transition-colors outline-none hover:bg-[#F5F5F5]">
                            <span>{agent}</span>
                            <ChevronDown
                                width="14"
                                height="14"
                                className="text-gray-500 transition-transform group-data-[state=open]:rotate-180"
                            />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="end"
                            sideOffset={8}
                            className="animate-in fade-in slide-in-from-top-2 min-w-[220px] rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-lg ring-1 ring-gray-200/40 backdrop-blur-md">
                            {/* Cloud agent option */}
                            <DropdownMenu.Item
                                onSelect={() => setAgent("Cloud Agent")}
                                className="flex w-full cursor-pointer flex-col gap-2 rounded-xl px-3 py-3 text-sm text-gray-700 transition-all hover:bg-gray-50 focus:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Cloud className="h-4 w-4 text-blue-500" />
                                        <span className="font-medium">Cloud Agent</span>
                                    </div>
                                    {agent === "Cloud Agent" && (
                                        <Check className="h-4 w-4 text-blue-500" />
                                    )}
                                </div>

                                <div className="mt-1 space-y-1 text-xs text-gray-500">
                                    <FeatureItem label="No CORS limit" available />
                                    <FeatureItem label="Local support" available={false} />
                                    <FeatureItem label="No download needed" available />
                                </div>
                            </DropdownMenu.Item>

                            {/* Local agent option */}
                            {/*<DropdownMenu.Item*/}
                            {/*    onSelect={() => setAgent("Local Agent")}*/}
                            {/*    className="flex w-full cursor-pointer flex-col gap-2 rounded-xl px-3 py-3 text-sm text-gray-700 transition-all hover:bg-gray-50 focus:bg-gray-50">*/}
                            {/*    <div className="flex items-center justify-between">*/}
                            {/*        <div className="flex items-center gap-2">*/}
                            {/*            <HardDrive className="h-4 w-4 text-gray-500" />*/}
                            {/*            <span className="font-medium">Local Agent</span>*/}
                            {/*        </div>*/}
                            {/*        {agent === "Local Agent" && (*/}
                            {/*            <Check className="h-4 w-4 text-gray-500" />*/}
                            {/*        )}*/}
                            {/*    </div>*/}

                            {/*    <div className="mt-1 space-y-1 text-xs text-gray-500">*/}
                            {/*        <FeatureItem label="No CORS limit" available />*/}
                            {/*        <FeatureItem label="Local support" available />*/}
                            {/*        <FeatureItem*/}
                            {/*            label="Download required"*/}
                            {/*            icon={<Download className="h-3.5 w-3.5 text-gray-500" />}*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</DropdownMenu.Item>*/}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* Save Dialog */}
            <SaveDialog ref={saveDialogRef} />
        </div>
    );
};

function FeatureItem({
    label,
    available,
    icon
}: {
    label: string;
    available?: boolean;
    icon?: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between pl-6">
            <span>{label}</span>
            {icon ? (
                icon
            ) : available ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
                <X className="h-3.5 w-3.5 text-rose-400" />
            )}
        </div>
    );
}

export default Tabs;
