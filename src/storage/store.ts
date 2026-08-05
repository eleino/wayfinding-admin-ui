import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectionState {
    orgId: number | undefined;
    siteId: number | undefined;
    buildingId: number | undefined;
    locationId: number | undefined;
    pathId: number | undefined;
    orgList: { id: number; name: string }[]; // List of organizations
    siteList: { id: number; name: string }[]; // List of sites for selected org
    buildingList: { id: number; name: string }[]; // List of buildings for selected site
    setOrgId: (orgId: number | undefined) => void;
    setSiteId: (siteId: number | undefined) => void;
    setBuildingId: (buildingId: number | undefined) => void;
    setLocationId: (locationId: number | undefined) => void;
    setPathId: (pathId: number | undefined) => void;
    setOrgList: (orgList: { id: number; name: string }[]) => void;
    setSiteList: (siteList: { id: number; name: string }[]) => void;
    setBuildingList: (buildingList: { id: number; name: string }[]) => void;
}

export const useSelectionStore = create<SelectionState>()(
    persist(
        (set) => ({
            orgId: 1, // Default to 1: LUT Group, since all sites are under this org
            siteId: undefined,
            buildingId: undefined,
            locationId: undefined,
            pathId: undefined,
            orgList: [],
            siteList: [],
            buildingList: [],
            setOrgId: (orgId) => set({
                orgId,
                siteId: undefined,
                buildingId: undefined,
                locationId: undefined,
                pathId: undefined,
            }),
            setSiteId: (siteId) => set({
                siteId,
                buildingId: undefined,
                locationId: undefined,
                pathId: undefined,
            }),
            setBuildingId: (buildingId) => set({
                buildingId,
                locationId: undefined,
                pathId: undefined,
            }),
            setLocationId: (locationId) => set({ locationId }),
            setPathId: (pathId) => set({ pathId }),
            setOrgList: (orgList) => set({ orgList }),
            setSiteList: (siteList) => set({ siteList }),
            setBuildingList: (buildingList) => set({ buildingList }),
        }),
        {
            name: 'selection-storage', // name of the item in storage
        }
    )
);
