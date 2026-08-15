import { useState, type ReactNode } from "react";
import {
  useDeleteOrganisation,
  useGetOrganisationById,
  useGetOrganisations,
} from "@hooks/useOrganisations";
import { useDeleteSite, useGetSiteById } from "@hooks/useSites";
import { useDeleteBuilding, useGetBuildingById } from "@hooks/useBuildings";
import { useGetAllImagesByType } from "@hooks/useImages";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
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

const DetailsLayout = ({
  children,
  imageUrl,
  imageAlt,
}: {
  children: ReactNode;
  imageUrl?: string;
  imageAlt: string;
}) => (
  <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
    <dl>{children}</dl>
    <aside className="flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-border-grey bg-black/30 p-3">
      {imageUrl ? (
        <img src={imageUrl} alt={imageAlt} className="max-h-64 w-full object-contain" />
      ) : (
        <p className="text-center text-sm text-gray-500">No image selected</p>
      )}
    </aside>
  </div>
);

export const EntityModal = ({ entity, entityId, mode, onClose }: EntityModalProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const organisation = useGetOrganisationById(
    entity === "organisation" ? entityId : null,
    { enabled: entity === "organisation" },
  );
  const site = useGetSiteById(entity === "site" ? entityId : null);
  const building = useGetBuildingById(entity === "building" ? entityId : null);
  const organisations = useGetOrganisations({ enabled: entity === "building" && mode === "edit" });
  const deleteOrganisation = useDeleteOrganisation();
  const deleteSite = useDeleteSite();
  const deleteBuilding = useDeleteBuilding();

  const activeQuery =
    entity === "organisation" ? organisation : entity === "site" ? site : building;
  const imageType = entity === "organisation" ? "logo" : entity;
  const images = useGetAllImagesByType(imageType, { enabled: !!activeQuery.data });
  const imageKey =
    entity === "organisation"
      ? organisation.data?.settings?.logo_image_key_light ||
        organisation.data?.settings?.logo_image_key_dark
      : entity === "site"
        ? site.data?.site.img_site_key
        : building.data?.building.img_building_key;
  const imageUrl = images.data?.data.find((image) => image.key === imageKey)?.url;

  const deletionBlockReason =
    entity === "organisation"
      ? organisation.data && (organisation.data.meta.sites.total > 0 || organisation.data.children.length > 0)
        ? "This organisation cannot be deleted while it has sites or child organisations."
        : undefined
      : entity === "site"
        ? site.data && site.data.meta.buildings.total > 0
          ? "This site cannot be deleted while it has buildings."
          : undefined
        : building.data && (building.data.meta.locations.total > 0 || building.data.meta.paths.total > 0)
          ? "This building cannot be deleted while it has locations or paths."
          : undefined;
  
  const isDeleting =
    entity === "organisation"
      ? deleteOrganisation.isPending
      : entity === "site"
        ? deleteSite.isPending
        : deleteBuilding.isPending;
  const deleteError =
    entity === "organisation"
      ? deleteOrganisation.error
      : entity === "site"
        ? deleteSite.error
        : deleteBuilding.error;

  const title = `${mode === "edit" ? "Edit" : "View"} ${entity}`;

  const handleDelete = () => {
    if (entity === "organisation") {
      deleteOrganisation.mutate(entityId, { onSuccess: onClose });
    } else if (entity === "site") {
      deleteSite.mutate(entityId, { onSuccess: onClose });
    } else {
      deleteBuilding.mutate(entityId, { onSuccess: onClose });
    }
  };

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
            &times;
          </button>
        </div>

        {activeQuery.isLoading && <p className="py-12 text-center text-gray-400">Loading details…</p>}
        {activeQuery.isError && (
          <p className="py-12 text-center text-red-300" role="alert">
            These details could not be loaded.
          </p>
        )}

        {mode === "view" && entity === "organisation" && organisation.data && (
          <DetailsLayout imageUrl={imageUrl} imageAlt={`${organisation.data.organization.name} logo`}>
            <DetailRow label="Name" value={organisation.data.organization.name} />
            <DetailRow label="Slug" value={organisation.data.organization.slug} />
            <DetailRow label="Sites" value={organisation.data.meta.sites.total} />
            <DetailRow label="Child organisations" value={organisation.data.children.length} />
          </DetailsLayout>
        )}
        {mode === "view" && entity === "site" && site.data && (
          <DetailsLayout imageUrl={imageUrl} imageAlt={`${site.data.site.name} image`}>
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
          </DetailsLayout>
        )}
        {mode === "view" && entity === "building" && building.data && (
          <DetailsLayout imageUrl={imageUrl} imageAlt={`${building.data.building.name} image`}>
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
          </DetailsLayout>
        )}

        {mode === "view" && activeQuery.data && (
          <div className="mt-6 border-t border-border-grey pt-5">
            {deletionBlockReason && (
              <p className="mb-3 text-sm text-gray-400">{deletionBlockReason}</p>
            )}
            <button
              type="button"
              disabled={Boolean(deletionBlockReason) || isDeleting}
              title={deletionBlockReason}
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete {entity}
            </button>
          </div>
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

        {showDeleteDialog && (
          <DeleteDialog
            itemName={
              entity === "organisation"
                ? organisation.data?.organization.name ?? `organisation ${entityId}`
                : entity === "site"
                  ? site.data?.site.name ?? `site ${entityId}`
                  : building.data?.building.name ?? `building ${entityId}`
            }
            onConfirm={handleDelete}
            onCancel={() => {
              if (!isDeleting) setShowDeleteDialog(false);
            }}
            isPending={isDeleting}
            error={deleteError}
          />
        )}
      </section>
    </div>
  );
};
