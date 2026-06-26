import { ImageList } from "@components/Images/ImageList";
import { getRouteApi } from "@tanstack/react-router";

const currRoute = getRouteApi("/images");
const ImagesView = () => {
  const { type } = currRoute.useSearch();
  return (
    <div className="p-5">
      <h1>Media/Images</h1>
      <ImageList searchParams={{ type }} />
    </div>
  );
};

export default ImagesView;