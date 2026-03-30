import { useFetchLocationById } from "@hooks/useLocations";

export const ShowLocation = (props: { locationId: number | null }) => {
  const { locationId } = props;
  const locationData = useFetchLocationById(Number(locationId), {
    enabled: !!locationId,
  });
  if (locationData.isLoading) {
    return <div>Loading location details...</div>;
  } else {
    console.log("Location data:", locationData.data);
  }
  
  if (locationId && !locationData.isLoading && locationData.data) {
    return (
      <div>
        <h2>Location Details:</h2>
        <p><strong>Name:</strong> {locationData.data.location.name}</p>
        <p><strong>Building ID:</strong> {locationData.data.location.building_id}</p>
        <p><strong>Is Entry Location:</strong> {locationData.data.location.is_entry_location ? "Yes" : "No"}</p>
        <p><strong>QR URL:</strong> {locationData.data.location.qr_url || "N/A"}</p>
        <p><strong>Image Location Key:</strong> {locationData.data.location.img_location_key}</p>
        <p><strong>Floor Number:</strong> {locationData.data.location.floor_number}</p>
        <p><strong>Translation Keys:</strong></p>
        <ul>
          <li>{locationData.data.location.trl_location_name_key}</li>
          <li>{locationData.data.location.trl_current_location_msg_key}</li>
          <li>{locationData.data.location.trl_location_desc_key}</li>
        </ul>
        <p>Image: {locationData.data.image ? <img src={locationData.data.image.url} alt="Location" /> : "N/A"}</p>
      </div>
    );
  }

  return (
    <div>
    </div>
  );
};
