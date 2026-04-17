import type { SearchParams } from "@apptypes/searchParams";
import { useGetAllImagesByType } from "@hooks/useImages";
import { useState } from "react";
// valid image types: location, site, step, building, overlay, logo
export const ImageList = (props: { searchParams: SearchParams }) => {
  const { searchParams } = props;
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.type || "",
  );
  const {
    data: images,
    isLoading,
    error,
  } = useGetAllImagesByType(selectedType, { enabled: !!selectedType });
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };
  const imageTypes = ["location", "site", "step", "building", "overlay", "logo"];


  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-lg text-gray-500">
        Select which type of images you want to view.
      </p>
      <ul className="list-disc pl-5">
          {imageTypes.map((type) => (
            <li
              key={type}
              onClick={() => handleTypeChange(type)}
              className="cursor-pointer inline pr-5 hover:text-blue-500"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </li>
          ))}
      </ul>
      {!selectedType && <p className="text-lg text-gray-500">Select which type of images you want to view.</p>}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading images.</p>}
      {images && (
        <div>
          <h2 className="text-xl font-bold mb-4">Images</h2>
          {images.data.length === 0 ? (
            <p>No images found for type "{selectedType}".</p>
          ) : (
          <ul className="divide-y-2 divide-lab-blue">
            {images.data.map((image) => (
              <li key={image.key} className="p-2">
                <p>Key: {image.key}</p>
                <img
                  src={image.url}
                  alt={image.key}
                  className="w-50 object-cover"
                />
              </li>
            ))}
          </ul>)}
        </div>
      )}
    </div>
  );
};
