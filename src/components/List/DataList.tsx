import type { BuildingType } from "@apptypes/building";
import type { ListLocation } from "@apptypes/location";
import type { Path, PathStep } from "@apptypes/path";
import type { Site } from "@apptypes/site";
import type { OrganisationType } from "@apptypes/organisation";
import { Link } from "@tanstack/react-router";
interface DataListProps {
  data:
    | ListLocation[]
    | BuildingType[]
    | Path[]
    | Site[]
    | OrganisationType[]
    | PathStep[];
  columns: {
    key: string;
    label: string;
    width: string; // e.g "1fr" or "100px"
    type?: string; // e.g image or link, default is text
    linkTo?: string; // displayed link if not defined with getLink instead
    getLink?: (
      item:
        ListLocation
        | BuildingType
        | Path
        | Site
        | OrganisationType
        | PathStep,
    ) => string; // function to generate link for the item, used if linkTo is not defined, e.g for locations it could be (item) => `/locations?orgId=1&buildingId=2&locationId=${item.id}`
  }[];
}

// component to display fetched data as a list, supports multiple columns
// if type is image, renders an image, if linkTo is defined, renders a link
export const DataList = (props: DataListProps) => {
  const { data, columns } = props;
  const gridTemplate = columns.map((col) => col.width).join(" ");

  return (
    <div className="border border-border-grey">
      <div className={`grid grid-cols-${columns.length} gap-4 bg-sidebar-grey text-lab-turquoise p-1`} style={{ gridTemplateColumns: gridTemplate }}>
        {columns.map((column) => (
          <span key={column.key} className="mb-2">
            <strong>{column.label}</strong>
          </span>
        ))}
      </div>
      {data.length === 0 ? (
        <p>No data found.</p>
      ) : (
        data.map((item, index) => (
          <div
            key={index}
            className={`shadow grid grid-cols-${columns.length} gap-4 border-b px-1 border-border-grey pt-1`}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((column) => (
              <span key={column.key} className="mb-2">
                {column.type === "image" ? (
                  <img
                    src={item[column.key as keyof typeof item] as string}
                    alt={column.label}
                    className="h-32"
                  />
                ) : column.getLink ? (
                  <Link
                    to={column.getLink(item)}
                    className=" hover:underline text-lab-turquoise"
                  >
                    {item[column.key as keyof typeof item] ??
                      `${column.key} is undefined`}
                  </Link>
                ) : (
                  (item[column.key as keyof typeof item] ??
                  `${column.key} is undefined`)
                )}
              </span>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
