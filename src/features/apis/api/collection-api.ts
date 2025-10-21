/** Imported modules */
import type { CollectionNode, FolderNode } from "../utils/types.ts";

/** Base URL for the API */
const BASE_URL = "http://localhost:8080";

/**
 * ==================== Collection ====================>
 */

/** Get the collections */
const getCollections = async (): Promise<CollectionNode[]> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/collections`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to fetch collections");

        return result.data.collections;
    } catch (err) {
        console.error("Error fetching request:", err);
        throw err;
    }
};

/** Create a new collection */
const createCollection = async (collection: { name: string }): Promise<CollectionNode> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/collections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(collection)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to create collection");

        return result.data.collection;
    } catch (err) {
        console.error("Error creating request:", err);
        throw err;
    }
};

/** Rename an existing collection */
const renameCollection = async (collectionId: string, update: { newName: string }) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/collections/${collectionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to update collection");
    } catch (err) {
        console.error("Error updating request:", err);
        throw err;
    }
};

/** Delete a collection */
const deleteCollection = async (collectionId: string): Promise<string[]> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/collections/${collectionId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to delete collection");

        return result.data.requestIds;
    } catch (err) {
        console.error("Error deleting request:", err);
        throw err;
    }
};

/**
 * ==================== Folder ====================>
 */

/** Create a new folder */
const createFolder = async (
    collectionId: string,
    folder: { name: string }
): Promise<FolderNode> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/collections/${collectionId}/folders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(folder)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to create folder");

        return result.data.folder;
    } catch (err) {
        console.error("Error creating folder:", err);
        throw err;
    }
};

/** Rename a folder */
const renameFolder = async (
    collectionId: string,
    folderId: string,
    update: { newName: string }
) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/collections/${collectionId}/folders/${folderId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(update)
            }
        );
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to update folder");
    } catch (err) {
        console.error("Error updating folder:", err);
        throw err;
    }
};

/** Delete a folder */
const deleteFolder = async (collectionId: string, folderId: string): Promise<string[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/collections/${collectionId}/folders/${folderId}`,
            { method: "DELETE", headers: { "Content-Type": "application/json" } }
        );
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "Failed to delete folder");

        return result.data.requestIds;
    } catch (err) {
        console.error("Error deleting folder:", err);
        throw err;
    }
};

export const collectionAPI = {
    getCollections,
    createCollection,
    renameCollection,
    deleteCollection,
    createFolder,
    renameFolder,
    deleteFolder
};
