// localStorage.ts
export const localStorageKey = {
    selectedOrgId: "selectedOrgId",
    selectedSiteId: "selectedSiteId",
    selectedBuildingId: "selectedBuildingId",
    recentLocationIds: "recentLocationIds",
    recentImageKeys: "recentImageKeys",
    recentPathIds: "recentPathIds",
    locationFormData: "locationFormData",
    imageFormData: "imageFormData",
    pathFormData: "pathFormData",
};

export const saveToLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const removeFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
    localStorage.clear();
};

export const saveSelectedOrgId = (orgId: number) => {
    saveToLocalStorage(localStorageKey.selectedOrgId, orgId.toString());
};

export const getSelectedOrgId = (): number | null => {
    const value = getFromLocalStorage(localStorageKey.selectedOrgId);
    return value ? Number(value) : null;
};

export const saveSelectedSiteId = (siteId: number) => {
    saveToLocalStorage(localStorageKey.selectedSiteId, siteId.toString());
};

export const getSelectedSiteId = (): number | null => {
    const value = getFromLocalStorage(localStorageKey.selectedSiteId);
    return value ? Number(value) : null;
};

export const saveSelectedBuildingId = (buildingId: number) => {
    saveToLocalStorage(localStorageKey.selectedBuildingId, buildingId.toString());
};

export const getSelectedBuildingId = (): number | null => {
    const value = getFromLocalStorage(localStorageKey.selectedBuildingId);
    return value ? Number(value) : null;
};

export const saveRecentLocationIds = (locationIds: number[]) => {
    // Save last 5 location IDs to local storage
    const recentIds = locationIds.slice(-5);
    saveToLocalStorage(localStorageKey.recentLocationIds, JSON.stringify(recentIds));
};

export const getRecentLocationIds = (): number[] => {
    const value = getFromLocalStorage(localStorageKey.recentLocationIds);
    return value ? JSON.parse(value) : [];
};

export const saveRecentImageKeys = (imageKeys: string[]) => {
    // Save last 5 image keys to local storage
    const recentKeys = imageKeys.slice(-5);
    saveToLocalStorage(localStorageKey.recentImageKeys, JSON.stringify(recentKeys));
};

export const getRecentImageKeys = (): string[] => {
    const value = getFromLocalStorage(localStorageKey.recentImageKeys);
    return value ? JSON.parse(value) : [];
};

export const saveRecentPathIds = (pathIds: number[]) => {
    // Save last 5 path IDs to local storage
    const recentIds = pathIds.slice(-5);
    saveToLocalStorage(localStorageKey.recentPathIds, JSON.stringify(recentIds));
};

export const getRecentPathIds = (): number[] => {
    const value = getFromLocalStorage(localStorageKey.recentPathIds);
    return value ? JSON.parse(value) : [];
};

// TODO: update from 'any' to a proper type/interface for the location form data
export const saveLocationFormData = (formData: any) => {
    saveToLocalStorage(localStorageKey.locationFormData, JSON.stringify(formData));
};

export const getLocationFormData = () => {
    const value = getFromLocalStorage(localStorageKey.locationFormData);
    return value ? JSON.parse(value) : null;
};

// TODO: update from 'any' to a proper type/interface for the image form data
export const saveImageFormData = (formData: any) => {
    saveToLocalStorage(localStorageKey.imageFormData, JSON.stringify(formData));
};

export const getImageFormData = () => {
    const value = getFromLocalStorage(localStorageKey.imageFormData);
    return value ? JSON.parse(value) : null;
};

// TODO: update from 'any' to a proper type/interface for the path form data
export const savePathFormData = (formData: any) => {
    saveToLocalStorage(localStorageKey.pathFormData, JSON.stringify(formData));
};

export const getPathFormData = () => {
    const value = getFromLocalStorage(localStorageKey.pathFormData);
    return value ? JSON.parse(value) : null;
};
