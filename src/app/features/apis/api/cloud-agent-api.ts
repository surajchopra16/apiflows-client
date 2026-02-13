/** Imported modules */
import type { AuditResponse, UpstreamRequest, UpstreamResponse } from "../utils/types.ts";
import { env } from "../../../../env.ts";

/** Send the upstream request */
const sendUpstreamRequest = async (
    request: UpstreamRequest,
    signal?: AbortSignal
): Promise<UpstreamResponse> => {
    try {
        const response = await fetch(`${env.HOST_URL}/api/v1/cloud-agent/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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

/** Send the audit request */
const sendAuditRequest = async (
    request: UpstreamRequest,
    response: UpstreamResponse
): Promise<AuditResponse> => {
    try {
        const auditResponse = await fetch(`${env.HOST_URL}/api/v1/cloud-agent/request/audit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ request, response })
        });
        const result = await auditResponse.json();

        if (!auditResponse.ok) throw new Error(result.message || "Failed to fetch audit request");

        return result.data;
    } catch (err) {
        console.error("Error fetching audit request:", err);
        throw err;
    }
};

export const cloudAgentAPI = { sendUpstreamRequest, sendAuditRequest };
