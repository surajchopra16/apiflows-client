import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";

/** Header type */
export type Header = {
    enabled: boolean;
    key: string;
    value: string;
    description: string;
    auto: boolean;
};

/** Props for the Headers component */
type Props = {
    headers: Header[];
    setHeaders: (next: Header[]) => void;
};

export const Headers: React.FC<Props> = ({ headers, setHeaders }) => {
    // Add a new empty header
    const add = () =>
        setHeaders([
            ...headers,
            { enabled: true, key: "", value: "", description: "", auto: false }
        ]);

    // Toggle the enabled state of a header
    const toggle = (index: number) =>
        setHeaders(headers.map((h, i) => (i === index ? { ...h, enabled: !h.enabled } : h)));

    // Update a specific field of a header
    const update = (index: number, field: "key" | "value" | "description", value: string) =>
        setHeaders(headers.map((h, i) => (i === index ? { ...h, [field]: value } : h)));

    // Remove a header
    const remove = (index: number) => setHeaders(headers.filter((_, i) => i !== index));

    // Set all headers to enable or disable
    const setAll = (enabled: boolean) => setHeaders(headers.map((h) => ({ ...h, enabled })));

    return (
        <div className="mt-4 p-1.5">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-[13px] font-medium text-gray-800">Headers</div>
                    <div className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                        {headers.length}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={add}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-3 overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded-sm border border-gray-200 text-blue-600 checked:border-none focus:ring-blue-600"
                                    onChange={(e) => setAll(e.target.checked)}
                                    checked={headers.length > 0 && headers.every((h) => h.enabled)}
                                    aria-label="Select all headers"
                                />
                            </th>
                            <th className="px-5 py-2 text-left text-xs font-semibold text-gray-500">
                                Key
                            </th>
                            <th className="px-5 py-2 text-left text-xs font-semibold text-gray-500">
                                Value
                            </th>
                            <th className="px-5 py-2 text-left text-xs font-semibold text-gray-500">
                                Description
                            </th>
                            <th className="px-5 py-2 text-right" />
                        </tr>
                    </thead>

                    <tbody>
                        {headers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-3 py-6 text-center text-xs text-gray-500">
                                    No headers. Click Add to create one.
                                </td>
                            </tr>
                        ) : (
                            headers.map((header, idx) => (
                                <tr
                                    key={idx}
                                    className="group border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-2 text-center align-middle">
                                        <input
                                            type="checkbox"
                                            checked={header.enabled}
                                            onChange={() => toggle(idx)}
                                            className="h-4 w-4 rounded-sm border border-gray-200 text-blue-600 checked:border-none focus:ring-blue-600"
                                        />
                                    </td>

                                    <td className="px-3 py-2">
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Header"
                                                value={header.key}
                                                onChange={(e) => update(idx, "key", e.target.value)}
                                                disabled={header.auto}
                                                className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
                                            />

                                            {header.auto && (
                                                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                                                    auto
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={header.value}
                                            onChange={(e) => update(idx, "value", e.target.value)}
                                            disabled={header.auto}
                                            className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
                                        />
                                    </td>

                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={header.description}
                                            onChange={(e) =>
                                                update(idx, "description", e.target.value)
                                            }
                                            disabled={header.auto}
                                            className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
                                        />
                                    </td>

                                    <td className="px-5 py-2 text-right">
                                        {!header.auto && (
                                            <button
                                                onClick={() => remove(idx)}
                                                aria-label="Delete header"
                                                className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 focus:outline-none">
                                                <Cross2Icon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
