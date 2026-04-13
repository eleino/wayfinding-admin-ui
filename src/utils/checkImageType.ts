// make sure the requested image type is valid and supported by the backend
export const checkImageType = (type: string): boolean => {
    const validTypes = ["location", "site", "step", "building", "overlay", "logo"];
    return validTypes.includes(type);
}