import { type FC, useState } from "react";

/** Header type */
export type Header = {
    enabled: boolean;
    key: string;
    value: string;
    description: string;
    auto: boolean;
};

/** Props */
type Props = {
    headers: Header[];
    setHeaders: (data: Header[] | ((prev: Header[]) => Header[])) => void;
};

/** Header's component */
const Headers: FC<Props> = ({ headers, setHeaders }) => {
    /** State to show/hide auto generated headers */
    const [showAuto, setShowAuto] = useState(false);

    /** Filtered headers based on showAuto state */
    const visibleHeaders = headers
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => showAuto || !header.auto);

    /** Index of the first non-auto header to prevent its removal */
    const firstNonAutoHeaderIndex = headers.findIndex((header) => !header.auto);

    /** Set all headers to enable or disable, excluding auto headers */
    const setAll = (enabled: boolean) =>
        setHeaders(headers.map((h) => (h.auto ? h : { ...h, enabled })));

    /** Add a new empty header */
    const add = () =>
        setHeaders([
            ...headers,
            { enabled: false, key: "", value: "", description: "", auto: false }
        ]);

    /** Toggle the enabled state of a header */
    const toggle = (index: number) =>
        setHeaders(headers.map((h, i) => (i === index ? { ...h, enabled: !h.enabled } : h)));

    /** Update a specific field of a header */
    const update = (index: number, field: "key" | "value" | "description", value: string) =>
        setHeaders(
            headers.map((h, i) => (i === index ? { ...h, [field]: value, enabled: true } : h))
        );

    /** Remove a header */
    const remove = (index: number) => setHeaders(headers.filter((_, i) => i !== index));

    return (
        <div className="mt-6 px-1.5">
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* Title, count and show/hide auto button */}
                <div className="flex items-center gap-2.5">
                    <div className="text-xs font-medium text-gray-800">Headers</div>

                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100">
                        <span className="text-[11px] leading-none font-medium text-gray-800">
                            {headers.filter((header) => header.enabled).length}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAuto(!showAuto)}
                        className="flex items-center space-x-1.5 rounded-full bg-zinc-100 px-2 py-1 text-gray-700 hover:bg-zinc-200/80">
                        {showAuto ? (
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        )}

                        <span className="text-[11px] font-medium text-gray-700">
                            {showAuto ? "Hide auto-headers" : "Show auto-headers"}
                        </span>
                    </button>
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
                                aria-label="Select all headers"
                                checked={
                                    headers.length > 0 && headers.every((header) => header.enabled)
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
                    {visibleHeaders.map(({ header, index }) => (
                        <tr key={index} className="group hover:bg-[#FAFAFA] has-focus:bg-[#FAFAFA]">
                            <td className="border border-[#E6E6E6] px-3.5 py-2 text-center">
                                <input
                                    type="checkbox"
                                    aria-label="Select a header"
                                    checked={header.enabled}
                                    onChange={() => toggle(index)}
                                    disabled={header.auto}
                                    className="h-4 w-4 rounded-sm border border-[#E6E6E6] text-blue-500 checked:border-none focus:ring-blue-500"
                                />
                            </td>

                            <td className="border border-[#E6E6E6] px-3 py-2">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Key"
                                        value={header.key}
                                        onChange={(e) => update(index, "key", e.target.value)}
                                        disabled={header.auto}
                                        className="w-full rounded-md border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#E6E6E6]"
                                    />

                                    {header.auto && (
                                        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-500">
                                            auto
                                        </span>
                                    )}
                                </div>
                            </td>

                            <td className="border border-[#E6E6E6] px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={header.value}
                                    onChange={(e) => update(index, "value", e.target.value)}
                                    disabled={header.auto}
                                    className="w-full rounded-md border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#E6E6E6]"
                                />
                            </td>

                            <td className="border-y border-l border-[#E6E6E6] px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={header.description}
                                    onChange={(e) => update(index, "description", e.target.value)}
                                    disabled={header.auto}
                                    className="w-full rounded-md border-none bg-transparent px-2 py-1 text-xs font-normal text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-[#E6E6E6]"
                                />
                            </td>

                            <td className="border-y border-r border-[#E6E6E6] px-3 py-2 text-center">
                                {!header.auto && index !== firstNonAutoHeaderIndex && (
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

export default Headers;
