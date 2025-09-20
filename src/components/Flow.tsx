import React, { useState, useRef, useLayoutEffect } from "react";
import PipelineNode from "./PipelineNode.tsx";
import StartNode from "./StartNode.tsx";

/** Node type */
type Node = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
};

/** Connector type */
type Connector = {
    id: string;
    source: string;
    sourcePort: string;
    target: string;
    targetPort: string;
};

/** Node registry to map node types to components */
const nodeRegistry: Record<string, any> = {
    start: StartNode,
    pipeline: PipelineNode
};

const Flow = () => {
    /** Canvas position and scale */
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale] = useState(1);

    /** Nodes */
    const [nodes, setNodes] = useState<Node[]>([
        { id: "1", type: "start", position: { x: 50, y: 200 }, data: {} },
        { id: "2", type: "pipeline", position: { x: 450, y: 100 }, data: {} },
        { id: "3", type: "pipeline", position: { x: 450, y: 300 }, data: {} }
    ]);

    /** Connectors */
    const [connectors, setConnectors] = useState<Connector[]>([
        { id: "1:1->2:1", source: "1", sourcePort: "1", target: "2", targetPort: "1" },
        { id: "1:1->3:1", source: "1", sourcePort: "1", target: "3", targetPort: "1" }
    ]);

    /** Refs */
    const canvasRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const tempConnectorRef = useRef<SVGPathElement>(null);

    // Force re-render after layout to ensure refs are set
    const [, setLayoutReady] = useState(false);
    useLayoutEffect(() => setLayoutReady(true), []);

    /** Get canvas position from screen coordinates */
    const getCanvasPosition = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const canvasRect = canvas.getBoundingClientRect();
        return {
            x: (x - canvasRect.left - position.x) / scale,
            y: (y - canvasRect.top - position.y) / scale
        };
    };

    /** Get the center position of an element relative to the canvas */
    const getElementCanvasPosition = (element: Element) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const elementRect = element.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        return {
            x: (elementRect.left + elementRect.width / 2 - canvasRect.left - position.x) / scale,
            y: (elementRect.top + elementRect.height / 2 - canvasRect.top - position.y) / scale
        };
    };

    /** Get the port position relative to the canvas */
    const getPortPosition = (type: "input" | "output", nodeId: string, portId: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const node = canvas.querySelector(`[data-node-id="${nodeId}"]`);
        if (!node) return { x: 0, y: 0 };

        const cls = type === "input" ? ".input-port" : ".output-port";
        const port = node.querySelector(`${cls}[data-${type}-port-id="${portId}"]`);
        const measure = port ?? node;

        const portRect = measure.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        return {
            x: (portRect.left + portRect.width / 2 - canvasRect.left - position.x) / scale,
            y: (portRect.top + portRect.height / 2 - canvasRect.top - position.y) / scale
        };
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
        node: HTMLElement,
        outputPort: Element
    ) => {
        const controller = new AbortController();
        const signal = controller.signal;

        event.preventDefault();

        const nodeId = node.getAttribute("data-node-id") as string;
        const outputPortId = outputPort.getAttribute("data-output-port-id") as string;

        const sourcePos = getElementCanvasPosition(outputPort);
        const targetPos = getCanvasPosition(event.clientX, event.clientY);
        const { d } = getConnectorGeometry(sourcePos, targetPos);

        if (tempConnectorRef.current) {
            tempConnectorRef.current.setAttribute("d", d);
            tempConnectorRef.current.style.display = "block";
        }

        /** Handle pointer move to update the temporary connector */
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const newTargetPos = getCanvasPosition(moveEvent.clientX, moveEvent.clientY);
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

            if (targetNode && inputPort) {
                const targetNodeId = targetNode.getAttribute("data-node-id");
                const inputPortId = inputPort.getAttribute("data-input-port-id");

                if (targetNodeId && nodeId !== targetNodeId && inputPortId) {
                    const newConnectorId = `${nodeId}:${outputPortId}->${targetNodeId}:${inputPortId}`;
                    if (!connectors.some((c) => c.id === newConnectorId)) {
                        setConnectors((prev) => [
                            ...prev,
                            {
                                id: newConnectorId,
                                source: nodeId,
                                sourcePort: outputPortId,
                                target: targetNodeId,
                                targetPort: inputPortId
                            }
                        ]);
                    }
                }
            }
        };

        window.addEventListener("pointermove", handlePointerMove, { signal });
        window.addEventListener("pointerup", handlePointerUp, { signal });
        window.addEventListener("pointercancel", handlePointerUp, { signal });
    };

    /** Handle the movement of a node */
    const handleNodeMove = (event: React.PointerEvent<HTMLDivElement>, node: HTMLElement) => {
        const controller = new AbortController();
        const signal = controller.signal;

        event.preventDefault();

        const nodeId = node.getAttribute("data-node-id") as string;
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
            inputPositions[pid] = getElementCanvasPosition(port);
        });
        outputPorts.forEach((port) => {
            const pid = port.getAttribute("data-output-port-id") as string;
            outputPositions[pid] = getElementCanvasPosition(port);
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

        window.addEventListener("pointermove", handlePointerMove, { signal });
        window.addEventListener("pointerup", handlePointerUp, { signal });
        window.addEventListener("pointercancel", handlePointerUp, { signal });
    };

    /** Handle the panning of the canvas */
    const handleCanvasPan = (event: React.PointerEvent<HTMLDivElement>) => {
        const controller = new AbortController();
        const signal = controller.signal;

        event.preventDefault();

        const startPointer = { clientX: event.clientX, clientY: event.clientY };
        const startPos = { ...position };

        /** Handle pointer move to pan the canvas */
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const dx = moveEvent.clientX - startPointer.clientX;
            const dy = moveEvent.clientY - startPointer.clientY;

            if (canvasRef.current)
                canvasRef.current.style.backgroundPosition = `${startPos.x + dx}px ${startPos.y + dy}px`;
            if (contentRef.current)
                contentRef.current.style.transform = `translate(${startPos.x + dx}px, ${startPos.y + dy}px) scale(${scale})`;
        };

        /** Handle a pointer up to finalize panning */
        const handlePointerUp = (upEvent: PointerEvent) => {
            controller.abort();
            const dx = upEvent.clientX - startPointer.clientX;
            const dy = upEvent.clientY - startPointer.clientY;
            setPosition({ x: startPos.x + dx, y: startPos.y + dy });
        };

        window.addEventListener("pointermove", handlePointerMove, { signal });
        window.addEventListener("pointerup", handlePointerUp, { signal });
        window.addEventListener("pointercancel", handlePointerUp, { signal });
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
                <path d={d} className="fill-none stroke-blue-400/60" strokeWidth={2} />
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
                style={{ transform: `translate(${position.x}px, ${position.y}px)`, scale: scale }}>
                {/* SVG for connectors */}
                <svg ref={svgRef} className="absolute inset-0 h-full w-full overflow-visible">
                    {/* Connectors */}
                    {connectorEls}

                    {/* Temporary Connector */}
                    <path
                        ref={tempConnectorRef}
                        className="pointer-events-none fill-none stroke-blue-400/50"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        style={{ display: "none" }}
                    />
                </svg>

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
