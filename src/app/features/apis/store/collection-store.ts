/** Imported modules */
import { create } from "zustand/react";
import type { CollectionNode, FolderNode, RequestNode } from "../utils/types.ts";

/** Request node location type */
type RequestNodeLocation = {
    collectionId: string;
    collectionName: string;
    folderId: string | null;
    folderName: string | null;
};

/** Request node updates type */
type RequestNodeUpdates = Partial<Pick<RequestNode, "method" | "name">>;

/** Collection store type */
type CollectionStore = {
    collections: CollectionNode[];

    // Collection node operations
    setCollectionNodes: (collectionNodes: CollectionNode[]) => void;
    addCollectionNode: (collectionNode: CollectionNode) => void;
    renameCollectionNode: (id: string, newName: string) => void;
    removeCollectionNode: (id: string) => void;

    // Folder node operations
    addFolderNode: (id: string, folderNode: FolderNode) => void;
    renameFolderNode: (id: string, folderId: string, newName: string) => void;
    removeFolderNode: (id: string, folderId: string) => void;

    // Request node operations
    getRequestNodeLocation: (requestId: string) => RequestNodeLocation | null;
    addRequestNode: (id: string, folderId: string | null, requestNode: RequestNode) => void;
    updateRequestNode: (id: string, requestId: string, updates: RequestNodeUpdates) => void;
    removeRequestNode: (id: string, requestId: string) => void;

    // Clear operations
    clearCollections: () => void;
};

/** Collection store */
export const useCollectionStore = create<CollectionStore>((set, get) => ({
    collections: [],

    /** Set all the collection nodes */
    setCollectionNodes: (collectionNodes) => set(() => ({ collections: collectionNodes })),

    /** Add a new collection node */
    addCollectionNode: (collectionNode) =>
        set((state) => ({ collections: [...state.collections, collectionNode] })),

    /** Rename a collection node */
    renameCollectionNode: (id, newName) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id ? { ...collection, name: newName } : collection
            )
        })),

    /** Remove a collection node */
    removeCollectionNode: (id) =>
        set((state) => ({
            collections: state.collections.filter((collection) => collection._id !== id)
        })),

    /** Add a new folder node */
    addFolderNode: (id, folderNode) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? { ...collection, children: [...collection.children, folderNode] }
                    : collection
            )
        })),

    /** Rename a folder node */
    renameFolderNode: (id, folderId, newName) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: collection.children.map((child) =>
                              child.type === "folder" && child._id === folderId
                                  ? { ...child, name: newName }
                                  : child
                          )
                      }
                    : collection
            )
        })),

    /** Remove a folder node */
    removeFolderNode: (id, folderId) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: collection.children.filter(
                              (child) => !(child.type === "folder" && child._id === folderId)
                          )
                      }
                    : collection
            )
        })),

    /** Get the request node location (collectionId and folderId) */
    getRequestNodeLocation: (requestId) => {
        const { collections } = get();

        for (const collection of collections) {
            for (const child of collection.children) {
                if (child.type === "request" && child._id === requestId)
                    return {
                        collectionId: collection._id,
                        collectionName: collection.name,
                        folderId: null,
                        folderName: null
                    };

                if (child.type === "folder")
                    for (const req of child.children)
                        if (req._id === requestId)
                            return {
                                collectionId: collection._id,
                                collectionName: collection.name,
                                folderId: child._id,
                                folderName: child.name
                            };
            }
        }

        return null;
    },

    /** Add a request node */
    addRequestNode: (id, folderId, requestNode) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: folderId
                              ? collection.children.map((child) =>
                                    child.type === "folder" && child._id === folderId
                                        ? { ...child, children: [...child.children, requestNode] }
                                        : child
                                )
                              : [...collection.children, requestNode]
                      }
                    : collection
            )
        })),

    /** Update a request node */
    updateRequestNode: (id, requestId, updates) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: collection.children.map((child) => {
                              // Request at root level
                              if (child.type === "request")
                                  return child._id === requestId ? { ...child, ...updates } : child;

                              // Request inside folder
                              return {
                                  ...child,
                                  children: child.children.map((req) =>
                                      req._id === requestId ? { ...req, ...updates } : req
                                  )
                              };
                          })
                      }
                    : collection
            )
        })),

    /** Remove a request node */
    removeRequestNode: (id, requestId) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: collection.children.filter((child) => {
                              // Request at root level
                              if (child.type === "request") return child._id !== requestId;

                              // Requests inside folder
                              child.children = child.children.filter(
                                  (req) => req._id !== requestId
                              );

                              return true;
                          })
                      }
                    : collection
            )
        })),

    /** Clean all the collections */
    clearCollections: () => set(() => ({ collections: [] }))
}));
