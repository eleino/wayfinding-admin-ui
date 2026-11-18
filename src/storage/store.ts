import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectionListItem {
    id: number;
    name: string;
}

type SelectionListsByParentId = Record<number, SelectionListItem[]>;

interface SelectionState {
    orgId: number | undefined;
    siteId: number | undefined;
    buildingId: number | undefined;
    locationId: number | undefined;
    pathId: number | undefined;
    orgList: SelectionListItem[]; // List of organizations
    siteListsByOrgId: SelectionListsByParentId;
    buildingListsBySiteId: SelectionListsByParentId;
    pathList: SelectionListItem[]; // List of paths
    setOrgId: (orgId: number | undefined) => void;
    setSiteId: (siteId: number | undefined) => void;
    setBuildingId: (buildingId: number | undefined) => void;
    setLocationId: (locationId: number | undefined) => void;
    setPathId: (pathId: number | undefined) => void;
    setOrgList: (orgList: SelectionListItem[]) => void;
    setSiteList: (orgId: number, siteList: SelectionListItem[]) => void;
    setBuildingList: (siteId: number, buildingList: SelectionListItem[]) => void;
    setPathList: (pathList: SelectionListItem[]) => void;
}

interface LegacySelectionState {
    orgId?: number;
    siteId?: number;
    siteList?: SelectionListItem[];
    buildingList?: SelectionListItem[];
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
            siteListsByOrgId: {},
            buildingListsBySiteId: {},
            pathList: [],
            setOrgId: (orgId) => set({
                orgId,
                siteId: undefined,
                buildingId: undefined,
                locationId: undefined,
                pathId: undefined,
                pathList: [],
            }),
            setSiteId: (siteId) => set({
                siteId,
                buildingId: undefined,
                locationId: undefined,
                pathId: undefined,
                pathList: [],
            }),
            setBuildingId: (buildingId) => set({
                buildingId,
                locationId: undefined,
                pathId: undefined,
                pathList: [],
            }),
            setLocationId: (locationId) => set({ locationId }),
            setPathId: (pathId) => set({ pathId }),
            setOrgList: (orgList) => set({ orgList }),
            setSiteList: (orgId, siteList) => set((state) => ({
                siteListsByOrgId: {
                    ...state.siteListsByOrgId,
                    [orgId]: siteList,
                },
            })),
            setBuildingList: (siteId, buildingList) => set((state) => ({
                buildingListsBySiteId: {
                    ...state.buildingListsBySiteId,
                    [siteId]: buildingList,
                },
            })),
            setPathList: (pathList) => set({ pathList }),
        }),
        {
            name: 'selection-storage', // name of the item in storage
            version: 1,
            migrate: (persistedState, version) => { // adding migration since we are changing the structure of the state
                if (version >= 1) return persistedState as SelectionState;

                const legacyState = persistedState as LegacySelectionState;
                const { siteList, buildingList, ...state } = legacyState;

                return {
                    ...state,
                    siteListsByOrgId:
                        legacyState.orgId && Array.isArray(siteList)
                            ? { [legacyState.orgId]: siteList }
                            : {},
                    buildingListsBySiteId:
                        legacyState.siteId && Array.isArray(buildingList)
                            ? { [legacyState.siteId]: buildingList }
                            : {},
                } as SelectionState;
            },
        }
    )
);
