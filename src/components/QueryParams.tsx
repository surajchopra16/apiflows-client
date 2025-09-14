import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";

/** Query param type */
export type QueryParam = {
    enabled: boolean;
    key: string;
    value: string;
    description: string;
};

/** Props for the QueryParams component */
type Props = {
    queryParams: QueryParam[];
    setQueryParams: (next: QueryParam[]) => void;
};

export const QueryParams: React.FC<Props> = ({ queryParams, setQueryParams }) => {
    // Add a new empty query param
    const add = () =>
        setQueryParams([...queryParams, { enabled: true, key: "", value: "", description: "" }]);

    // Toggle the enabled state of a query param
    const toggle = (index: number) =>
        setQueryParams(
            queryParams.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p))
        );

    // Update a specific field of a query param
    const update = (index: number, field: "key" | "value" | "description", value: string) =>
        setQueryParams(queryParams.map((p, i) => (i === index ? { ...p, [field]: value } : p)));

    // Remove a query param
    const remove = (index: number) => setQueryParams(queryParams.filter((_, idx) => idx !== index));

    // Set all query params to enable or disable
    const setAll = (enabled: boolean) =>
        setQueryParams(queryParams.map((p) => ({ ...p, enabled })));

    return (
        <div className="mt-4 p-1.5">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-[13px] font-medium text-gray-800">Query Params</div>
                    <div className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                        {queryParams.length}
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
                                    checked={
                                        queryParams.length > 0 &&
                                        queryParams.every((p) => p.enabled)
                                    }
                                    aria-label="Select all params"
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
                        {queryParams.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-3 py-6 text-center text-xs text-gray-500">
                                    No query params. Click Add to create one.
                                </td>
                            </tr>
                        ) : (
                            queryParams.map((queryParam, idx) => (
                                <tr
                                    key={idx}
                                    className="group border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-2 text-center align-middle">
                                        <input
                                            type="checkbox"
                                            checked={queryParam.enabled}
                                            onChange={() => toggle(idx)}
                                            className="h-4 w-4 rounded-sm border border-gray-200 text-blue-600 checked:border-none focus:ring-blue-600"
                                        />
                                    </td>

                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            placeholder="Key"
                                            value={queryParam.key}
                                            onChange={(e) => update(idx, "key", e.target.value)}
                                            className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300/80 focus:outline-none"
                                        />
                                    </td>

                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={queryParam.value}
                                            onChange={(e) => update(idx, "value", e.target.value)}
                                            className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300/80 focus:outline-none"
                                        />
                                    </td>

                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={queryParam.description}
                                            onChange={(e) =>
                                                update(idx, "description", e.target.value)
                                            }
                                            className="w-full rounded-lg border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-600 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300/80 focus:outline-none"
                                        />
                                    </td>

                                    <td className="px-5 py-2 text-right">
                                        <button
                                            onClick={() => remove(idx)}
                                            aria-label="Delete param"
                                            className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 focus:outline-none">
                                            <Cross2Icon className="h-4 w-4" />
                                        </button>
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
