import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectionState {
    orgId: number | null;
    siteId: number | null;
    buildingId: number | null;
    orgList: { id: number; name: string }[]; // List of organizations
    siteList: { id: number; name: string }[]; // List of sites for selected org
    buildingList: { id: number; name: string }[]; // List of buildings for selected site
    setOrgId: (orgId: number | null) => void;
    setSiteId: (siteId: number | null) => void;
    setBuildingId: (buildingId: number | null) => void;
    setOrgList: (orgList: { id: number; name: string }[]) => void;
    setSiteList: (siteList: { id: number; name: string }[]) => void;
    setBuildingList: (buildingList: { id: number; name: string }[]) => void;
}

export const useSelectionStore = create<SelectionState>()(
    persist(
        (set) => ({
            orgId: null,
            siteId: null,
            buildingId: null,
            orgList: [],
            siteList: [],
            buildingList: [],
            setOrgId: (orgId) => set({ orgId }),
            setSiteId: (siteId) => set({ siteId }),
            setBuildingId: (buildingId) => set({ buildingId }),
            setOrgList: (orgList) => set({ orgList }),
            setSiteList: (siteList) => set({ siteList }),
            setBuildingList: (buildingList) => set({ buildingList }),
        }),
        {
            name: 'selection-storage', // name of the item in storage
        }
    )
);