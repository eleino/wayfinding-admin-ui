
export const ImageBox = (props: { imageUrl: string, imageKey: string, type: string }) => {
  const { imageUrl, imageKey, type } = props;
  return (
    <div className="bg-sidebar-grey rounded text-white h-50 w-80 p-2 flex flex-col items-center">
      <img src={imageUrl} alt={imageKey} className={`${type === "overlay" ? "w-auto" : "w-full"} " h-40 object-contain rounded"`} />
      <p className="p-1 self-start">Key: {imageKey}</p>
    </div>
  );
};