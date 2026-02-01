/** Imported modules */
import Tabs from "./components/Tabs.tsx";
import RequestBuilder from "./components/RequestBuilder.tsx";
import { useEffect, useState } from "react";
import Explorer from "./components/explorer/Explorer.tsx";
import { Search, Filter } from "lucide-react";
import { collectionAPI } from "./api/collection-api.ts";
import { useCollectionStore } from "./store/collection-store.ts";
import { toast } from "sonner";

/** APIs component */
const APIs = () => {
    /** Collection store */
    const collections = useCollectionStore((state) => state.collections);
    const setCollectionNodes = useCollectionStore((state) => state.setCollectionNodes);
    const addCollectionNode = useCollectionStore((state) => state.addCollectionNode);

    /** Loading states */
    const [loading, setLoading] = useState(false);

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
                                className="h-7 w-full rounded-md border border-gray-200 py-1 pr-2 pl-7 text-[12px] focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            />
                        </div>

                        {/* Filter */}
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100">
                            <Filter size={14} />
                        </button>

                        {/* Add */}
                        <button
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                            onClick={handleAddCollection}>
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
                    <Explorer />
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
