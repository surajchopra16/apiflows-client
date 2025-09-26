import { useState, useEffect, type FC } from "react";
import { DropdownMenu } from "radix-ui";
import { ChevronDown } from "lucide-react";

/** Body types */
export type BodyType = "none" | "raw:text" | "raw:json";

/** Body modes */
const BODY_MODES = ["none", "raw"] as const;

/** Body component */
const Body: FC<{
    bodyType: BodyType;
    setBodyType: (type: BodyType) => void;
    bodyValue: string;
    setBodyValue: (value: string) => void;
}> = ({ bodyType, setBodyType, bodyValue, setBodyValue }) => {
    /** Body mode */
    const bodyMode = bodyType.split(":")[0] as "none" | "raw";

    /** Raw type */
    const rawType = (bodyType.split(":")[1] || "text") as "text" | "json";

    /** JSON error state */
    const [jsonError, setJsonError] = useState<string | null>(null);

    /** Validate JSON input */
    useEffect(() => {
        if (bodyType !== "raw:json") return;

        const handleCheck = setTimeout(() => {
            try {
                if (bodyValue.trim() === "") {
                    setJsonError(null);
                    return;
                }

                JSON.parse(bodyValue);
                setJsonError(null);
            } catch {
                setJsonError("Invalid JSON");
            }
        }, 250);

        return () => clearTimeout(handleCheck);
    }, [bodyType, bodyValue]);

    /** Format JSON input */
    const formatJSON = () => {
        try {
            const parsed = JSON.parse(bodyValue || "null");
            setBodyValue(JSON.stringify(parsed, null, 4));
            setJsonError(null);
        } catch {
            setJsonError("Invalid JSON - cannot format");
        }
    };

    return (
        <div className="mt-6 space-y-5 px-1.5">
            {/* Header */}
            <div className="flex items-center space-x-5">
                {/* Body mode input */}
                {BODY_MODES.map((mode) => (
                    <label
                        key={mode}
                        aria-label={`Select ${mode} body mode`}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <input
                            type="radio"
                            value={mode}
                            checked={mode === bodyMode}
                            onChange={() => setBodyType(mode === "none" ? "none" : "raw:text")}
                            className="h-3.5 w-3.5 border border-[#E6E6E6] text-blue-500 capitalize checked:border-none focus:ring-blue-500"
                        />
                        {mode}
                    </label>
                ))}

                {/* Raw type dropdown and format button */}
                {bodyMode === "raw" && (
                    <div className="flex w-full items-center justify-between pl-3">
                        {/* Raw type dropdown */}
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger className="inline-flex items-center">
                                <span className="text-xs font-medium text-gray-700">
                                    {rawType === "json" ? "JSON" : "Text"}
                                </span>
                                <ChevronDown className="ml-2 h-4 w-4 text-gray-600" />
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content
                                sideOffset={10}
                                className="rounded-10 min-w-20 border border-[#EBEBEB] bg-white p-1 shadow-md">
                                <DropdownMenu.Item
                                    aria-label="Select text raw type"
                                    onClick={() => {
                                        setBodyType("raw:text");
                                        setBodyValue("");
                                    }}
                                    className="flex w-full items-center rounded-md px-3 py-2 text-xs font-medium text-gray-800 hover:bg-zinc-100">
                                    Text
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    aria-label="Select JSON raw type"
                                    onClick={() => {
                                        setBodyType("raw:json");
                                        setBodyValue("{\n \n}");
                                    }}
                                    className="flex w-full items-center rounded-md px-3 py-2 text-xs font-medium text-gray-800 hover:bg-zinc-100">
                                    JSON
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>

                        {/* Format button (only for JSON) */}
                        {rawType === "json" && (
                            <button
                                type="button"
                                onClick={formatJSON}
                                className="pr-2 text-xs font-medium text-gray-700 select-none">
                                Format
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Editor area */}
            <div>
                {bodyType === "none" ? (
                    <div className="text-xs font-normal text-gray-500">
                        No body will be sent with this request
                    </div>
                ) : bodyType === "raw:text" ? (
                    <textarea
                        value={bodyValue}
                        onChange={(e) => setBodyValue(e.target.value)}
                        placeholder="Enter plain text here..."
                        spellCheck={false}
                        className="min-h-44 w-full resize-y rounded-lg border border-[#EBEBEB] px-3 py-2 font-mono text-xs leading-5 font-normal text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                    />
                ) : bodyType === "raw:json" ? (
                    <div>
                        <textarea
                            value={bodyValue}
                            onChange={(e) => setBodyValue(e.target.value)}
                            placeholder="Enter JSON here..."
                            spellCheck={false}
                            className="min-h-44 w-full resize-y rounded-lg border border-[#EBEBEB] px-3 py-2 font-mono text-xs leading-5 font-normal text-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        />

                        <div>
                            {jsonError ? (
                                <div className="mt-1 ml-0.5 text-xs text-red-500">{jsonError}</div>
                            ) : (
                                <div className="mt-1 ml-0.5 text-xs text-gray-500">Valid JSON</div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Body;
