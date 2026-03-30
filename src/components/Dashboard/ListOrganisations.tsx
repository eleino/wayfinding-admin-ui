// ListOrganisations.tsx
import { useGetOrganisations } from "@hooks/useOrganisations";
import { useState } from "react";
import ShowOrganisation from "./ShowOrganisation";


export const ListOrganisations = () => {
    const orgs = useGetOrganisations();
    const [showSites, setShowSites] = useState<number | null>(null);
    const toggleShowSites = (orgId: number) => {
        setShowSites(showSites === orgId ? null : orgId);
    };

    return (
        <div>
            <h1>List of Organisations</h1>
            <ul>
                {orgs.data?.map((org) => (
                    <li key={org.id} className="p-5">
                        {org.name}
                        <img src={org.logoUrl} alt={org.name} className="w-40 inline" onClick={() => toggleShowSites(Number(org.id))}/>
                        {showSites === Number(org.id) && <ShowOrganisation orgId={Number(org.id)} />}
                    </li>
                ))}
            </ul>
        </div>
    );
}