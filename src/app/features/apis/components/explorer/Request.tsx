/** Imported modules */
import { type FC, useRef } from "react";
import type { RequestNode } from "../../utils/types.ts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { METHOD_COLORS } from "../../utils/data.ts";
import RenameDialog, { type RenameDialogRef } from "../../overlays/RenameDialog.tsx";
import { useAlertDialog } from "../../../../shared/overlays/AlertDialogProvider.tsx";
import { useTabStore } from "../../store/tab-store.ts";
import { requestAPI } from "../../api/request-api.ts";
import { toast } from "sonner";
import { useCollectionStore } from "../../store/collection-store.ts";
import { useRequestStore } from "../../store/request-store.ts";
import { useResponseStore } from "../../store/response-store.ts";

/** Request component */
const Request: FC<{
    depth: number;
    nodeId: string;
    activeNodeId: string;
    setActiveNodeId: (nodeId: string) => void;
    request: RequestNode;
}> = ({ depth, nodeId, activeNodeId, setActiveNodeId, request }) => {
    /** Rename dialog ref */
    const renameDialogRef = useRef<RenameDialogRef | null>(null);

    /** Alert dialog */
    const alertDialog = useAlertDialog();

    /** Collection store */
    const updateRequestNode = useCollectionStore((state) => state.updateRequestNode);
    const removeRequestNode = useCollectionStore((state) => state.removeRequestNode);

    /** Tab store */
    const addTab = useTabStore((state) => state.addTab);
    const removeTab = useTabStore((state) => state.removeTab);

    /** Request store */
    const renameRequest = useRequestStore((state) => state.renameRequest);
    const removeRequest = useRequestStore((state) => state.removeRequest);

    /** Response store */
    const removeResponse = useResponseStore((state) => state.removeResponse);

    /** Variables */
    const collectionId = nodeId.split("-")[1];
    const folderId = nodeId.split("-")[2] === "folder" ? nodeId.split("-")[3] : null;
    const method = request.method.toUpperCase();
    const isActive = nodeId === activeNodeId;

    /** Handle on click */
    const handleOnClick = () => {
        setActiveNodeId(nodeId);
        addTab(request._id);
    };

    /** Handle the rename request */
    const handleRenameRequest = async () => {
        if (!renameDialogRef.current) return;
        const newName = await renameDialogRef.current.open({ type: "request", name: request.name });
        if (newName === null) return;

        const toastId = toast.loading("Renaming request...");
        try {
            await requestAPI.updateRequest(request._id, {
                collectionId,
                folderId,
                updates: { name: newName }
            });
            updateRequestNode(collectionId, request._id, { name: newName });
            renameRequest(request._id, newName);

            toast.success("Request renamed successfully", { id: toastId });
        } catch {
            toast.error("Failed to rename request", { id: toastId });
        }
    };

    /** Handle the delete request */
    const handleDeleteRequest = async () => {
        // Confirm the request deletion
        const confirmed = await alertDialog({
            title: "Delete Request",
            message: "This action cannot be undone. Are you sure you want to delete this request?",
            cancelText: "Cancel",
            confirmText: "Delete"
        });
        if (!confirmed) return;

        const toastId = toast.loading("Deleting request...");
        try {
            await requestAPI.deleteRequest(request._id, { collectionId, folderId });
            removeRequestNode(collectionId, request._id);
            removeTab(request._id);
            removeRequest(request._id);
            removeResponse(request._id);

            toast.success("Request deleted successfully", { id: toastId });
        } catch {
            toast.error("Failed to delete request", { id: toastId });
        }
    };

    return (
        <>
            {/* Request node */}
            <div
                aria-label="Request node"
                style={{ paddingLeft: depth * 28 }}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-md px-1.75 py-1.25 select-none ${
                    isActive ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                }`}
                onClick={handleOnClick}>
                <div className="flex items-center gap-2">
                    {/* HTTP method */}
                    <span className={`text-xs font-medium ${METHOD_COLORS[method]}`}>
                        {method.length > 4 ? method.slice(0, 3) : method}
                    </span>

                    {/* Request name */}
                    <div className="truncate text-xs font-normal text-gray-900">{request.name}</div>
                </div>

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
                                onSelect={handleRenameRequest}>
                                Rename
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                                className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-normal text-red-600 outline-none hover:bg-[#F5F5F5]"
                                onSelect={handleDeleteRequest}>
                                Delete
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* Rename dialog */}
            <RenameDialog ref={renameDialogRef} />
        </>
    );
};

export default Request;
