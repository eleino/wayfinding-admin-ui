import type { SearchParams } from "@schemas/router.schema";
import { useGetImagesByTypeInfinite } from "@hooks/useImages";
import { useState } from "react";
import { ImageBox } from "./ImageBox";

// valid image types: location, site, step, building, overlay, logo
export const ImageList = (props: { searchParams: SearchParams }) => {
  const { searchParams } = props;
  //const [shownImages, setShownImages] = useState<Image[]>([]);

  const [selectedType, setSelectedType] = useState<string>(
    searchParams.type || "",
  );
  const imageTypes = [
    "location",
    "site",
    "step",
    "building",
    "overlay",
    "logo",
  ];
  const {
    data: images,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetImagesByTypeInfinite(selectedType, {
    enabled: !!selectedType,
  });
  const allImages = images?.pages.flatMap((page) => page.data) || [];
  console.log("Fetched images:", allImages);

  // reset shownImages and page when type changes
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

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

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading images.</p>}
      {allImages.length === 0 ? (selectedType && !isLoading) && (
        <p className="text-gray-500 mt-1">No images found for type "{selectedType}".</p>
      ) : (
        <div>
          <h2 className="text-xl font-bold my-2">{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} images</h2>

          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4">
            {allImages.map((image) => (
              <ImageBox
                key={image.key}
                imageUrl={image.url}
                imageKey={image.key}
                type={selectedType}
              />
            ))}
          </div>
          {isFetchingNextPage && <p>Loading more...</p>}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load More
            </button>
          )}
          {!hasNextPage && (
            <p className="mt-4 text-gray-500">No more images to load.</p>
          )}
        </div>
      )}
    </div>
  );
};
