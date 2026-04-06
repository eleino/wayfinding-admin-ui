import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectionState {
    orgId: number | null;
    siteId: number | null;
    buildingId: number | null;
    setOrgId: (orgId: number | null) => void;
    setSiteId: (siteId: number | null) => void;
    setBuildingId: (buildingId: number | null) => void;
}

export const useSelectionStore = create<SelectionState>()(
    persist(
        (set) => ({
            orgId: null,
            siteId: null,
            buildingId: null,
            setOrgId: (orgId) => set({ orgId }),
            setSiteId: (siteId) => set({ siteId }),
            setBuildingId: (buildingId) => set({ buildingId }),
        }),
        {
            name: 'selection-storage', // name of the item in storage
        }
    )
);