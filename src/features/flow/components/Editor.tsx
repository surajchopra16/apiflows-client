/** Imported modules */
import React, { useState, useRef, useLayoutEffect } from "react";
import { Plus, ZoomIn, ZoomOut, MoveHorizontal, Play } from "lucide-react";
import type { Connector, Node } from "../utils/types.ts";
import { StartNode } from "./StartNode.tsx";
import { HttpRequestNode } from "./HttpRequestNode.tsx";
import { createWorkflowJSON, runner } from "../utils/runner.ts";

/** Node component registry */
const nodeComponentRegistry: Record<string, React.FC<any>> = {
    "start": StartNode,
    "http-request": HttpRequestNode
};

/** Editor component */
const Editor = () => {
    /** Canvas position and scale */
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    /** Nodes */
    const [nodes, setNodes] = useState<Node[]>([
        { id: "1", type: "start", position: { x: 0, y: 300 }, parameters: {} },
        {
            id: "2",
            type: "http-request",
            position: { x: 500, y: 100 },
            parameters: { name: "", method: "", requestId: null }
        },
        {
            id: "3",
            type: "http-request",
            position: { x: 500, y: 400 },
            parameters: { name: "", method: "", requestId: null }
        },
        {
            id: "4",
            type: "http-request",
            position: { x: 1000, y: 100 },
            parameters: { name: "", method: "", requestId: null }
        },
        {
            id: "5",
            type: "http-request",
            position: { x: 1000, y: 400 },
            parameters: { name: "", method: "", requestId: null }
        }
    ]);

    /** Connectors */
    const [connectors, setConnectors] = useState<Connector[]>([
        {
            id: "1:start->2:send",
            source: "1",
            sourcePort: "start",
            target: "2",
            targetPort: "send"
        },
        {
            id: "1:start->3:send",
            source: "1",
            sourcePort: "start",
            target: "3",
            targetPort: "send"
        },
        {
            id: "2:success->4:send",
            source: "2",
            sourcePort: "success",
            target: "4",
            targetPort: "send"
        },
        {
            id: "2:fail->5:send",
            source: "2",
            sourcePort: "fail",
            target: "5",
            targetPort: "send"
        }
    ]);

    /** Node execution status */
    const [nodeStatus, setNodeStatus] = useState<
        Record<string, "running" | "completed" | "failed">
    >({});

    /** Refs */
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const tempConnectorRef = useRef<SVGPathElement>(null);

    /** Update connectors on scale change */
    useLayoutEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        connectors.forEach((connector) => {
            const connectorElement = svg.querySelector(
                `[data-connector-id="${connector.id}"] path`
            );
            if (!connectorElement) return;

            const sourcePos = getPortPosition("output", connector.source, connector.sourcePort);
            const targetPos = getPortPosition("input", connector.target, connector.targetPort);
            const { d } = getConnectorGeometry(sourcePos, targetPos);

            connectorElement.setAttribute("d", d);
        });
    }, [scale, position]);

    /** Handle the zooming out of the canvas */
    const handleZoomOut = () => {
        setScale((prev) => Math.max(0.75, prev - 0.05));
    };

    /** Handle the zooming in of the canvas */
    const handleZoomIn = () => {
        setScale((prev) => Math.min(1.25, prev + 0.05));
    };

    /** Handle fitting the view to the nodes */
    const handleFitView = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Calculate the bounding box
        const padding = 50;
        const minX = Math.min(...nodes.map((n) => n.position.x)) - padding;
        const minY = Math.min(...nodes.map((n) => n.position.y)) - padding;
        const maxX = Math.max(...nodes.map((n) => n.position.x + 250)) + padding;
        const maxY = Math.max(...nodes.map((n) => n.position.y + 150)) + padding;

        const boundingBoxWidth = Math.max(1, maxX - minX);
        const boundingBoxHeight = Math.max(1, maxY - minY);

        // Calculate the new scale
        const scaleX = canvas.clientWidth / boundingBoxWidth;
        const scaleY = canvas.clientHeight / boundingBoxHeight;
        const newScale = Math.min(1, Math.max(0.75, Math.min(scaleX, scaleY)));

        // Calculate the new position
        const newPosition = {
            x: canvas.clientWidth / 2 - (minX + boundingBoxWidth / 2) * newScale,
            y: canvas.clientHeight / 2 - (minY + boundingBoxHeight / 2) * newScale
        };

        setScale(newScale);
        setPosition(newPosition);
    };

    /** Handle running the workflow */
    const handleRun = async () => {
        setNodeStatus({});

        const workflow = createWorkflowJSON("Untitled Workflow", nodes, connectors);
        await runner(workflow, (data) => {
            console.log("Node Status Change:", data);
            setNodeStatus((prev) => ({ ...prev, [data.nodeId]: data.status }));
        });
    };

    /** Convert the screen coordinates to canvas coordinates */
    const convertToCanvasPosition = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const canvasRect = canvas.getBoundingClientRect();
        return {
            x: (x - canvasRect.left - position.x) / scale,
            y: (y - canvasRect.top - position.y) / scale
        };
    };

    /** Get the element position relative to the canvas */
    const getElementPosition = (element: Element) => {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        return convertToCanvasPosition(x, y);
    };

    /** Get the port position relative to the canvas */
    const getPortPosition = (type: "input" | "output", nodeId: string, portId: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const node = canvas.querySelector(`[data-node-id="${nodeId}"]`);
        if (!node) return { x: 0, y: 0 };

        const cls = type === "input" ? "input-port" : "output-port";
        const port = node.querySelector(`.${cls}[data-${type}-port-id="${portId}"]`) || node;

        return getElementPosition(port);
    };

    /** Get the connector geometry (Bézier curve) */
    const getConnectorGeometry = (
        source: { x: number; y: number },
        target: { x: number; y: number }
    ) => {
        const midX = (source.x + target.x) / 2;

        const c1 = { x: midX, y: source.y };
        const c2 = { x: midX, y: target.y };

        const d = `M ${source.x},${source.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${target.x},${target.y}`;
        const mid = { x: midX, y: (source.y + target.y) / 2 };

        return { d, mid };
    };

    /** Handle the linking of connectors */
    const handleConnectorLink = (
        event: React.PointerEvent<HTMLDivElement>,
        sourceNode: HTMLElement,
        outputPort: Element
    ) => {
        event.preventDefault();
        const controller = new AbortController();

        const sourceNodeId = sourceNode.getAttribute("data-node-id");
        const outputPortId = outputPort.getAttribute("data-output-port-id");
        if (!sourceNodeId || !outputPortId) return;

        const sourcePos = getElementPosition(outputPort);
        const targetPos = convertToCanvasPosition(event.clientX, event.clientY);
        const { d } = getConnectorGeometry(sourcePos, targetPos);

        if (tempConnectorRef.current) {
            tempConnectorRef.current.setAttribute("d", d);
            tempConnectorRef.current.style.display = "block";
        }

        /** Handle pointer move to update the temporary connector */
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const newTargetPos = convertToCanvasPosition(moveEvent.clientX, moveEvent.clientY);
            const { d } = getConnectorGeometry(sourcePos, newTargetPos);
            if (tempConnectorRef.current) tempConnectorRef.current.setAttribute("d", d);
        };

        /** Handle a pointer up to finalize the connector */
        const handlePointerUp = (upEvent: PointerEvent) => {
            if (tempConnectorRef.current) tempConnectorRef.current.style.display = "none";
            controller.abort();

            const target = upEvent.target as HTMLElement;

            const targetNode = target.closest(".node");
            const inputPort = target.closest(".input-port");
            if (!targetNode || !inputPort) return;

            const targetNodeId = targetNode.getAttribute("data-node-id");
            const inputPortId = inputPort.getAttribute("data-input-port-id");
            if (!targetNodeId || !inputPortId) return;

            // Prevent the self-loop connection of a node
            if (sourceNodeId === targetNodeId) return;

            // Prevent the multiple connectors to the same input port (Prevent FAN-IN) (Allow FAN-OUT)
            if (connectors.some((c) => c.target === targetNodeId && c.targetPort === inputPortId))
                return;

            // Prevent the duplicate connectors
            const id = `${sourceNodeId}:${outputPortId}->${targetNodeId}:${inputPortId}`;
            if (connectors.some((c) => c.id === id)) return;

            setConnectors((prev) => [
                ...prev,
                {
                    id: id,
                    source: sourceNodeId,
                    sourcePort: outputPortId,
                    target: targetNodeId,
                    targetPort: inputPortId
                }
            ]);
        };

        window.addEventListener("pointermove", handlePointerMove, {
            signal: controller.signal
        });
        window.addEventListener("pointerup", handlePointerUp, {
            signal: controller.signal
        });
        window.addEventListener("pointercancel", handlePointerUp, {
            signal: controller.signal
        });
    };

    /** Handle the movement of a node */
    const handleNodeMove = (event: React.PointerEvent<HTMLDivElement>, node: HTMLElement) => {
        event.preventDefault();
        const controller = new AbortController();

        const nodeId = node.getAttribute("data-node-id");
        if (!nodeId) return;

        const nodeValue = nodes.find((n) => n.id === nodeId);
        if (!nodeValue) return;

        const startPointer = { clientX: event.clientX, clientY: event.clientY };
        const startPos = { ...nodeValue.position };

        // Pre-compute the positions of all ports relative to the canvas
        const inputPositions: Record<string, { x: number; y: number }> = {};
        const outputPositions: Record<string, { x: number; y: number }> = {};

        const inputPorts = node.querySelectorAll(".input-port");
        const outputPorts = node.querySelectorAll(".output-port");

        inputPorts.forEach((port) => {
            const pid = port.getAttribute("data-input-port-id") as string;
            inputPositions[pid] = getElementPosition(port);
        });
        outputPorts.forEach((port) => {
            const pid = port.getAttribute("data-output-port-id") as string;
            outputPositions[pid] = getElementPosition(port);
        });

        /** handle pointer move to drag the node */
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const dx = moveEvent.clientX - startPointer.clientX;
            const dy = moveEvent.clientY - startPointer.clientY;
            node.setAttribute("style", `top: ${startPos.y + dy}px; left: ${startPos.x + dx}px`);

            connectors
                .filter((c) => c.source === nodeId || c.target === nodeId)
                .forEach((connector) => {
                    const connectorElement = svgRef.current?.querySelector(
                        `[data-connector-id="${connector.id}"] path`
                    );
                    if (!connectorElement) return;

                    const sourcePos =
                        connector.source === nodeId
                            ? {
                                  x: dx + (outputPositions[connector.sourcePort]?.x ?? 0),
                                  y: dy + (outputPositions[connector.sourcePort]?.y ?? 0)
                              }
                            : getPortPosition("output", connector.source, connector.sourcePort);
                    const targetPos =
                        connector.target === nodeId
                            ? {
                                  x: dx + (inputPositions[connector.targetPort]?.x ?? 0),
                                  y: dy + (inputPositions[connector.targetPort]?.y ?? 0)
                              }
                            : getPortPosition("input", connector.target, connector.targetPort);
                    const { d } = getConnectorGeometry(sourcePos, targetPos);

                    connectorElement.setAttribute("d", d);
                });
        };

        /** Handle a pointer up to finalize node position */
        const handlePointerUp = (upEvent: PointerEvent) => {
            controller.abort();

            const dx = upEvent.clientX - startPointer.clientX;
            const dy = upEvent.clientY - startPointer.clientY;
            const position = { x: startPos.x + dx, y: startPos.y + dy };

            setNodes((nodes) =>
                nodes.map((node) => (node.id === nodeId ? { ...node, position } : node))
            );
        };

        window.addEventListener("pointermove", handlePointerMove, {
            signal: controller.signal
        });
        window.addEventListener("pointerup", handlePointerUp, {
            signal: controller.signal
        });
        window.addEventListener("pointercancel", handlePointerUp, {
            signal: controller.signal
        });
    };

    /** Handle the panning of the canvas */
    const handleCanvasPan = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        const controller = new AbortController();

        const startPointer = { clientX: event.clientX, clientY: event.clientY };
        const startPos = { ...position };

        /** Handle pointer move to pan the canvas */
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const dx = moveEvent.clientX - startPointer.clientX;
            const dy = moveEvent.clientY - startPointer.clientY;

            if (canvasRef.current)
                canvasRef.current.style.backgroundPosition = `${startPos.x + dx}px ${startPos.y + dy}px`;
            if (contentRef.current) {
                contentRef.current.style.transformOrigin = "0 0";
                contentRef.current.style.transform = `translate(${startPos.x + dx}px, ${startPos.y + dy}px) scale(${scale})`;
            }
        };

        /** Handle a pointer up to finalize panning */
        const handlePointerUp = (upEvent: PointerEvent) => {
            controller.abort();
            const dx = upEvent.clientX - startPointer.clientX;
            const dy = upEvent.clientY - startPointer.clientY;
            setPosition({ x: startPos.x + dx, y: startPos.y + dy });
        };

        window.addEventListener("pointermove", handlePointerMove, {
            signal: controller.signal
        });
        window.addEventListener("pointerup", handlePointerUp, {
            signal: controller.signal
        });
        window.addEventListener("pointercancel", handlePointerUp, {
            signal: controller.signal
        });
    };

    /** Handle a pointer down on the canvas */
    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        const node = target.closest(".node") as HTMLElement | null;
        const dragHandle = target.closest(".drag-handle");
        const outputPort = target.closest(".output-port");

        if (node && outputPort) {
            handleConnectorLink(event, node, outputPort);
        } else if (node && dragHandle) {
            handleNodeMove(event, node);
        } else if (!node) {
            handleCanvasPan(event);
        }
    };

    // Render connectors using per-port positions
    const connectorEls = connectors.map((connector) => {
        const outputPortPos = getPortPosition("output", connector.source, connector.sourcePort);
        const inputPortPos = getPortPosition("input", connector.target, connector.targetPort);
        const { d } = getConnectorGeometry(outputPortPos, inputPortPos);

        return (
            <g
                key={connector.id}
                data-connector-id={connector.id}
                onPointerDown={(ev) => ev.stopPropagation()}
                className="cursor-pointer">
                <path d={d} className="fill-none stroke-blue-300" strokeWidth={2} />
                <path
                    d={d}
                    strokeWidth={18}
                    stroke="transparent"
                    fill="none"
                    style={{ pointerEvents: "stroke" }}
                />
            </g>
        );
    });

    return (
        <div
            ref={canvasRef}
            className="relative h-full w-full overflow-hidden bg-[#FAFAFA]"
            onPointerDown={handlePointerDown}
            style={{
                backgroundImage: "radial-gradient(circle, #E6E6E6 1.25px, transparent 1.25px)",
                backgroundSize: "15px 15px",
                backgroundPosition: `${position.x}px ${position.y}px`
            }}>
            <div
                ref={contentRef}
                className="h-full w-full"
                style={{
                    transformOrigin: "0 0",
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                }}>
                {/* SVG for connectors */}
                <svg ref={svgRef} className="absolute inset-0 h-full w-full overflow-visible">
                    {/* Connectors */}
                    {connectorEls}

                    {/* Temporary Connector */}
                    <path
                        ref={tempConnectorRef}
                        className="pointer-events-none fill-none stroke-blue-300"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        style={{ display: "none" }}
                    />
                </svg>

                {/* Nodes */}
                {nodes.map((node) => {
                    const Component = nodeComponentRegistry[node.type];
                    const status = nodeStatus[node.id] ?? null;

                    const ringClass =
                        status === "running"
                            ? "animate-gray-ring-pulse"
                            : status === "completed"
                              ? "ring-6 ring-[#E6E6E6]/80"
                              : status === "failed"
                                ? "ring-6 ring-rose-200/70"
                                : "ring-1 ring-[#EBEBEB]";

                    return (
                        <div
                            key={node.id}
                            data-node-id={node.id}
                            style={{ top: node.position.y, left: node.position.x }}
                            className={`node rounded-10 absolute shadow-sm hover:shadow-md ${ringClass} select-none`}>
                            <Component
                                parameters={node.parameters}
                                setParameters={(parameters: any) => {
                                    setNodes((nodes) =>
                                        nodes.map((n) =>
                                            n.id === node.id ? { ...n, parameters } : n
                                        )
                                    );
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Bottom toolbar */}
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
                <div className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-[#EBEBEB]">
                    {/* Zoom Out */}
                    <button
                        aria-label="Zoom Out"
                        className="rounded-10 flex h-8 w-8 items-center justify-center text-gray-700 transition hover:bg-zinc-100 hover:text-gray-900 active:scale-95"
                        onClick={handleZoomOut}>
                        <ZoomOut size={16} />
                    </button>

                    {/* Zoom In */}
                    <button
                        aria-label="Zoom In"
                        className="rounded-10 flex h-8 w-8 items-center justify-center text-gray-700 transition hover:bg-zinc-100 hover:text-gray-900 active:scale-95"
                        onClick={handleZoomIn}>
                        <ZoomIn size={16} />
                    </button>

                    {/* Fit View */}
                    <button
                        aria-label="Fit View"
                        className="rounded-10 flex h-8 w-8 items-center justify-center text-gray-700 transition hover:bg-zinc-100 hover:text-gray-900 active:scale-95"
                        onClick={handleFitView}>
                        <MoveHorizontal size={16} />
                    </button>

                    <div className="mx-2 h-6 w-px bg-neutral-200" />

                    {/* Run */}
                    <button
                        title="Run Flow"
                        className="rounded-10 inline-flex h-8 items-center justify-center gap-1.5 bg-blue-600/90 px-3.5 text-xs font-medium text-white transition focus:outline-none active:scale-95"
                        onClick={handleRun}>
                        <Play size={14} />
                        Run
                    </button>

                    {/* Add Block */}
                    <button
                        title="Add Block"
                        className="rounded-10 inline-flex h-8 items-center justify-center gap-1.5 px-2.5 text-xs leading-none font-medium text-gray-700 transition hover:bg-zinc-100 focus:outline-none active:scale-95">
                        <Plus size={14} />
                        Block
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Editor;
