/** Imported modules */
import type { UpstreamRequest, UpstreamResponse } from "../utils/types.ts";

/** Base URL for the API */
const BASE_URL = "http://localhost:8080";

/** Send the upstream request */
const sendUpstreamRequest = async (
    request: UpstreamRequest,
    signal: AbortSignal
): Promise<UpstreamResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/cloud-agent/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
            signal
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to fetch request");

        return result.data.response;
    } catch (err) {
        console.error("Error fetching request:", err);
        throw err;
    }
};

export { sendUpstreamRequest };
