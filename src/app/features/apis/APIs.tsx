/** Imported modules */
import Tabs from "./components/Tabs.tsx";
import RequestBuilder from "./components/RequestBuilder.tsx";
import { useEffect, useState } from "react";
import Explorer from "./components/explorer/Explorer.tsx";
import { Search } from "lucide-react";
import { collectionAPI } from "./api/collection-api.ts";
import { useCollectionStore } from "./store/collection-store.ts";
import { toast } from "sonner";
import type { CollectionNode, FolderNode, RequestNode } from "./utils/types.ts";

/** APIs component */
const APIs = () => {
    /** Collection store */
    const collections = useCollectionStore((state) => state.collections);
    const setCollectionNodes = useCollectionStore((state) => state.setCollectionNodes);
    const addCollectionNode = useCollectionStore((state) => state.addCollectionNode);

    /** States */
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    /** Filtered collections */
    const filteredCollections = (() => {
        // If no search query, return all collections
        if (!searchQuery.trim()) return collections;

        const query = searchQuery.toLowerCase();

        /** Filters the request */
        const filterRequest = (request: RequestNode) => request.name.toLowerCase().includes(query);

        /** Filters the folder */
        const filterFolder = (folder: FolderNode, parentMatch: boolean) => {
            // Check if this folder matches the query
            const nameMatch = folder.name.toLowerCase().includes(query);
            if (parentMatch || nameMatch) return folder;

            // Otherwise, filter the children requests and folders
            const filteredRequests = folder.children.filter((req) => filterRequest(req));
            if (filteredRequests.length > 0) return { ...folder, children: filteredRequests };

            return null;
        };

        return collections
            .map((collection) => {
                // Check if the collection name matches the query
                const nameMatch = collection.name.toLowerCase().includes(query);
                if (nameMatch) return collection;

                // Otherwise, filter the children folders and requests
                const filteredChildren = collection.children
                    .map((child) => {
                        if (child.type === "request") return filterRequest(child) ? child : null;
                        else return filterFolder(child, nameMatch);
                    })
                    .filter(Boolean) as (FolderNode | RequestNode)[];
                if (filteredChildren.length > 0)
                    return { ...collection, children: filteredChildren };

                return null;
            })
            .filter(Boolean) as CollectionNode[];
    })();

    /** Handle get collections */
    const handleGetCollections = async () => {
        try {
            const collections = await collectionAPI.getCollections();
            setCollectionNodes(collections);
        } catch {
            toast.error("Failed to fetch collections");
        } finally {
            setLoading(false);
        }
    };

    /** Fetch all the collections */
    useEffect(() => {
        if (collections.length > 0) return;

        setLoading(true);
        handleGetCollections().then();
    }, []);

    /** Handle add collection */
    const handleAddCollection = async () => {
        if (loading) return;

        const toastId = toast.loading("Adding collection...");
        try {
            const collection = await collectionAPI.createCollection({ name: "New Collection" });
            addCollectionNode(collection);
            toast.success("Collection added successfully", { id: toastId });
        } catch {
            toast.error("Failed to add collection", { id: toastId });
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden rounded-xl bg-white ring ring-[#EBEBEB]">
            {/* Sidebar */}
            <div className="w-64 border-r border-[#EBEBEB] pt-4">
                {/* Header */}
                <div className="mb-1 space-y-3 px-4">
                    <h1 className="text-sm font-semibold text-gray-700">APIs</h1>

                    <div className="flex items-center gap-1.5">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search
                                className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
                                size={14}
                            />

                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-7 w-full rounded-md border border-gray-200 py-1 pr-2 pl-7 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>

                        {/* Add */}
                        <button
                            onClick={handleAddCollection}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                            <svg
                                width="16"
                                height="16"
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
                </div>

                {/* Collection explorer */}
                {loading ? (
                    <div className="px-4.5 py-4 text-xs font-normal text-gray-500">
                        Loading collections...
                    </div>
                ) : (
                    <Explorer collections={filteredCollections} />
                )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Tabs list */}
                <Tabs />

                {/* Request builder */}
                <RequestBuilder />

                {/* Bottom bar */}
                <div className="z-10 h-8 w-full shrink-0 border-t border-[#EBEBEB] bg-white p-3"></div>
            </div>
        </div>
    );
};

export default APIs;
