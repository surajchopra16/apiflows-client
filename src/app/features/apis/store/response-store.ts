/** Imported modules */
import { create } from "zustand/react";
import type { UpstreamResponse, UpstreamRequest, AuditResponse } from "../utils/types.ts";

/** Response state type */
export type ResponseState = {
    requestId: string;
    request: UpstreamRequest | null;
    response: UpstreamResponse | null;
    audit: AuditResponse | null;
    loading: boolean;
    loadingAudit: boolean;
    error: string | null;
    controller: AbortController | null;
};

/** Response store type */
type ResponseStore = {
    responses: ResponseState[];
    addLoadingResponse: (
        requestId: string,
        request: UpstreamRequest,
        controller: AbortController
    ) => void;
    addSuccessResponse: (requestId: string, data: UpstreamResponse) => void;
    addErrorResponse: (requestId: string, error: string) => void;
    addAuditResponse: (requestId: string, audit: AuditResponse) => void;
    setLoadingAudit: (requestId: string, loading: boolean) => void;
    cancelResponse: (requestId: string) => void;
    removeResponse: (requestId: string) => void;
    removeResponses: (requestIds: string[]) => void;
    clearResponses: () => void;
};

/** Response store */
export const useResponseStore = create<ResponseStore>((set) => ({
    responses: [],

    /** Add a loading response */
    addLoadingResponse: (requestId, request, controller) =>
        set((state) => ({
            responses: [
                ...state.responses.filter((response) => response.requestId !== requestId),
                {
                    requestId,
                    request,
                    response: null,
                    audit: null,
                    loading: true,
                    loadingAudit: false,
                    error: null,
                    controller
                }
            ]
        })),

    /** Add a success response */
    addSuccessResponse: (requestId, data) =>
        set((state) => ({
            responses: [
                ...state.responses.filter((response) => response.requestId !== requestId),
                {
                    ...state.responses.find((response) => response.requestId === requestId)!,
                    response: data,
                    loading: false,
                    controller: null
                }
            ]
        })),

    /** Add an error response */
    addErrorResponse: (requestId, error) =>
        set((state) => ({
            responses: [
                ...state.responses.filter((response) => response.requestId !== requestId),
                {
                    ...state.responses.find((response) => response.requestId === requestId)!,
                    loading: false,
                    error,
                    controller: null
                }
            ]
        })),

    /** Add an audit response */
    addAuditResponse: (requestId, audit) =>
        set((state) => ({
            responses: state.responses.map((response) =>
                response.requestId === requestId
                    ? { ...response, audit, loadingAudit: false }
                    : response
            )
        })),

    /** Set loading audit */
    setLoadingAudit: (requestId, loading) =>
        set((state) => ({
            responses: state.responses.map((response) =>
                response.requestId === requestId ? { ...response, loadingAudit: loading } : response
            )
        })),

    /** Cancel a response */
    cancelResponse: (requestId) =>
        set((state) => {
            const response = state.responses.find((response) => response.requestId === requestId);
            if (response?.controller) response.controller.abort();

            return {
                responses: state.responses.filter((response) => response.requestId !== requestId)
            };
        }),

    /** Remove a response */
    removeResponse: (requestId) =>
        set((state) => ({
            responses: state.responses.filter((response) => response.requestId !== requestId)
        })),

    /** Remove multiple responses */
    removeResponses: (requestIds) =>
        set((state) => ({
            responses: state.responses.filter(
                (response) => !requestIds.includes(response.requestId)
            )
        })),

    /** Clear all responses */
    clearResponses: () =>
        set((state) => {
            // Cancel all pending requests before clearing
            state.responses.forEach((response) => {
                if (response.controller) response.controller.abort();
            });
            return { responses: [] };
        })
}));
