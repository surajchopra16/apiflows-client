/** Imported modules */
import { useState, useEffect, type FC } from "react";
import { DropdownMenu } from "radix-ui";
import { ChevronDown } from "lucide-react";
import type { Body } from "../../utils/types.ts";
import ReactCodeMirror from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { json } from "@codemirror/lang-json";

/** Props type */
type Props = { body: Body; setBody: (body: Body) => void };

/** Body editor component */
const BodyEditor: FC<Props> = ({ body, setBody }) => {
    /** Body mode */
    const bodyMode = body.type.split(":")[0] as "none" | "raw";

    /** Raw type */
    const rawType = (body.type.split(":")[1] || "text") as "text" | "json";

    /** JSON error state */
    const [jsonError, setJsonError] = useState<string | null>(null);

    /** Validate JSON input */
    useEffect(() => {
        if (body.type !== "raw:json") return;

        const handleCheck = setTimeout(() => {
            try {
                if (body.value.trim() === "") {
                    setJsonError(null);
                    return;
                }

                JSON.parse(body.value);
                setJsonError(null);
            } catch {
                setJsonError("Invalid JSON");
            }
        }, 250);

        return () => clearTimeout(handleCheck);
    }, [body]);

    /** Format JSON input */
    const formatJSON = () => {
        try {
            const parsed = JSON.parse(body.value || "null");
            setBody({ ...body, value: JSON.stringify(parsed, null, 4) });
            setJsonError(null);
        } catch {
            setJsonError("Invalid JSON - cannot format");
        }
    };

    return (
        <div className="mx-2 my-6 space-y-5">
            {/* Header */}
            <div className="flex items-center space-x-5">
                {/* Body mode input */}
                {["none", "raw"].map((mode) => (
                    <label
                        key={mode}
                        aria-label={`Select ${mode} body mode`}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <input
                            type="radio"
                            value={mode}
                            checked={mode === bodyMode}
                            onChange={() =>
                                setBody({ ...body, type: mode === "none" ? "none" : "raw:text" })
                            }
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

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    sideOffset={10}
                                    className="rounded-10 min-w-20 border border-[#EBEBEB] bg-white p-1 shadow-md">
                                    <DropdownMenu.Item
                                        aria-label="Select text raw type"
                                        onClick={() => setBody({ type: "raw:text", value: "" })}
                                        className="flex w-full items-center rounded-md px-3 py-2 text-xs font-medium text-gray-800 hover:bg-zinc-100">
                                        Text
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                        aria-label="Select JSON raw type"
                                        onClick={() =>
                                            setBody({ type: "raw:json", value: "{\n \n}" })
                                        }
                                        className="flex w-full items-center rounded-md px-3 py-2 text-xs font-medium text-gray-800 hover:bg-zinc-100">
                                        JSON
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
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
            {body.type === "none" ? (
                <div className="text-xs font-normal text-gray-500">
                    No body will be sent with this request
                </div>
            ) : body.type === "raw:text" ? (
                <ReactCodeMirror
                    height="200px"
                    value={body.value}
                    onChange={(value) => setBody({ ...body, value })}
                    theme={githubLight}
                    placeholder="Enter text here..."
                    className="overflow-hidden rounded-lg ring ring-[#EBEBEB]"
                />
            ) : body.type === "raw:json" ? (
                <div className="space-y-2">
                    <ReactCodeMirror
                        height="200px"
                        value={body.value}
                        onChange={(value) => setBody({ ...body, value })}
                        theme={githubLight}
                        extensions={[json()]}
                        className="overflow-hidden rounded-lg ring ring-[#EBEBEB]"
                    />

                    <div className="ml-0.5">
                        {jsonError ? (
                            <div className="text-xs text-red-500">{jsonError}</div>
                        ) : (
                            <div className="text-xs text-gray-500">Valid JSON</div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default BodyEditor;
