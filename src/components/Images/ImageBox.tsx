
export const ImageBox = (props: { imageUrl: string, imageKey: string, type: string }) => {
  const { imageUrl, imageKey, type } = props;
  return (
    <span className="bg-sidebar-grey rounded text-white h-50">
      <img src={imageUrl} alt={imageKey} className={`${type === "overlay" ? "w-auto" : "w-full"} " h-40 object-cover rounded"`} />
      <p className="p-1">Key: {imageKey}</p>
    </span>
  );
};