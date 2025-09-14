import React, { useState, useEffect } from "react";

/** Body modes */
const BODY_MODES = [
    { label: "None", value: "none" },
    { label: "Raw", value: "raw" }
] as const;

export const Body: React.FC = () => {
    const [bodyMode, setBodyMode] = useState("none");

    const [rawType, setRawType] = useState<"json" | "text">("json");
    const [jsonInput, setJsonInput] = useState<string>("{\n  \n}");
    const [textInput, setTextInput] = useState<string>("");
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Validate JSON (debounced slightly)
    useEffect(() => {
        if (bodyMode !== "raw" || rawType !== "json") return;
        const handle = setTimeout(() => {
            try {
                if (jsonInput.trim() === "") {
                    setJsonError(null);
                    return;
                }
                JSON.parse(jsonInput);
                setJsonError(null);
            } catch {
                setJsonError("Invalid JSON");
            }
        }, 250);
        return () => clearTimeout(handle);
    }, [jsonInput, bodyMode, rawType]);

    const formatJson = () => {
        try {
            const parsed = JSON.parse(jsonInput || "null");
            setJsonInput(JSON.stringify(parsed, null, 2));
            setJsonError(null);
        } catch {
            setJsonError("Invalid JSON - cannot format");
        }
    };

    return (
        <div className="mt-4 space-y-5 p-1.5">
            {/* Body mode selection */}
            <div className="flex items-center gap-6">
                {BODY_MODES.map((mode) => (
                    <label
                        key={mode.value}
                        className="flex items-center gap-2 text-xs font-medium text-gray-700">
                        <input
                            type="radio"
                            name="body-mode"
                            value={mode.value}
                            checked={mode.value === bodyMode}
                            onChange={() => setBodyMode(mode.value)}
                            className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-600"
                        />
                        {mode.label}
                    </label>
                ))}

                {bodyMode === "raw" && (
                    <div className="flex items-center gap-2">
                        <div className="flex overflow-hidden rounded-md border border-gray-200">
                            {(["json", "text"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setRawType(t)}
                                    className={`px-3 py-1.5 text-[12px] font-medium ${
                                        rawType === t
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}>
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {rawType === "json" && (
                            <button
                                type="button"
                                onClick={formatJson}
                                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50">
                                Format
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Editor area */}
            <div>
                {bodyMode === "none" && (
                    <div className="text-xs font-normal text-gray-500">
                        No body will be sent with this request
                    </div>
                )}

                {bodyMode === "raw" && rawType === "json" && (
                    <div className="space-y-2">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder="Enter JSON here..."
                            className={`min-h-[220px] w-full resize-y rounded-md border px-3 py-2 font-mono text-[12px] leading-5 ${
                                jsonError
                                    ? "border-red-300 focus:ring-red-500"
                                    : "border-gray-200 focus:ring-blue-600"
                            } focus:ring-1 focus:outline-none`}
                            spellCheck={false}
                        />
                        <div className="flex items-center justify-between">
                            <div
                                className={`text-[11px] ${jsonError ? "text-red-600" : "text-gray-400"}`}>
                                {jsonError ? jsonError : "Valid JSON"}
                            </div>
                        </div>
                    </div>
                )}

                {bodyMode === "raw" && rawType === "text" && (
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter plain text..."
                        className="min-h-[220px] w-full resize-y rounded-md border border-gray-200 px-3 py-2 font-mono text-[12px] leading-5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        spellCheck={false}
                    />
                )}
            </div>
        </div>
    );
};
