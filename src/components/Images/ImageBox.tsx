
export const ImageBox = (props: { imageUrl: string, imageKey: string }) => {
  const { imageUrl, imageKey } = props;
  return (
    <span className="bg-sidebar-grey rounded text-white h-50">
      <img src={imageUrl} alt={imageKey} className="w-full h-40 object-cover rounded" />
      <p className="p-1">Key: {imageKey}</p>
    </span>
  );
};