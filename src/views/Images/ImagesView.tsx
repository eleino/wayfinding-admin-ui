import { ImageList } from "@components/Images/ImageList";
import type { SearchParams } from "@schemas/router.schema";
import { useSearch } from "@tanstack/react-router";

const ImagesView = () => {
  const { type } = useSearch({ from: "__root__" }) as SearchParams;
  return (
    <div className="p-5">
      <h1>Media/Images</h1>
      <ImageList searchParams={{ type }} />
    </div>
  );
};

export default ImagesView;
