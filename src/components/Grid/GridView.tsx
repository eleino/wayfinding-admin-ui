// GridView.tsx
import type { SearchParams } from "@schemas/router.schema";
import { Link } from "@tanstack/react-router";

interface GridViewProps {
  setSelectedItem: (id: number) => void;
  type?: "org" | "site" | "building" | "location";
  searchParams?: SearchParams;
  items: {
    id: number;
    title: string;
    subTitle: string;
    imageUrl?: string;
  }[];
}
export const GridView = (props: GridViewProps) => {
  const { items, setSelectedItem, searchParams } = props;
  const { orgId, siteId, buildingId } = searchParams || {};

  if (props)
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <Link
          to=""
          search={{ orgId, siteId, buildingId, [props.type + "Id"]: item.id }}
          key={item.id}
          className="border cursor-pointer w-120 hover:border-lab-green-dark p-2 rounded"
          onClick={() => setSelectedItem(item.id)}
        >
          <div key={item.id}>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>{item.subTitle}</p>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-300 object-cover mb-2"
              />
            ) : <p className="h-80 flex items-center justify-center text-gray-500 mb-2">No image</p>}

          </div>
        </Link>
      ))}
    </div>
  );
};
