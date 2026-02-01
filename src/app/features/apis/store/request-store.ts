/** Imported modules */
import { create } from "zustand/react";
import type { Request } from "../utils/types.ts";
import { AUTO_HEADERS } from "../utils/data.ts";

/** Request pending changes type */
type RequestPendingChanges = Partial<Omit<Request, "_id" | "name">>;

/** Request state type */
type RequestState = {
    original: Request;
    pendingChanges: RequestPendingChanges;
    status: "synced" | "unsynced" | "new";
};

/** Request store type */
type RequestStore = {
    requests: RequestState[];

    // Request operations
    addRequest: (request: Request) => void;
    addUntitledRequest: () => Request;
    renameRequest: (id: string, newName: string) => void;
    removeRequest: (id: string) => void;
    removeRequests: (ids: string[]) => void;

    // Pending changes operations
    addPendingChange: (id: string, change: RequestPendingChanges) => void;
    commitPendingChanges: (id: string) => void;
    commitNewRequest: (id: string) => void;
};

/** Request store */
export const useRequestStore = create<RequestStore>((set) => ({
    requests: [],

    /** Add a request */
    addRequest: (request) =>
        set((state) => ({
            requests: [
                ...state.requests,
                { original: request, pendingChanges: {}, status: "synced" }
            ]
        })),

    /** Add a new untitled request */
    addUntitledRequest: () => {
        const request = {
            _id: crypto.randomUUID(),
            name: "Untitled Request",
            method: "GET" as const,
            url: "",
            queryParams: [{ enabled: false, key: "", value: "", description: "" }],
            headers: [
                ...AUTO_HEADERS,
                { enabled: false, key: "", value: "", description: "", auto: false }
            ],
            body: { type: "none" as const, value: "" }
        };
        set((state) => ({
            requests: [...state.requests, { original: request, pendingChanges: {}, status: "new" }]
        }));

        return request;
    },

    /** Rename a request */
    renameRequest: (id, newName) =>
        set((state) => ({
            requests: state.requests.map((request) =>
                request.original._id === id
                    ? {
                          ...request,
                          original: { ...request.original, name: newName }
                      }
                    : request
            )
        })),

    /** Remove a request */
    removeRequest: (id) =>
        set((state) => ({
            requests: state.requests.filter((request) => request.original._id !== id)
        })),

    /** Remove multiple requests */
    removeRequests: (ids) =>
        set((state) => ({
            requests: state.requests.filter((request) => !ids.includes(request.original._id))
        })),

    /** Add pending change to a request (only one field at a time) */
    addPendingChange: (id, change) =>
        set((state) => {
            const request = state.requests.find((request) => request.original._id === id);
            if (!request) return {};

            const keys = Object.keys(change) as (keyof RequestPendingChanges)[];
            if (keys.length !== 1) return {};

            const key = keys[0];
            const newValue = change[key];
            const originalValue = request.original[key];

            // Check if the value is changed (deep comparison for objects/arrays)
            const isEqual =
                newValue === originalValue ||
                JSON.stringify(newValue) === JSON.stringify(originalValue);

            // Handle new request directly
            if (request.status === "new") {
                if (isEqual) return {};
                return {
                    requests: state.requests.map((request) =>
                        request.original._id === id
                            ? { ...request, original: { ...request.original, [key]: newValue } }
                            : request
                    )
                };
            }

            // Next pending changes
            const previousPending = request.pendingChanges;
            let nextPending = previousPending;

            if (isEqual) {
                if (key in previousPending) {
                    const { [key]: _value, ...rest } = previousPending;
                    nextPending = rest;
                }
            } else {
                if (previousPending[key] !== newValue)
                    nextPending = { ...previousPending, [key]: newValue };
            }

            if (previousPending === nextPending) return {};

            // Next status
            const nextStatus = Object.keys(nextPending).length > 0 ? "unsynced" : "synced";

            return {
                requests: state.requests.map((request) =>
                    request.original._id === id
                        ? { ...request, pendingChanges: nextPending, status: nextStatus }
                        : request
                )
            };
        }),

    /** Commit pending changes to original */
    commitPendingChanges: (id) =>
        set((state) => ({
            requests: state.requests.map((request) =>
                request.original._id === id
                    ? {
                          ...request,
                          original: { ...request.original, ...request.pendingChanges },
                          pendingChanges: {},
                          status: "synced"
                      }
                    : request
            )
        })),

    /** Commit new request (mark as synced) */
    commitNewRequest: (id) =>
        set((state) => ({
            requests: state.requests.map((request) =>
                request.original._id === id
                    ? { ...request, pendingChanges: {}, status: "synced" }
                    : request
            )
        }))
}));
