import type { LocationWithImage } from "@apptypes/location";
export const LocationListBox = (props: LocationWithImage) => {
    const { location, image } = props;
    // display all the text fields, and a thumbnail of the image if it exists
    return (
        <div className="flex items-center space-x-4 p-2 border border-gray-300 rounded">
            {image && image.url ? (
                <img src={image.url} alt={location.name} className="w-16 h-16 object-cover rounded" />
            ) : (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-500">No Image</span>
                </div>
            )}
            <div className="grid grid-cols-2 gap-2">
                <h3 className="text-lg font-semibold">{location.name}</h3>
                <span>Location ID: {location.location_id}</span>
                <p className="text-sm text-gray-600">Floor: {location.floor_number}</p>
                <p className="text-sm text-green-500 font-semibold">Entry Location: <span className={location.is_entry_location ? "text-green-500" : "text-red-500"}>{location.is_entry_location ? "Yes" : "No"}</span></p>
                
            </div>
        </div>
    );
}
