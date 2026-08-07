import { useState, type SubmitEvent } from "react";
import { useUpdateOrganisation } from "@hooks/useOrganisations";
import { useUpdateSite } from "@hooks/useSites";
import { useUpdateBuilding } from "@hooks/useBuildings";
import type { OrganisationType } from "@apptypes/organisation";
import type { DashboardEntity } from "./EntityModal";

interface EntityEditFormProps {
  entity: DashboardEntity;
  entityId: number;
  initialName: string;
  initialAddress?: string;
  initialFloorCount?: number;
  initialAllowedOrganisations?: number[];
  organisations?: OrganisationType[];
  onClose: () => void;
}

const inputClassName =
  "mt-1 w-full rounded border border-border-grey bg-black px-3 py-2 outline-none focus:border-lab-turquoise";

export const EntityEditForm = ({
  entity,
  entityId,
  initialName,
  initialAddress = "",
  initialFloorCount = 1,
  initialAllowedOrganisations = [],
  organisations = [],
  onClose,
}: EntityEditFormProps) => {
  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState(initialAddress);
  const [floorCount, setFloorCount] = useState(initialFloorCount);
  const [allowedOrganisations, setAllowedOrganisations] = useState(
    initialAllowedOrganisations,
  );
  const updateOrganisation = useUpdateOrganisation();
  const updateSite = useUpdateSite();
  const updateBuilding = useUpdateBuilding();
  const isSaving =
    updateOrganisation.isPending || updateSite.isPending || updateBuilding.isPending;
  const saveError = updateOrganisation.error || updateSite.error || updateBuilding.error;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (entity === "organisation") {
      updateOrganisation.mutate(
        { id: entityId, organisation: { name: trimmedName } },
        { onSuccess: onClose },
      );
    } else if (entity === "site") {
      updateSite.mutate(
        { id: entityId, site: { name: trimmedName, address: address.trim() } },
        { onSuccess: onClose },
      );
    } else {
      updateBuilding.mutate(
        {
          id: entityId,
          building: {
            name: trimmedName,
            total_floors: floorCount,
            organizations: allowedOrganisations,
          },
        },
        { onSuccess: onClose },
      );
    }
  };

  const toggleOrganisation = (id: number) => {
    setAllowedOrganisations((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
          className={inputClassName}
        />
      </label>

      {entity === "site" && (
        <label className="block text-sm font-medium">
          Address
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
            className={inputClassName}
          />
        </label>
      )}

      {entity === "building" && (
        <>
          <label className="block text-sm font-medium">
            Number of floors
            <input
              type="number"
              min={1}
              value={floorCount}
              onChange={(event) => setFloorCount(Number(event.target.value))}
              required
              className={inputClassName}
            />
          </label>
          <fieldset>
            <legend className="text-sm font-medium">Organisation access</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded border border-border-grey p-3">
              {organisations.map((item) => {
                const id = Number(item.id);
                return (
                  <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={allowedOrganisations.includes(id)}
                      onChange={() => toggleOrganisation(id)}
                      className="accent-lab-turquoise"
                    />
                    {item.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </>
      )}

      {saveError && (
        <p className="text-sm text-red-300" role="alert">
          Changes could not be saved. Please try again.
        </p>
      )}
      <div className="flex justify-end gap-2 pt-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded border border-border-grey px-4 py-2 hover:border-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !name.trim()}
          className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
};
