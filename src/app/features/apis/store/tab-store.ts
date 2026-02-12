/** Imported modules */
import { create } from "zustand/react";

/** Tab store type */
type TabStore = {
    tabIds: string[];
    activeTabId: string | null;
    addTab: (id: string) => void;
    removeTab: (id: string) => void;
    removeTabs: (ids: string[]) => void;
    updateActiveTab: (id: string | null) => void;
    clearTabs: () => void;
};

/** Tab store */
export const useTabStore = create<TabStore>((set) => ({
    tabIds: [],
    activeTabId: null,

    /** Add a tab (if not exists) and set it active */
    addTab: (tab) =>
        set((state) => {
            const exists = state.tabIds.find((t) => t === tab);
            if (exists) return { activeTabId: exists };

            return { tabIds: [...state.tabIds, tab], activeTabId: tab };
        }),

    /** Remove a tab and set the previous tab active */
    removeTab: (id) =>
        set((state) => {
            const { tabIds, activeTabId } = state;

            // Check if the tab exists
            const tabIndex = tabIds.findIndex((tab) => tab === id);
            if (tabIndex === -1) return state;

            // Remove the tab
            const newTabIds = tabIds.filter((tabId) => tabId !== id);

            // Check if the active tab was removed
            if (activeTabId && activeTabId === id) {
                let newActiveTabId = null;
                if (newTabIds.length > 0) {
                    const index = (tabIndex - 1 + newTabIds.length) % newTabIds.length;
                    newActiveTabId = newTabIds[index];
                }
                return { tabIds: newTabIds, activeTabId: newActiveTabId };
            } else {
                return { tabIds: newTabIds };
            }
        }),

    /** Remove multiple tabs and set the previous tab active if needed */
    removeTabs: (ids) =>
        set((state) => {
            const { tabIds, activeTabId } = state;

            // Remove the tabs
            const newTabIds = tabIds.filter((tabId) => !ids.includes(tabId));

            // Check if the active tab was removed
            if (activeTabId && ids.includes(activeTabId)) {
                let newActiveTabId = null;
                if (newTabIds.length > 0) {
                    const activeIndex = tabIds.findIndex((tab) => tab === activeTabId);
                    const index = (activeIndex - 1 + newTabIds.length) % newTabIds.length;
                    newActiveTabId = newTabIds[index];
                }
                return { tabIds: newTabIds, activeTabId: newActiveTabId };
            } else {
                return { tabIds: newTabIds };
            }
        }),

    /** Update the active tab */
    updateActiveTab: (tab) => set(() => ({ activeTabId: tab })),

    /** Clear all the tabs */
    clearTabs: () => set(() => ({ tabIds: [], activeTabId: null }))
}));
