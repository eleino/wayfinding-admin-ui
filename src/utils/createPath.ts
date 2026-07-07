// // creates path params based on saved selections
// export const createPath = (basePath: string, orgId?: number, siteId?: number, buildingId?: number, locationId?: number, pathId?: number) => {
//   let path = basePath;
//   const params = new URLSearchParams();
//   if (orgId) {
//     params.append("orgId", orgId.toString());
//   }
//   if (siteId) {
//     params.append("siteId", siteId.toString());
//   }
//   if (buildingId) {
//     params.append("buildingId", buildingId.toString());
//   }
//   if (locationId) {
//     params.append("locationId", locationId.toString());
//   }
//   if (pathId) {
//     params.append("pathId", pathId.toString());
//   }

//   const queryString = params.toString();
//   if (queryString) {
//     path += `?${queryString}`;
//   }
//   return path;
// };