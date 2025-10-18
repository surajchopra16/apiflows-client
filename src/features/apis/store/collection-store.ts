/** Imported modules */
import { create } from "zustand/react";
import type { CollectionNode, FolderNode, RequestNode } from "../utils/types.ts";

/** Collection store type */
type CollectionStore = {
    collections: CollectionNode[];
    setCollections: (collections: CollectionNode[]) => void;
    addCollection: (collection: CollectionNode) => void;
    renameCollection: (id: string, newName: string) => void;
    removeCollection: (id: string) => void;
    addFolder: (id: string, folder: FolderNode) => void;
    renameFolder: (id: string, folderId: string, newName: string) => void;
    removeFolder: (id: string, folderId: string) => void;
    addRequestToCollection: (id: string, request: RequestNode) => void;
    addRequestToFolder: (id: string, folderId: string, request: RequestNode) => void;
    renameRequest: (id: string, requestId: string, newName: string) => void;
    removeRequest: (id: string, requestId: string) => void;
};

/** Collection store */
export const useCollectionStore = create<CollectionStore>((set) => ({
    collections: [],

    /** Set all the collections */
    setCollections: (collections) => set(() => ({ collections })),

    /** Add a new collection */
    addCollection: (collection) =>
        set((state) => ({ collections: [...state.collections, collection] })),

    /** Rename a collection */
    renameCollection: (id, newName) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id ? { ...collection, name: newName } : collection
            )
        })),

    /** Remove a collection */
    removeCollection: (id) =>
        set((state) => ({
            collections: state.collections.filter((collection) => collection._id !== id)
        })),

    /** Add a folder to a collection */
    addFolder: (id, folder) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? { ...collection, children: [...collection.children, folder] }
                    : collection
            )
        })),

    /** Rename a folder in a collection */
    renameFolder: (id, folderId, newName) =>
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

    /** Remove a folder from a collection */
    removeFolder: (id, folderId) =>
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

    /** Add a request to a collection */
    addRequestToCollection: (id, request) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? { ...collection, children: [...collection.children, request] }
                    : collection
            )
        })),

    /** Add a request to a folder in a collection */
    addRequestToFolder: (id, folderId, request) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: collection.children.map((child) =>
                              child.type === "folder" && child._id === folderId
                                  ? { ...child, children: [...child.children, request] }
                                  : child
                          )
                      }
                    : collection
            )
        })),

    /** Rename a request in a collection or folder */
    renameRequest: (id, requestId, newName) =>
        set((state) => ({
            collections: state.collections.map((collection) =>
                collection._id === id
                    ? {
                          ...collection,
                          children: collection.children.map((child) => {
                              // Request at root level
                              if (child.type === "request")
                                  return child._id === requestId
                                      ? { ...child, name: newName }
                                      : child;

                              // Request inside folder
                              return {
                                  ...child,
                                  children: child.children.map((req) =>
                                      req._id === requestId ? { ...req, name: newName } : req
                                  )
                              };
                          })
                      }
                    : collection
            )
        })),

    /** Remove a request from a collection or folder */
    removeRequest: (id, requestId) =>
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
        }))
}));
