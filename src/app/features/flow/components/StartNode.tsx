/** Imported modules */
import type { NodeProps, NodeSpec } from "../utils/types.ts";
import type { FC } from "react";

/** Props type */
type Props = NodeProps<Record<string, never>>;

/** Start node component */
const StartNode: FC<Props> = () => {
    return (
        <div className="rounded-10 relative w-64 bg-white">
            {/* Drag handle */}
            <div className="drag-handle rounded-t-10 cursor-grab bg-[#F5F5F5] px-3.25 py-2.25">
                <h2 className="text-xs font-medium text-gray-800">Start</h2>
            </div>

            {/* Content */}
            <div className="relative p-3.5">
                {/* Description */}
                <h3 className="text-xs font-normal text-gray-400">
                    Starting node for the workflow
                </h3>

                {/* Output port */}
                <div
                    aria-label="Start output port"
                    data-output-port-id={"start"}
                    className="output-port absolute top-1/2 right-[-6px] z-10 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-sm ring-1 ring-[#E6E6E6]"
                />
            </div>
        </div>
    );
};

/** Start node specification */
const startNodeSpec: NodeSpec = {
    type: "start",
    inputs: [],
    outputs: ["start"],
    execute: async () => {
        // The start node does not perform any action
        return { start: null };
    }
};

export { StartNode, startNodeSpec };
