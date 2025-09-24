import { type FC } from "react";

/** Query param type */
export type QueryParam = {
    enabled: boolean;
    key: string;
    value: string;
    description: string;
};

/** Props type */
type Props = {
    queryParams: QueryParam[];
    setQueryParams: (data: QueryParam[]) => void;
};

/** Params component */
const Params: FC<Props> = ({ queryParams, setQueryParams }) => {
    /** Set all query params to enable or disabled */
    const setAll = (enabled: boolean) =>
        setQueryParams(queryParams.map((p) => ({ ...p, enabled })));

    /** Add a new empty query param */
    const add = () =>
        setQueryParams([...queryParams, { enabled: false, key: "", value: "", description: "" }]);

    /** Toggle the enabled state of a query param */
    const toggle = (index: number) =>
        setQueryParams(
            queryParams.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p))
        );

    /** Update a specific field of a query param */
    const update = (index: number, field: "key" | "value" | "description", value: string) =>
        setQueryParams(
            queryParams.map((p, i) => (i === index ? { ...p, [field]: value, enabled: true } : p))
        );

    /** Remove a query param */
    const remove = (index: number) => setQueryParams(queryParams.filter((_, i) => i !== index));

    return (
        <div className="mt-6 px-1.5">
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* Title and count */}
                <div className="flex items-center gap-2.5">
                    <div className="text-xs font-medium text-gray-800">Query Params</div>

                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100">
                        <span className="text-[11px] leading-none font-medium text-gray-800">
                            {queryParams.filter((param) => param.enabled).length}
                        </span>
                    </div>
                </div>

                {/* Add button */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={add}
                        className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-zinc-100">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 5V19M5 12H19"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Add
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="mt-3.5 w-full table-auto border-collapse">
                {/* Table head */}
                <thead>
                    <tr className="bg-[#FAFAFA]">
                        <th className="border border-[#E6E6E6] px-3.5 py-2 text-center">
                            <input
                                type="checkbox"
                                aria-label="Select all params"
                                checked={
                                    queryParams.length > 0 &&
                                    queryParams.every((queryParam) => queryParam.enabled)
                                }
                                onChange={(e) => setAll(e.target.checked)}
                                className="h-4 w-4 rounded-sm border border-[#E6E6E6] text-blue-500 checked:border-none focus:ring-blue-500"
                            />
                        </th>

                        <th className="border border-[#E6E6E6] px-5 py-2 text-left text-xs font-medium text-gray-500">
                            Key
                        </th>

                        <th className="border border-[#E6E6E6] px-5 py-2 text-left text-xs font-medium text-gray-500">
                            Value
                        </th>

                        <th className="border-y border-l border-[#E6E6E6] px-5 py-2 text-left text-xs font-medium text-gray-500">
                            Description
                        </th>

                        <th className="border-y border-r border-[#E6E6E6] px-3 py-2" />
                    </tr>
                </thead>

                {/* Table body */}
                <tbody>
                    {queryParams.map((queryParam, index) => (
                        <tr key={index} className="group hover:bg-[#FAFAFA] has-focus:bg-[#FAFAFA]">
                            <td className="border border-[#E6E6E6] px-3.5 py-2 text-center">
                                <input
                                    type="checkbox"
                                    aria-label="Select a param"
                                    checked={queryParam.enabled}
                                    onChange={() => toggle(index)}
                                    className="h-4 w-4 rounded-sm border border-[#E6E6E6] text-blue-500 checked:border-none focus:ring-blue-500"
                                />
                            </td>

                            <td className="border border-[#E6E6E6] px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={queryParam.key}
                                    onChange={(e) => update(index, "key", e.target.value)}
                                    className="w-full rounded-md border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#E6E6E6]"
                                />
                            </td>

                            <td className="border border-[#E6E6E6] px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={queryParam.value}
                                    onChange={(e) => update(index, "value", e.target.value)}
                                    className="w-full rounded-md border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#E6E6E6]"
                                />
                            </td>

                            <td className="border-y border-l border-[#E6E6E6] px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={queryParam.description}
                                    onChange={(e) => update(index, "description", e.target.value)}
                                    className="w-full rounded-md border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#E6E6E6]"
                                />
                            </td>

                            <td className="border-y border-r border-[#E6E6E6] px-3 py-2 text-center">
                                {index === 0 ? null : (
                                    <button
                                        aria-label="Remove param"
                                        onClick={() => remove(index)}
                                        className="p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-600">
                                        <svg
                                            width="16"
                                            height="16"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Params;
