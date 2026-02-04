/** Imported modules */
import { type FC, useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { collectionAPI } from "../../apis/api/collection-api.ts";
import { METHOD_COLORS } from "../../apis/utils/data.ts";
import type { CollectionNode, FolderNode, RequestNode } from "../../apis/utils/types.ts";
import type { NodeProps, NodeSpec } from "../utils/types.ts";
import { requestAPI } from "../../apis/api/request-api.ts";
import { serializeRequest } from "../../apis/utils/request-serializer.ts";
import { cloudAgentAPI } from "../../apis/api/cloud-agent-api.ts";

/** Parameters type */
type Parameters = { name: string; method: string; requestId: string | null };

/** Props type */
type Props = NodeProps<Parameters>;

/** Node type */
type Node = CollectionNode | FolderNode | RequestNode;

/** Breadcrumb type */
type Breadcrumb = { name: string; children: Node[] };

/** HTTP request node component */
const HttpRequestNode: FC<Props> = ({ parameters, setParameters }) => {
    const [open, setOpen] = useState(false);

    const [collections, setCollections] = useState<CollectionNode[]>([]);

    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [currentNodes, setCurrentNodes] = useState<Node[]>([]);

    const [loading, _setLoading] = useState(false);

    // Fetch collections once
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const data = await collectionAPI.getCollections();
                setCollections(data);
                setCurrentNodes(data);
                setBreadcrumbs([{ name: "Collections", children: data }]);
            } catch (error) {
                console.error("Failed to fetch collections:", error);
            }
        };
        fetchCollections();
    }, []);

    // Reset dropdown when opened
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setCurrentNodes(collections);
            setBreadcrumbs([{ name: "Collections", children: collections }]);
        }
    };

    // Handle the breadcrumb
    const handleBreadcrumb = (breadcrumb: Breadcrumb, index: number) => {
        setCurrentNodes(breadcrumb.children);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    // Handle the selection
    const handleSelection = async (node: CollectionNode | FolderNode | RequestNode) => {
        if (node.type === "collection" || node.type === "folder") {
            setCurrentNodes(node.children);
            setBreadcrumbs((prev) => [...prev, { name: node.name, children: node.children }]);
            return;
        }

        setParameters({ name: node.name, method: node.method, requestId: node._id });
        setOpen(false);
    };

    const truncate = (text: string, maxLength: number = 20) =>
        text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    return (
        <div className="rounded-10 relative w-80 bg-white">
            {/* Drag handle */}
            <div className="drag-handle rounded-t-10 cursor-grab bg-[#F5F5F5] px-3.25 py-2.25">
                <h2 className="text-xs font-medium text-gray-800">HTTP Request</h2>
            </div>

            {/* Content */}
            <div className="p-3.5">
                {/* Dropdown */}
                <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            className="flex w-full items-center justify-start rounded-md px-3 py-2 text-xs text-gray-500 ring-1 ring-[#EBEBEB] outline-none hover:bg-[#FAFAFA]">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>
                                    Loading...
                                </span>
                            ) : parameters.requestId ? (
                                <span className="flex items-center gap-2">
                                    <span
                                        className={`font-medium ${METHOD_COLORS[parameters.method]}`}>
                                        {parameters.method}
                                    </span>
                                    <span className="text-gray-700">
                                        {truncate(parameters.name)}
                                    </span>
                                </span>
                            ) : (
                                "Find the HTTP request"
                            )}
                        </button>
                    </DropdownMenu.Trigger>

                    {/* Content */}
                    <DropdownMenu.Content
                        side="bottom"
                        sideOffset={8}
                        align="start"
                        className="rounded-10 relative z-50 w-73 bg-white p-1.5 shadow-md ring-1 ring-[#EBEBEB]">
                        <div className="max-h-80 space-y-1 overflow-y-auto">
                            {/* Breadcrumb */}
                            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-3 py-2 text-xs">
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <span key={index} className="flex items-center gap-1">
                                        {index > 0 && <span className="text-gray-400">/</span>}
                                        <button
                                            onClick={() => handleBreadcrumb(breadcrumb, index)}
                                            className={`text-xs ${
                                                index === breadcrumbs.length - 1
                                                    ? "font-medium text-gray-900"
                                                    : "text-gray-500 hover:text-gray-900"
                                            }`}>
                                            {truncate(breadcrumb.name, 18)}
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* Current nodes */}
                            {currentNodes.length === 0 ? (
                                <div className="px-5 py-10 text-center text-xs font-normal text-gray-500">
                                    No items found
                                </div>
                            ) : (
                                currentNodes.map((node) => (
                                    <button
                                        key={node._id}
                                        type="button"
                                        aria-label={`Select ${node.name}`}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-[#F5F5F5]"
                                        onClick={() => handleSelection(node)}>
                                        {/* Icon */}
                                        {node.type === "collection" && (
                                            <span className="text-xs">📁</span>
                                        )}
                                        {node.type === "folder" && (
                                            <span className="text-xs">📂</span>
                                        )}
                                        {node.type === "request" && (
                                            <span
                                                className={`text-xs font-medium ${METHOD_COLORS[node.method]}`}>
                                                {node.method}
                                            </span>
                                        )}

                                        {/* Name */}
                                        <span className="text-xs font-normal text-gray-700">
                                            {node.name}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>

            {/* Ports */}
            <div className="flex items-center justify-between px-3 pt-2 pb-5">
                {/* Input port */}
                <div className="relative flex items-center">
                    <div className="text-xs font-normal text-gray-500">Send</div>
                    <div
                        aria-label="Send input port"
                        data-input-port-id={"send"}
                        className="input-port absolute top-1/2 left-[-18px] z-10 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-sm ring-1 ring-[#E6E6E6]"
                    />
                </div>

                {/* Output ports */}
                <div className="space-y-2 text-right">
                    <div className="relative flex items-center justify-end">
                        <div className="text-xs font-normal text-gray-500">Success</div>
                        <div
                            aria-label="Success output port"
                            data-output-port-id={"success"}
                            className="output-port absolute top-1/2 right-[-18px] z-10 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-sm ring-1 ring-[#E6E6E6]"
                        />
                    </div>

                    <div className="relative flex items-center justify-end">
                        <div className="text-xs font-normal text-gray-500">Fail</div>
                        <div
                            aria-label="Fail output port"
                            data-output-port-id={"fail"}
                            className="output-port absolute top-1/2 right-[-18px] z-10 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-sm ring-1 ring-[#E6E6E6]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

/** HTTP request node specification */
const httpRequestNodeSpec: NodeSpec = {
    type: "http-request",
    inputs: ["send"],
    outputs: ["success", "fail"],
    execute: async (context) => {
        const requestId = context.getNodeParameter("requestId");
        if (!requestId) throw new Error("No HTTP request selected");

        try {
            // Fetch the request
            const request = await requestAPI.getRequest(requestId);

            // Get the cookie jar from localStorage
            const serializedCookieJar = localStorage.getItem("apiflows_cookie_jar") || "";

            // Send the request using the cloud agent
            const serializedRequest = serializeRequest(request, serializedCookieJar);
            const response = await cloudAgentAPI.sendUpstreamRequest(serializedRequest);

            // Update the cookie jar in localStorage
            if (response.serializedCookieJar)
                localStorage.setItem("apiflows_cookie_jar", response.serializedCookieJar);

            if (response.statusCode >= 400 && response.statusCode < 600)
                return { fail: { error: `HTTP ${response.statusCode} Error` } };

            return { success: { response } };
        } catch (err) {
            return { fail: { error: (err as Error).message } };
        }
    }
};

export { HttpRequestNode, httpRequestNodeSpec };
