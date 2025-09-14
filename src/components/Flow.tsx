import React, { useState, useRef } from "react";
import PipelineNode from "./PipelineNode.tsx";
import StartNode from "./StartNode.tsx";

/** Node type */
type Node = {
    id: string;
    type: "start" | "pipeline";
    position: { x: number; y: number };
    data: Record<string, any>;
};

/** Node registry to map node types to components */
const nodeRegistry: Record<Node["type"], any> = {
    start: StartNode,
    pipeline: PipelineNode
};

const Flow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [nodes, setNodes] = useState<Node[]>([
        { id: "1", type: "start", position: { x: 50, y: 50 }, data: {} },
        { id: "2", type: "pipeline", position: { x: 400, y: 100 }, data: {} }
    ]);

    const interactionRef = useRef({
        mode: "idle" as "idle" | "panning" | "dragging",
        nodeId: null as string | null,
        lastPointer: { x: 0, y: 0 }
    });

    // Handles the pointer down event to start dragging
    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        const dragHandle = target.closest(".drag-handle");
        const dragNode = target.closest(".drag-node");

        if (dragHandle && dragNode) {
            // Clicked on the drag handle of a node, start dragging the node
            event.preventDefault();

            interactionRef.current = {
                mode: "dragging",
                nodeId: dragNode.getAttribute("data-node-id"),
                lastPointer: { x: event.clientX, y: event.clientY }
            };
        } else if (!dragHandle && !dragNode) {
            // Clicked on the background, start panning
            event.preventDefault();

            interactionRef.current = {
                mode: "panning",
                nodeId: null,
                lastPointer: { x: event.clientX, y: event.clientY }
            };
        } else {
            // Clicked on a node but not on the drag handle, do nothing
            interactionRef.current = { mode: "idle", nodeId: null, lastPointer: { x: 0, y: 0 } };
        }
    };

    // Handles the pointer move event to drag nodes or pan the canvas
    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const { mode, nodeId, lastPointer } = interactionRef.current;
        if (mode === "idle") return;

        event.preventDefault();

        const dx = event.clientX - lastPointer.x;
        const dy = event.clientY - lastPointer.y;

        if (mode === "dragging" && nodeId) {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id !== nodeId) return node;

                    const newPos = { x: node.position.x + dx, y: node.position.y + dy };
                    return { ...node, position: newPos };
                })
            );
            interactionRef.current.lastPointer = { x: event.clientX, y: event.clientY };
        } else if (mode === "panning") {
            setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
            interactionRef.current.lastPointer = { x: event.clientX, y: event.clientY };
        }
    };

    // Handles the pointer up event to stop dragging or panning
    const handlePointerUp = () => {
        interactionRef.current = { mode: "idle", nodeId: null, lastPointer: { x: 0, y: 0 } };
    };

    return (
        <div
            className="h-full w-full overflow-hidden bg-[#FAFAFA]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
                backgroundImage: "radial-gradient(circle, #E6E6E6 1.25px, transparent 1.25px)",
                backgroundSize: "15px 15px",
                backgroundPosition: `${position.x}px ${position.y}px`
            }}>
            {/* Movable canvas */}
            <div
                className="relative h-full w-full"
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
                {/* Nodes */}
                {nodes.map((node) => {
                    const Component = nodeRegistry[node.type];
                    return (
                        <Component
                            key={node.id}
                            id={node.id}
                            position={node.position}
                            data={node.data}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Flow;
