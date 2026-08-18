import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface DataListItem {
  id: number;
}

export interface DataListColumn<T extends DataListItem> {
  key: keyof T & string;
  label: string;
  width: string; // e.g "1fr" or "100px"
  type?: "image";
  page?: string; // page to link to, used with getLink to generate link
  idName?: string; // id to pass to the link
  search?: Record<string, string | number | undefined>; // search params to pass to the link
  render?: (item: T) => ReactNode;
}

interface DataListProps<T extends DataListItem> {
  data: T[];
  columns: DataListColumn<T>[];
}

// Component to display fetched data as a list. A column can either use the
// built-in text/image/link rendering or provide a custom cell renderer.
export const DataList = <T extends DataListItem>({
  data,
  columns,
}: DataListProps<T>) => {
  const gridTemplate = columns.map((col) => col.width).join(" ");

  return (
    <div className="border border-border-grey rounded mt-4">
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
        data.map((item) => (
          <div
            key={item.id}
            className={`shadow grid grid-cols-${columns.length} items-center gap-4 border-b px-1 border-border-grey py-1`}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((column) => (
              <span key={column.key} className="flex items-center text-center">
                {column.render ? (
                  column.render(item)
                ) : column.type === "image" ? (
                  typeof item[column.key] === "string" && item[column.key] ? (
                    <img
                      src={item[column.key] as string}
                      alt={
                        "name" in item && typeof item.name === "string"
                          ? `${item.name} image`
                          : column.label
                      }
                      className="h-12 w-16 rounded object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 h-12 w-16 flex items-center justify-center border border-border-grey rounded">No image</span>
                  )
                ) : column.search ? (
                  <Link
                    to={column.page ? `/${column.page}` : "/"}
                    search={{ ...column.search, [column.idName!]: item.id }}
                    className=" hover:underline text-lab-turquoise"
                  >
                    {String(item[column.key] ?? `${column.key} is undefined`)}
                  </Link>
                ) : (
                  String(item[column.key] ?? `${column.key} is undefined`)
                )}
              </span>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
