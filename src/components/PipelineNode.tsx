import { useRef } from "react";

type NodeProps = {
    id: string;
    position: { x: number; y: number };
};

const PipelineNode = ({ id, position }: NodeProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const inputs = ["1", "2"];
    const outputs = ["1", "2"];

    return (
        <div
            ref={ref}
            data-node-id={id}
            style={{ top: position.y, left: position.x }}
            className="node absolute select-none">
            <div className="relative w-64 rounded-xl bg-white px-4 py-3 text-sm shadow ring-1 ring-gray-200 hover:shadow-md">
                {/* Multiple Input Ports (left edge) */}
                {inputs.map((pid, i) => {
                    const topPct = ((i + 1) / (inputs.length + 1)) * 100;
                    return (
                        <div
                            key={pid}
                            data-input-port-id={pid}
                            className="input-port absolute left-[-6px] z-10 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full border border-white bg-emerald-500"
                            style={{ top: `${topPct}%` }}
                            title={`Input ${pid}`}
                            aria-label={`Input ${pid}`}
                        />
                    );
                })}

                {/* Multiple Output Ports (right edge) */}
                {outputs.map((pid, i) => {
                    const topPct = ((i + 1) / (outputs.length + 1)) * 100;
                    return (
                        <div
                            key={pid}
                            data-output-port-id={pid}
                            className="output-port absolute right-[-6px] z-10 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full border border-white bg-blue-500"
                            style={{ top: `${topPct}%` }}
                            title={`Output ${pid}`}
                            aria-label={`Output ${pid}`}
                        />
                    );
                })}

                <div className="drag-handle mb-2 inline-block cursor-move rounded bg-gray-200 px-2 py-1 text-[11px] font-medium text-gray-600">
                    Pipeline
                </div>

                <div className="font-semibold text-green-600">⚡ Pipeline</div>
                <p className="mt-1 text-[11px] text-gray-500">Process or transform data here.</p>
            </div>
        </div>
    );
};

export default PipelineNode;
