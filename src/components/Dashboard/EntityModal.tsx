import {
  useGetOrganisationById,
  useGetOrganisations,
} from "@hooks/useOrganisations";
import { useGetSiteById } from "@hooks/useSites";
import { useGetBuildingById } from "@hooks/useBuildings";
import { EntityEditForm } from "./EntityEditForm";

export type DashboardEntity = "organisation" | "site" | "building";
export type DashboardModalMode = "view" | "edit";

interface EntityModalProps {
  entity: DashboardEntity;
  entityId: number;
  mode: DashboardModalMode;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="border-b border-border-grey py-3 last:border-b-0">
    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
    <dd className="mt-1 wrap-break-word">{value}</dd>
  </div>
);

export const EntityModal = ({ entity, entityId, mode, onClose }: EntityModalProps) => {
  const organisation = useGetOrganisationById(
    entity === "organisation" ? entityId : null,
    { enabled: entity === "organisation" },
  );
  const site = useGetSiteById(entity === "site" ? entityId : null);
  const building = useGetBuildingById(entity === "building" ? entityId : null);
  const organisations = useGetOrganisations({ enabled: entity === "building" && mode === "edit" });

  const activeQuery =
    entity === "organisation" ? organisation : entity === "site" ? site : building;

  const title = `${mode === "edit" ? "Edit" : "View"} ${entity}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-modal-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border-grey bg-sidebar-grey p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="entity-modal-title" className="text-2xl font-semibold capitalize">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-400">ID {entityId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="h-9 w-9 cursor-pointer rounded border border-border-grey text-xl hover:border-lab-turquoise hover:text-lab-turquoise"
          >
            ×
          </button>
        </div>

        {activeQuery.isLoading && <p className="py-12 text-center text-gray-400">Loading details…</p>}
        {activeQuery.isError && (
          <p className="py-12 text-center text-red-300" role="alert">
            These details could not be loaded.
          </p>
        )}

        {mode === "view" && entity === "organisation" && organisation.data && (
          <dl className="mt-5">
            <DetailRow label="Name" value={organisation.data.organization.name} />
            <DetailRow label="Slug" value={organisation.data.organization.slug} />
            <DetailRow label="Sites" value={organisation.data.meta.sites.total} />
            <DetailRow label="Child organisations" value={organisation.data.children.length} />
          </dl>
        )}
        {mode === "view" && entity === "site" && site.data && (
          <dl className="mt-5">
            <DetailRow label="Name" value={site.data.site.name} />
            <DetailRow label="Organisation" value={site.data.site.organization} />
            <DetailRow label="Address" value={site.data.site.address || "Not set"} />
            <DetailRow label="Buildings" value={site.data.meta.buildings.total} />
            <DetailRow
              label="Coordinates"
              value={
                site.data.site.latitude && site.data.site.longitude
                  ? `${site.data.site.latitude}, ${site.data.site.longitude}`
                  : "Not set"
              }
            />
          </dl>
        )}
        {mode === "view" && entity === "building" && building.data && (
          <dl className="mt-5">
            <DetailRow label="Name" value={building.data.building.name} />
            <DetailRow label="Floors" value={building.data.building.total_floors} />
            <DetailRow label="Locations" value={building.data.meta.locations.total} />
            <DetailRow label="Paths" value={building.data.meta.paths.total} />
            <DetailRow
              label="Organisation access"
              value={
                building.data.building.allowed_organizations.map((item) => item.name).join(", ") ||
                "None"
              }
            />
          </dl>
        )}

        {mode === "edit" && entity === "organisation" && organisation.data && (
          <EntityEditForm
            entity={entity}
            entityId={entityId}
            data={{
              name: organisation.data.organization.name,
              themeJson: organisation.data.settings?.theme_json,
              lightLogoKey: organisation.data.settings?.logo_image_key_light,
              darkLogoKey: organisation.data.settings?.logo_image_key_dark,
            }}
            onClose={onClose}
          />
        )}
        {mode === "edit" && entity === "site" && site.data && (
          <EntityEditForm
            entity={entity}
            entityId={entityId}
            data={{
              name: site.data.site.name,
              address: site.data.site.address,
              imageKey: site.data.site.img_site_key,
              nameTranslationKey: site.data.site.trl_site_name_key,
              descriptionTranslationKey: site.data.site.trl_site_desc_Key,
              welcomeTranslationKey: site.data.site.trl_site_welcome_msg_key,
            }}
            onClose={onClose}
          />
        )}
        {mode === "edit" && entity === "building" && building.data && (
          <EntityEditForm
            entity={entity}
            entityId={entityId}
            data={{
              name: building.data.building.name,
              floorCount: building.data.building.total_floors,
              imageKey: building.data.building.img_building_key,
              nameTranslationKey: building.data.building.trl_building_name_key,
              descriptionTranslationKey:
                building.data.building.trl_building_desc_key,
              allowedOrganisations:
                building.data.building.allowed_organizations.map(
                  (item) => item.organization_id,
                ),
              organisations: organisations.data ?? [],
            }}
            onClose={onClose}
          />
        )}
      </section>
    </div>
  );
};
