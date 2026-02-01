/** Imported modules */
import { create } from "zustand/react";
import type { UpstreamResponse } from "../utils/types.ts";

/** Response state type */
export type ResponseState = {
    requestId: string;
    data: UpstreamResponse | null;
    loading: boolean;
    error: string | null;
    controller: AbortController | null;
};

/** Response store type */
type ResponseStore = {
    responses: ResponseState[];
    addLoadingResponse: (requestId: string, controller: AbortController) => void;
    addSuccessResponse: (requestId: string, data: UpstreamResponse) => void;
    addErrorResponse: (requestId: string, error: string) => void;
    cancelResponse: (requestId: string) => void;
    removeResponse: (requestId: string) => void;
    removeResponses: (requestIds: string[]) => void;
};

/** Response store */
export const useResponseStore = create<ResponseStore>((set) => ({
    responses: [],

    /** Add a loading response */
    addLoadingResponse: (requestId, controller) =>
        set((state) => ({
            responses: [
                ...state.responses.filter((response) => response.requestId !== requestId),
                { requestId, data: null, loading: true, error: null, controller }
            ]
        })),

    /** Add a success response */
    addSuccessResponse: (requestId, data) =>
        set((state) => ({
            responses: [
                ...state.responses.filter((response) => response.requestId !== requestId),
                { requestId, data, loading: false, error: null, controller: null }
            ]
        })),

    /** Add an error response */
    addErrorResponse: (requestId, error) =>
        set((state) => ({
            responses: [
                ...state.responses.filter((response) => response.requestId !== requestId),
                { requestId, data: null, loading: false, error, controller: null }
            ]
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
        }))
}));
