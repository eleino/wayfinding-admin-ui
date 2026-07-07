import { useSelectionStore } from "storage/store";
import type { SearchParams } from "@schemas/router.schema";

export interface BreadcrumbItem {
    id: string;
    to: string;
    label: string;
    condition: boolean;
    getSearch?: () => SearchParams;
    onNavigate?: () => void;
    isCurrentPage?: boolean;
}

export const buildBreadcrumbs = (basePath: string, search: SearchParams, currentPageLabel?: string) => {
    // console.log("buildBreadcrumbs called with basePath:", basePath, "search:", search, "currentPageLabel:", currentPageLabel);
    const store = useSelectionStore.getState();
    const matchedOrg = store.orgList.find((org) => org.id === search.orgId);
    const matchedSite = store.siteList.find((site) => site.id === search.siteId);
    const matchedBuilding = store.buildingList.find((building) => building.id === search.buildingId);

    return [
        {
            id: 'crumb-home',
            to: basePath,
            label: 'Home',
            condition: true,
            getSearch: () => ({}),
            onNavigate: () => {
                useSelectionStore.setState({
                    orgId: undefined,
                    siteId: undefined,
                    buildingId: undefined,
                });
            },
        },
        {
        id: 'crumb-org',
        to: basePath,
        label: matchedOrg?.name || `Organization ${search.orgId}`,
        condition: !!search.orgId,
        getSearch: () => ({ orgId: search.orgId }),
        onNavigate: () => {
            useSelectionStore.setState({
                siteId: undefined,
                buildingId: undefined,
            });
        },
    },
    {
        id: 'crumb-site',
        to: basePath,
        label: matchedSite?.name || `Site ${search.siteId}`,
        condition: !!search.siteId,
        getSearch: () => ({ orgId: search.orgId, siteId: search.siteId }),
        onNavigate: () => {
            useSelectionStore.setState({
                buildingId: undefined,
            });
        },
    },
    {
        id: 'crumb-building',
        to: basePath,
        label: matchedBuilding?.name || `Building ${search.buildingId}`,
        condition: !!search.buildingId,
        getSearch: () => ({ orgId: search.orgId, siteId: search.siteId, buildingId: search.buildingId }),
        
    },
    {
        id: 'crumb-current',
        to: "",
        label: currentPageLabel,
        condition: !!currentPageLabel,
        isCurrentPage: true,
    }
    ]

}
