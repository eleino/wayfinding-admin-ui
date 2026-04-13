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
  } = useGetAllImagesByType(selectedType);
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };
  if (!selectedType) {
    return (
      <div>
        <p className="text-lg text-gray-500">
          Select which type of images you want to view.
        </p>
        <ul className="list-disc pl-5">
          <li
            onClick={() => handleTypeChange("location")}
            className="cursor-pointer inline pr-5 hover:text-blue-500"
          >
            Location
          </li>
          <li
            onClick={() => handleTypeChange("site")}
            className="cursor-pointer inline pr-5 hover:text-blue-500"
          >
            Site
          </li>
          <li
            onClick={() => handleTypeChange("step")}
            className="cursor-pointer inline pr-5 hover:text-blue-500"
          >
            Step
          </li>
          <li
            onClick={() => handleTypeChange("building")}
            className="cursor-pointer inline pr-5 hover:text-blue-500"
          >
            Building
          </li>
          <li
            onClick={() => handleTypeChange("overlay")}
            className="cursor-pointer inline pr-5 hover:text-blue-500"
          >
            Overlay
          </li>
          <li
            onClick={() => handleTypeChange("logo")}
            className="cursor-pointer inline pr-5 hover:text-blue-500"
          >
            Logo
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-lg text-gray-500">
        Select which type of images you want to view.
      </p>
      <ul className="list-disc pl-5">
        <li
          onClick={() => handleTypeChange("location")}
          className="cursor-pointer inline pr-5 hover:text-blue-500"
        >
          Location
        </li>
        <li
          onClick={() => handleTypeChange("site")}
          className="cursor-pointer inline pr-5 hover:text-blue-500"
        >
          Site
        </li>
        <li
          onClick={() => handleTypeChange("step")}
          className="cursor-pointer inline pr-5 hover:text-blue-500"
        >
          Step
        </li>
        <li
          onClick={() => handleTypeChange("building")}
          className="cursor-pointer inline pr-5 hover:text-blue-500"
        >
          Building
        </li>
        <li
          onClick={() => handleTypeChange("overlay")}
          className="cursor-pointer inline pr-5 hover:text-blue-500"
        >
          Overlay
        </li>
        <li
          onClick={() => handleTypeChange("logo")}
          className="cursor-pointer inline pr-5 hover:text-blue-500"
        >
          Logo
        </li>
      </ul>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading images.</p>}
      {images && (
        <div>
          <h2 className="text-xl font-bold mb-4">Images</h2>
          <ul className="divide-y-2 divide-lab-blue">
            {images.data.map((image) => (
              <li key={image.key} className="p-2">
                <p>Key: {image.key}</p>
                <img
                  src={image.url}
                  alt={image.key}
                  className="h-32 object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
