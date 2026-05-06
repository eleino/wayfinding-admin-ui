import { useGetSites } from "@hooks/useSites";

const ShowOrganisation = (props: { orgId: number }) => {
  const { orgId } = props;
  const sites = useGetSites(orgId);

  if (sites.isLoading) {
    return <div>Loading sites...</div>;
  }

  if (sites.isError) {
    return <div>Error loading sites: {String(sites.error)}</div>;
  }
  return (
    <div>
      <h2>Sites for Organisation {orgId}</h2>
      <ul>
        {sites.data?.map((site) => {
            console.log("Site for org", orgId, site);
            return <li key={site.id}>{site.address}
            <img src={site.image_url} alt={site.address} />
            </li>;
        })}
      </ul>
    </div>
  );
};

export default ShowOrganisation;
