/** Imported modules */
import { type FC, useState } from "react";
import { useResponseStore, type ResponseState } from "../store/response-store";
import { cloudAgentAPI } from "../api/cloud-agent-api";
import { Sparkles, SlidersHorizontal } from "lucide-react";

/** A simple weighted metric component */
const WeightedMetric: FC<{ label: string; points: number; maxPoints: number }> = ({
    label,
    points,
    maxPoints
}) => {
    // Calculate the percentage (0-100)
    const percentage = Math.max(0, Math.min(100, (points / maxPoints) * 100));

    // Determine the color based on thresholds
    const colorClass =
        percentage >= 80 ? "bg-emerald-500" : percentage >= 60 ? "bg-amber-500" : "bg-rose-500";

    return (
        <div className="flex w-full flex-col space-y-1.5">
            {/* Header with label and numeric indicator */}
            <div className="flex items-end justify-between">
                <span className="mb-0.25 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    {label}
                </span>

                <div className="space-x-0.5 text-right">
                    <span className="text-sm font-bold text-gray-900">{points}</span>
                    <span className="text-xs font-normal text-gray-400">/{maxPoints}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div
                role="progressbar"
                className="h-1.5 w-full overflow-hidden rounded-full bg-[#EBEBEB]">
                <div
                    className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

/** Audit tab component */
const AuditTab: FC<{ data: ResponseState }> = ({ data }) => {
    /** States */
    const [filter, setFilter] = useState<"All" | "Structure" | "Performance" | "Best Practices">(
        "All"
    );
    const [hasError, setHasError] = useState(false);

    /** Hooks */
    const { addAuditResponse, setLoadingAudit } = useResponseStore();

    /** Handlers */
    const fetchAudit = async () => {
        if (data.loadingAudit || !data.request || !data.response) return;

        setLoadingAudit(data.requestId, true);
        setHasError(false);
        try {
            const audit = await cloudAgentAPI.sendAuditRequest(data.request, data.response);
            addAuditResponse(data.requestId, audit);
        } catch (error) {
            console.error("Failed to fetch audit:", error);
            setLoadingAudit(data.requestId, false);
            setHasError(true);
        }
    };

    /** Loading state */
    if (data.loadingAudit) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4 bg-[#FAFAFA]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600"></div>
                <p className="animate-pulse text-xs font-medium text-gray-500">
                    Running AI Analysis...
                </p>
            </div>
        );
    }

    /** No audit data state */
    if (!data.audit) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-[#FAFAFA] p-8">
                {/* Header */}
                <div className="mb-4 max-w-sm text-center">
                    <h3 className="text-sm font-semibold text-gray-900">
                        {hasError ? "Audit Failed" : "AI Audit Ready"}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        {hasError
                            ? "Failed to generate the audit report. Please try again."
                            : "Generate a comprehensive analysis of your API response, including structure, performance, and best practices checks."}
                    </p>
                </div>

                {/* Generate/Retry button */}
                <button
                    onClick={fetchAudit}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                    <Sparkles size={14} />
                    {hasError ? "Retry Audit" : "Generate Report"}
                </button>
            </div>
        );
    }

    const filteredSuggestions =
        filter === "All"
            ? data.audit.suggestions
            : data.audit.suggestions.filter((s) => s.category === filter);

    return (
        <div className="flex h-full flex-col overflow-y-auto bg-[#FAFAFA]">
            <div className="mx-auto w-full max-w-4xl space-y-10 p-8">
                {/* 1. Scorecard section */}
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 pb-3">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <Sparkles size={18} />
                            <h2 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                                AI Audit Report
                            </h2>
                        </div>

                        <p className="pl-7 text-xs text-gray-500">
                            Comprehensive analysis of structure, performance, and best practices
                        </p>
                    </div>

                    {/* Scorecard */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Overall score */}
                        <div className="flex flex-col justify-center lg:col-span-3">
                            <span className="mb-1.5 text-5xl font-semibold tracking-tight text-gray-900">
                                {data.audit.totalScore}
                                <span className="ml-0.5 text-xl font-normal text-gray-400">
                                    /100
                                </span>
                            </span>

                            <span className="text-xs font-medium text-gray-500">
                                Overall Audit Score
                            </span>
                        </div>

                        {/* Score breakdown */}
                        <div className="grid grid-cols-1 items-center gap-8 lg:col-span-9 lg:grid-cols-3">
                            <WeightedMetric
                                label="Structure"
                                points={data.audit.breakdown.structure}
                                maxPoints={40}
                            />
                            <WeightedMetric
                                label="Performance"
                                points={data.audit.breakdown.performance}
                                maxPoints={30}
                            />
                            <WeightedMetric
                                label="Best Practices"
                                points={data.audit.breakdown.bestPractices}
                                maxPoints={30}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Suggestions section */}
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>

                        {/* Filters */}
                        <div className="flex items-center space-x-3">
                            <SlidersHorizontal size={14} className="text-gray-400" />

                            <div className="flex gap-1">
                                {["All", "Structure", "Performance", "Best Practices"].map((f) => (
                                    <button
                                        key={f}
                                        aria-label={`Filter by ${f}`}
                                        onClick={() => setFilter(f as any)}
                                        className={`rounded-md px-2 py-1 text-xs transition-colors ${
                                            filter === f
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions list */}
                    <div className="space-y-3">
                        {filteredSuggestions.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#EBEBEB] bg-white py-12 text-center">
                                <p className="text-sm font-normal text-gray-500">
                                    No suggestions found for this category
                                </p>
                            </div>
                        ) : (
                            filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="relative flex flex-col gap-6 rounded-xl border border-[#EBEBEB] bg-white p-5 md:flex-row">
                                    {/* Marker line */}
                                    <div
                                        className={`absolute top-6 bottom-6 left-0 w-1 rounded-r-full ${
                                            suggestion.category === "Structure"
                                                ? "bg-sky-500"
                                                : suggestion.category === "Performance"
                                                  ? "bg-emerald-500"
                                                  : "bg-pink-500"
                                        }`}
                                    />

                                    {/* Content */}
                                    <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 pl-1.5 md:grid-cols-2">
                                        {/* Issue */}
                                        <div>
                                            <div className="mb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                                                Detected Issue
                                            </div>
                                            <p className="text-sm leading-relaxed font-normal text-gray-700">
                                                {suggestion.issue}
                                            </p>
                                        </div>

                                        {/* Fix */}
                                        <div>
                                            <div className="mb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                                                AI Recommendation
                                            </div>
                                            <p className="text-sm leading-relaxed font-medium text-gray-900">
                                                {suggestion.fix}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditTab;
