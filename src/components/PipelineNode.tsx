import React from "react";

type NodeProps = {
    id: string;
    type: "catalog" | "pipeline" | "custom";
    position: { x: number; y: number };
};

const PipelineNode: React.FC<NodeProps> = ({ id, position }) => {
    return (
        <div
            data-node-id={id}
            style={{ top: position.y, left: position.x }}
            className="drag-node absolute rounded-xl bg-white p-4 text-sm shadow ring-1 ring-gray-200 select-none">
            <div className="drag-handle text-xs> mb-2 cursor-move rounded bg-gray-200 px-2 py-1 text-gray-600">
                Drag Handle
            </div>

            <div className="font-semibold text-green-600">⚡ Pipeline</div>
        </div>
    );
};

export default PipelineNode;
