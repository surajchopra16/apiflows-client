/** Imported modules */
import { useState } from "react";
import { useCollectionStore } from "../../store/collection-store.ts";
import Collection from "./Collection.tsx";

/** Explorer component */
const Explorer = () => {
    /** Collection store */
    const collections = useCollectionStore((state) => state.collections);

    /** Active node ID state */
    const [activeNodeId, setActiveNodeId] = useState<string>("");

    return (
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300/40 hover:scrollbar-thumb-zinc-400 h-full space-y-0.5 overflow-y-auto p-2">
            {collections.map((collection) => (
                <Collection
                    key={`collection-${collection._id}`}
                    nodeId={`collection-${collection._id}`}
                    activeNodeId={activeNodeId}
                    setActiveNodeId={setActiveNodeId}
                    collection={collection}
                />
            ))}
        </div>
    );
};

export default Explorer;
