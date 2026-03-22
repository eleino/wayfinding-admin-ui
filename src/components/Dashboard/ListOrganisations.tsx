// ListOrganisations.tsx
import { fetchOrganisations } from "@api/organisations";
import { useQuery } from "@tanstack/react-query";

export const ListOrganisations = () => {
    const query = useQuery({ queryKey: ["organisations"], queryFn: fetchOrganisations });
    //console.log(query);
    return (
        <div>
            <h1>List of Organisations</h1>
            <ul>
                {query.data?.map((org) => (
                    <li key={org.id} className="p-5">
                        {org.name}
                        <img src={org.logoUrl} alt={org.name} className="w-40 inline"/>
                    </li>
                ))}
            </ul>
        </div>
    );
}