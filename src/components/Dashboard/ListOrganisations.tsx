import { useState } from "react";
import { useGetOrganisationById, useGetOrganisations } from "@hooks/useOrganisations";
import { useGetSites } from "@hooks/useSites";
import { useGetBuildings } from "@hooks/useBuildings";
import { useSelectionStore } from "@storage/store";
import { EntityCard } from "./EntityCard";
import {
  EntityModal,
  type DashboardEntity,
  type DashboardModalMode,
} from "./EntityModal";
import { NewEntityModal } from "./NewEntityModal";

interface OpenModal {
  entity: DashboardEntity;
  entityId: number;
  mode: DashboardModalMode;
}

const SectionState = ({ children }: { children: string }) => (
  <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border-grey text-gray-400">
    {children}
  </div>
);

export const ListOrganisations = () => {
  const orgId = useSelectionStore((state) => state.orgId);
  const siteId = useSelectionStore((state) => state.siteId);
  const buildingId = useSelectionStore((state) => state.buildingId);
  const setOrgId = useSelectionStore((state) => state.setOrgId);
  const setSiteId = useSelectionStore((state) => state.setSiteId);
  const setBuildingId = useSelectionStore((state) => state.setBuildingId);

  const organisations = useGetOrganisations();
  const sites = useGetSites(orgId ?? null);
  const orgSites = useGetOrganisationById(orgId ?? null, { enabled: !!orgId });
  const buildings = useGetBuildings(siteId ?? null, { enabled: !!siteId });
  const [openModal, setOpenModal] = useState<OpenModal | null>(null);
  const [newEntity, setNewEntity] = useState<DashboardEntity | null>(null);

  const showModal = (
    entity: DashboardEntity,
    entityId: number,
    mode: DashboardModalMode,
  ) => setOpenModal({ entity, entityId, mode });

  const getSiteData = (siteId: number, field: "address" | "image_url") => {
    return sites.data?.find((s) => s.id === siteId)?.[field] || "";
  }

  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="organisations-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 id="organisations-heading" className="text-2xl font-semibold">
              Organisations
            </h2>
          <p className="mt-1 text-sm text-gray-400">
            Select an organisation to browse its sites.
          </p>
          </div>
          <button
            type="button"
            onClick={() => setNewEntity("organisation")}
            disabled={!orgId}
            title={!orgId ? "Select an organisation first" : undefined}
            className="cursor-pointer rounded bg-lab-blue px-3 py-2 text-sm font-medium text-white hover:bg-lab-blue/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add organisation
          </button>
        </div>
        {organisations.isLoading && <SectionState>Loading organisations…</SectionState>}
        {organisations.isError && <SectionState>Organisations could not be loaded.</SectionState>}
        {organisations.data?.length === 0 && <SectionState>No organisations found.</SectionState>}
        {organisations.data && organisations.data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {organisations.data.map((organisation) => {
              const id = Number(organisation.id);
              return (
                <EntityCard
                  key={organisation.id}
                  title={organisation.name}
                  subtitle=""
                  imageUrl={organisation.logoUrl}
                  imageAlt={`${organisation.name} logo`}
                  meta={`Organisation ID ${id}`}
                  isSelected={id === orgId}
                  onSelect={() => setOrgId(id)}
                  onView={() => showModal("organisation", id, "view")}
                  onEdit={() => showModal("organisation", id, "edit")}
                />
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="sites-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 id="sites-heading" className="text-2xl font-semibold">
              Sites
            </h2>
          <p className="mt-1 text-sm text-gray-400">
            {orgId ? "Sites belonging to the selected organisation." : "Select an organisation first."}
          </p>
          </div>
          <button
            type="button"
            onClick={() => setNewEntity("site")}
            disabled={!orgId}
            title={!orgId ? "Select an organisation first" : undefined}
            className="cursor-pointer rounded bg-lab-blue px-3 py-2 text-sm font-medium text-white hover:bg-lab-blue/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add site
          </button>
        </div>
        {!orgId && <SectionState>Select an organisation to view sites.</SectionState>}
        {orgId && (sites.isLoading || orgSites.isLoading) && <SectionState>Loading sites…</SectionState>}
        {orgId && (sites.isError || orgSites.isError) && <SectionState>Sites could not be loaded.</SectionState>}
        {orgId && orgSites.data?.sites?.length === 0 && <SectionState>No sites found for this organisation.</SectionState>}
        {orgId && orgSites.data?.sites && orgSites.data.sites.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {orgSites.data.sites.map((site) => (
              <EntityCard
                key={site.id}
                title={site.name}
                subtitle={getSiteData(site.id, "address") || "No address set"}
                imageUrl={getSiteData(site.id, "image_url") || null}
                imageAlt={site.name}
                meta={`Site ID ${site.id}`}
                isSelected={site.id === siteId}
                onSelect={() => setSiteId(site.id)}
                onView={() => showModal("site", site.id, "view")}
                onEdit={() => showModal("site", site.id, "edit")}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="buildings-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 id="buildings-heading" className="text-2xl font-semibold">
              Buildings
            </h2>
          <p className="mt-1 text-sm text-gray-400">
            {siteId ? "Buildings belonging to the selected site." : "Select a site first."}
          </p>
          </div>
          <button
            type="button"
            onClick={() => setNewEntity("building")}
            disabled={!siteId}
            title={!siteId ? "Select a site first" : undefined}
            className="cursor-pointer rounded bg-lab-blue px-3 py-2 text-sm font-medium text-white hover:bg-lab-blue/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add building
          </button>
        </div>
        {!siteId && <SectionState>Select a site to view buildings.</SectionState>}
        {siteId && buildings.isLoading && <SectionState>Loading buildings…</SectionState>}
        {siteId && buildings.isError && <SectionState>Buildings could not be loaded.</SectionState>}
        {siteId && buildings.data?.length === 0 && <SectionState>No buildings found for this site.</SectionState>}
        {buildings.data && buildings.data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {buildings.data.map((building) => {
              const id = Number(building.id);
              return (
                <EntityCard
                  key={building.id}
                  title={building.name}
                  subtitle="Building"
                  imageUrl={building.image_url}
                  imageAlt={building.name}
                  meta={`Building ID ${id}`}
                  isSelected={id === buildingId}
                  onSelect={() => setBuildingId(id)}
                  onView={() => showModal("building", id, "view")}
                  onEdit={() => showModal("building", id, "edit")}
                />
              );
            })}
          </div>
        )}
      </section>

      {openModal && (
        <EntityModal
          {...openModal}
          onClose={() => setOpenModal(null)}
        />
      )}
      {newEntity && (
        <NewEntityModal
          entity={newEntity}
          organisationId={orgId ?? undefined}
          siteId={siteId ?? undefined}
          organisations={organisations.data ?? []}
          onClose={() => setNewEntity(null)}
        />
      )}
    </div>
  );
};
