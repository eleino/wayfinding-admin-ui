// LocationsSelections.tsx
// selection component for locations, with dropdowns for org, site, building
import { useState } from "react";
import { useGetOrganisations } from "@hooks/useOrganisations";
import { useGetBuildings } from "@hooks/useBuildings";
import { useGetSites } from "@hooks/useSites";
import { ListLocations } from "./ListLocations";

export const LocationsSelections = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null,
  );
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const orgs = useGetOrganisations();
  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = Number(e.target.value);
    setSelectedOrgId(orgId);
    setSelectedSiteId(null);
    setSelectedBuildingId(null);
  };
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = Number(e.target.value);
    setSelectedSiteId(siteId);
    setSelectedBuildingId(null);
  };
  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const buildingId = Number(e.target.value);
    setSelectedBuildingId(buildingId);
  };
  const sites = useGetSites(selectedOrgId, { enabled: !!selectedOrgId });
  const buildings = useGetBuildings(selectedSiteId, {
    enabled: !!selectedSiteId
  });


  return (
    <div>
      <div className="selectionForm">
        <label htmlFor="orgSelect">Organization:</label>
        <select value={selectedOrgId || ""} onChange={handleOrgChange}>
          <option value="">Select Organization</option>
          {orgs.data?.map((org) => (
            console.log("Org in selection", org),
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <label htmlFor="siteSelect">Site:</label>
        <select value={selectedSiteId || ""} onChange={handleSiteChange} disabled={!selectedOrgId}>
          <option value="">Select Site</option>
          {sites.data?.map((site) => (
                console.log("Site in selection", site),
            <option key={site.id} value={site.id}>
              {site.address}
            </option>
          ))}
        </select>

        <label htmlFor="buildingSelect">Building:</label>
        <select value={selectedBuildingId || ""} onChange={handleBuildingChange} disabled={!selectedSiteId && !buildings.isLoading}>
          <option value="">Select Building</option>
          { buildings.data?.map((building) => (
            console.log("Building in selection", building),

            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
        <ListLocations buildingId={selectedBuildingId} />
      </div>
    </div>
  );
};
