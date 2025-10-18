/** Imported modules */
import { type FC, useRef, useState } from "react";
import type { CollectionNode, RequestNode } from "../../utils/types.ts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useCollectionStore } from "../../store/collection-store.ts";
import { useRequestStore } from "../../store/request-store.ts";
import { requestAPI } from "../../api/request-api.ts";
import { AUTO_HEADERS } from "../../utils/data.ts";
import Request from "./Request.tsx";
import Folder from "./Folder.tsx";
import { collectionAPI } from "../../api/collection-api.ts";
import { useConfirm } from "../../../../shared/overlays/ConfirmDialogProvider.tsx";
import { toast } from "sonner";
import RenameDialog, { type RenameDialogHandler } from "../../overlays/RenameDialog.tsx";

/** Collection component */
const Collection: FC<{
    nodeId: string;
    activeNodeId: string;
    setActiveNodeId: (nodeId: string) => void;
    collection: CollectionNode;
    onOpen: (node: RequestNode) => void;
}> = ({ nodeId, activeNodeId, setActiveNodeId, collection, onOpen }) => {
    /** State */
    const [expanded, setExpanded] = useState(false);

    /** Rename dialog ref */
    const renameDialogRef = useRef<RenameDialogHandler | null>(null);

    /** Confirm hook */
    const confirm = useConfirm();

    /** Collection store */
    const addRequestToCollection = useCollectionStore((state) => state.addRequestToCollection);
    const addFolder = useCollectionStore((state) => state.addFolder);
    const renameCollection = useCollectionStore((state) => state.renameCollection);
    const removeCollection = useCollectionStore((state) => state.removeCollection);

    /** Request store */
    const addRequest = useRequestStore((state) => state.addRequest);

    /** Variables */
    const collectionId = collection._id;
    const isActive = nodeId === activeNodeId;

    /** Handle add request */
    const handleAddRequest = async () => {
        const toastId = toast.loading("Creating request...");
        try {
            // Create a new request in the server
            const { request, requestNode } = await requestAPI.createRequest({
                collectionId: collectionId,
                folderId: null,
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
            addRequest(request);
            addRequestToCollection(collectionId, requestNode);

            // Select the request
            setActiveNodeId(`collection-${collectionId}-request-${requestNode._id}`);
            onOpen(requestNode);

            toast.success("Request created successfully", { id: toastId });
        } catch {
            toast.error("Failed to create request", { id: toastId });
        }
    };

    /** Handle add folder */
    const handleAddFolder = async () => {
        const toastId = toast.loading("Creating folder...");
        try {
            const folder = await collectionAPI.createFolder(collectionId, { name: "New Folder" });
            addFolder(collectionId, folder);
            toast.success("Folder created successfully", { id: toastId });
        } catch {
            toast.error("Failed to create folder", { id: toastId });
        }
    };

    /** Handle rename collection */
    const handleRenameCollection = async () => {
        if (!renameDialogRef.current) return;
        renameDialogRef.current.open({
            type: "collection",
            name: collection.name,
            onConfirm: async (newName) => {
                if (newName === null) return;

                const toastId = toast.loading("Renaming collection...");
                try {
                    await collectionAPI.renameCollection(collectionId, { newName });
                    renameCollection(collectionId, newName);
                    toast.success("Collection renamed successfully", { id: toastId });
                } catch {
                    toast.error("Failed to rename collection", { id: toastId });
                }
            }
        });
    };

    /** Handle delete collection */
    const handleDeleteCollection = async () => {
        // Confirm the collection deletion
        const confirmed = await confirm(
            "Delete Collection",
            "This action cannot be undone. Are you sure you want to delete this collection?"
        );
        if (!confirmed) return;

        const toastId = toast.loading("Deleting collection...");
        try {
            await collectionAPI.deleteCollection(collectionId);
            removeCollection(collectionId);
            toast.success("Collection deleted successfully", { id: toastId });
        } catch {
            toast.error("Failed to delete collection", { id: toastId });
        }
    };

    return (
        <>
            {/* Collection button */}
            <div
                aria-label={expanded ? "Collapse collection" : "Expand collection"}
                aria-expanded={expanded}
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
                        aria-label="Expand/collapse collection button"
                        className="block rounded-sm p-1 hover:bg-[#EBEBEB] focus:outline-none">
                        <ExpandIcon expanded={expanded} />
                    </button>

                    {/* Collection name */}
                    <span className="truncate text-xs font-normal text-gray-900">
                        {collection.name}
                    </span>
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

                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-gray-900 outline-none hover:bg-[#F5F5F5]"
                                    onSelect={handleAddFolder}>
                                    Add folder
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="m-1 h-[0.5px] w-full bg-[#EBEBEB]" />

                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-gray-900 outline-none hover:bg-[#F5F5F5]"
                                    onSelect={handleRenameCollection}>
                                    Rename
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-red-600 outline-none hover:bg-[#F5F5F5]"
                                    onSelect={handleDeleteCollection}>
                                    Delete
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

            {/* Collection children */}
            <div className={`mt-0.5 space-y-0.5 ${expanded ? "block" : "hidden"}`}>
                {collection.children.map((child) =>
                    child.type === "folder" ? (
                        <Folder
                            key={`${nodeId}-folder-${child._id}`}
                            nodeId={`${nodeId}-folder-${child._id}`}
                            activeNodeId={activeNodeId}
                            setActiveNodeId={setActiveNodeId}
                            folder={child}
                            onOpen={onOpen}
                        />
                    ) : (
                        <Request
                            key={`${nodeId}-request-${child._id}`}
                            depth={1}
                            nodeId={`${nodeId}-request-${child._id}`}
                            activeNodeId={activeNodeId}
                            setActiveNodeId={setActiveNodeId}
                            request={child}
                            onOpen={onOpen}
                        />
                    )
                )}
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

export default Collection;
