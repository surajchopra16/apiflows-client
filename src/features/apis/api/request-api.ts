/** Imported modules */
import type { Request, RequestNode } from "../utils/types.ts";

/** Base URL for the API */
const BASE_URL = "http://localhost:8080";

/** Get a request by ID */
const getRequest = async (requestId: string): Promise<Request> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/requests/${requestId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to fetch request");

        return result.data.request;
    } catch (err) {
        console.error("Error fetching request:", err);
        throw err;
    }
};

/** Create a new request */
const createRequest = async (data: {
    collectionId: string;
    folderId: string | null;
    request: Omit<Request, "_id">;
}): Promise<{ request: Request; requestNode: RequestNode }> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to create request");

        return result.data;
    } catch (err) {
        console.error("Error creating request:", err);
        throw err;
    }
};

/** Update an existing request */
const updateRequest = async (
    requestId: string,
    data: { collectionId: string; folderId: string | null; updates: Partial<Omit<Request, "_id">> }
): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/requests/${requestId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to update request");
    } catch (err) {
        console.error("Error updating request:", err);
        throw err;
    }
};

/** Delete a request */
const deleteRequest = async (
    requestId: string,
    data: { collectionId: string; folderId: string | null }
): Promise<void> => {
    try {
        const url = new URL(`${BASE_URL}/api/v1/requests/${requestId}`);

        url.searchParams.append("collectionId", data.collectionId);
        if (data.folderId) url.searchParams.append("folderId", data.folderId);

        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to delete request");
    } catch (err) {
        console.error("Error deleting request:", err);
        throw err;
    }
};

export const requestAPI = { getRequest, createRequest, updateRequest, deleteRequest };
