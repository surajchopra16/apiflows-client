/** Imported modules */
import { type FC, useRef, useState } from "react";
import type { FolderNode } from "../../utils/types.ts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Request from "./Request.tsx";
import { useAlertDialog } from "../../../../shared/overlays/AlertDialogProvider.tsx";
import { toast } from "sonner";
import { collectionAPI } from "../../api/collection-api.ts";
import { useCollectionStore } from "../../store/collection-store.ts";
import { requestAPI } from "../../api/request-api.ts";
import { AUTO_HEADERS } from "../../utils/data.ts";
import { useRequestStore } from "../../store/request-store.ts";
import RenameDialog, { type RenameDialogRef } from "../../overlays/RenameDialog.tsx";
import { useTabStore } from "../../store/tab-store.ts";
import { useResponseStore } from "../../store/response-store.ts";

/** Folder component */
const Folder: FC<{
    nodeId: string;
    activeNodeId: string;
    setActiveNodeId: (nodeId: string) => void;
    folder: FolderNode;
}> = ({ nodeId, activeNodeId, setActiveNodeId, folder }) => {
    /** State */
    const [expanded, setExpanded] = useState(false);

    /** Rename dialog ref */
    const renameDialogRef = useRef<RenameDialogRef | null>(null);

    /** Alert dialog */
    const alertDialog = useAlertDialog();

    /** Collection store */
    const addRequestNode = useCollectionStore((state) => state.addRequestNode);
    const renameFolderNode = useCollectionStore((state) => state.renameFolderNode);
    const removeFolderNode = useCollectionStore((state) => state.removeFolderNode);

    /** Tab store */
    const addTab = useTabStore((state) => state.addTab);
    const removeTabs = useTabStore((state) => state.removeTabs);

    /** Request store */
    const addRequest = useRequestStore((state) => state.addRequest);
    const removeRequests = useRequestStore((state) => state.removeRequests);

    /** Response store */
    const removeResponses = useResponseStore((state) => state.removeResponses);

    /** Variables */
    const collectionId = nodeId.split("-")[1];
    const folderId = folder._id;
    const isActive = nodeId === activeNodeId;

    /** Handle add request */
    const handleAddRequest = async () => {
        const toastId = toast.loading("Creating request...");
        try {
            // Create a new request in the server
            const { request, requestNode } = await requestAPI.createRequest({
                collectionId: collectionId,
                folderId: folderId,
                request: {
                    name: "New Request",
                    method: "GET" as const,
                    url: "",
                    queryParams: [{ enabled: false, key: "", value: "", description: "" }],
                    headers: [
                        ...AUTO_HEADERS,
                        { enabled: false, key: "", value: "", description: "", auto: false }
                    ],
                    body: { type: "none" as const, value: "" }
                }
            });
            addRequestNode(collectionId, folderId, requestNode);
            addRequest(request);
            addTab(request._id);
            setActiveNodeId(`collection-${collectionId}-folder-${folderId}-request-${request._id}`);

            toast.success("Request created successfully", { id: toastId });
        } catch {
            toast.error("Failed to create request", { id: toastId });
        }
    };

    /** Handle rename folder */
    const handleRenameFolder = async () => {
        if (!renameDialogRef.current) return;

        const newName = await renameDialogRef.current.open({ type: "folder", name: folder.name });
        if (newName === null) return;

        const toastId = toast.loading("Renaming folder...");
        try {
            await collectionAPI.renameFolder(collectionId, folder._id, { newName });
            renameFolderNode(collectionId, folder._id, newName);

            toast.success("Folder renamed successfully", { id: toastId });
        } catch {
            toast.error("Failed to rename folder", { id: toastId });
        }
    };

    /** Handle delete folder */
    const handleDeleteFolder = async () => {
        // Confirm the folder deletion
        const confirmed = await alertDialog({
            title: "Delete Folder",
            message: "This action cannot be undone. Are you sure you want to delete this folder?",
            cancelText: "Cancel",
            confirmText: "Delete"
        });
        if (!confirmed) return;

        const toastId = toast.loading("Deleting folder...");
        try {
            const requestIds = await collectionAPI.deleteFolder(collectionId, folder._id);
            removeFolderNode(collectionId, folder._id);
            removeTabs(requestIds);
            removeRequests(requestIds);
            removeResponses(requestIds);

            toast.success("Folder deleted successfully", { id: toastId });
        } catch {
            toast.error("Failed to delete folder", { id: toastId });
        }
    };

    return (
        <>
            {/* Folder node */}
            <div
                aria-label={expanded ? "Collapse folder" : "Expand folder"}
                aria-expanded={expanded}
                style={{ paddingLeft: 23 }}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-1.75 py-1.25 select-none ${
                    isActive ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                }`}
                onClick={() => {
                    setExpanded((expanded) => !expanded);
                    setActiveNodeId(nodeId);
                }}>
                <div className="flex items-center gap-1">
                    {/* Expand/collapse button */}
                    <button
                        type="button"
                        aria-label="Expand/collapse folder button"
                        className="block rounded-sm p-1 hover:bg-[#EBEBEB] focus:outline-none">
                        <ExpandIcon expanded={expanded} />
                    </button>

                    {/* Folder icon and name */}
                    <div className="flex items-center gap-1.5">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="shrink-0 text-gray-700">
                            <path
                                d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>

                        <div className="truncate text-xs font-normal text-gray-900">
                            {folder.name}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Add request button */}
                    <button
                        type="button"
                        aria-label="Add request"
                        className={`block rounded-sm p-0.75 opacity-0 hover:bg-[#EBEBEB] focus:outline-none ${
                            isActive ? "opacity-100" : "group-hover:opacity-100"
                        }`}
                        onClick={(event) => {
                            event.stopPropagation();
                            setActiveNodeId(nodeId);
                            handleAddRequest().then();
                        }}>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-700">
                            <path
                                d="M12 5V19M5 12H19"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    <DropdownMenu.Root onOpenChange={(open) => open && setActiveNodeId(nodeId)}>
                        <DropdownMenu.Trigger asChild>
                            <button
                                type="button"
                                aria-label="More options"
                                className={`block rounded-sm p-0.75 opacity-0 hover:bg-[#EBEBEB] focus:outline-none ${
                                    isActive ? "opacity-100" : "group-hover:opacity-100"
                                }`}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-700">
                                    <path
                                        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                side="bottom"
                                sideOffset={8}
                                align="start"
                                className="rounded-10 min-w-36 border border-[#EBEBEB] bg-white p-1.5 shadow-lg"
                                onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-gray-900 outline-none hover:bg-[#F5F5F5]"
                                    onSelect={handleAddRequest}>
                                    Add request
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="m-1 h-[0.5px] bg-[#EBEBEB]" />

                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-gray-900 outline-none hover:bg-[#F5F5F5]"
                                    onSelect={handleRenameFolder}>
                                    Rename
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-red-600 outline-none hover:bg-[#F5F5F5]"
                                    onSelect={handleDeleteFolder}>
                                    Delete
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

            {/* Folder children */}
            <div className={`mt-0.5 space-y-0.5 ${expanded ? "block" : "hidden"}`}>
                {folder.children.map((child) => (
                    <Request
                        key={`${nodeId}-request-${child._id}`}
                        depth={1.75}
                        nodeId={`${nodeId}-request-${child._id}`}
                        activeNodeId={activeNodeId}
                        setActiveNodeId={setActiveNodeId}
                        request={child}
                    />
                ))}
            </div>

            {/* Rename dialog */}
            <RenameDialog ref={renameDialogRef} />
        </>
    );
};

/** Expand icon component */
const ExpandIcon: FC<{ expanded: boolean }> = ({ expanded }) => (
    <svg
        width="12"
        height="12"
        className={`shrink-0 text-gray-700 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path d="M7 5l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default Folder;
