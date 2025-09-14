import { MoreVertical } from "lucide-react";

/** Start node props type */
type StartNodeProps = {
    id: string;
    position: { x: number; y: number };
    data: Record<string, any>;
};

const StartNode = ({ id, position }: StartNodeProps) => {
    return (
        <div
            data-node-id={id}
            style={{ top: position.y, left: position.x }}
            className="drag-node absolute select-none">
            <div className="rounded-10 w-64 bg-white px-4 py-3 shadow-sm ring-1 ring-[#EBEBEB] hover:shadow-md">
                {/* Top Bar */}
                <div className="drag-handle flex cursor-grab items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                                fill="#2B7FFF"
                            />
                            <path
                                d="M13.799 9.25157L8.3994 5.65183C8.12222 5.46734 7.76765 5.44934 7.47607 5.60683C7.18269 5.76342 7 6.0685 7 6.40057V13.6001C7 13.9321 7.18269 14.2372 7.47517 14.3938C7.60836 14.4649 7.75415 14.5 7.89994 14.5C8.07452 14.5 8.24821 14.4487 8.3994 14.3488L13.799 10.7491C14.0492 10.5817 14.1995 10.3009 14.1995 10.0003C14.1995 9.69973 14.0492 9.41895 13.799 9.25157Z"
                                fill="white"
                            />
                        </svg>

                        <span className="text-sm font-medium text-gray-950">Start</span>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                    </button>
                </div>

                {/* Title */}
                <div className="mt-2">
                    <h3 className="text-xs font-normal text-gray-400">
                        Starting node for the workflow
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default StartNode;
