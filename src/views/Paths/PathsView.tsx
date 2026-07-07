import { ShowPath } from "@components/Paths/ShowPath";
import { PathSelections } from "@components/Paths/PathSelections";
import { useLocation } from "@tanstack/react-router";


const PathsView = () => {
  const {search} = useLocation();
  const pathId = search.pathId as number | undefined;
  const searchParams = { ...search };

  return (
    <div className="p-4">
      <h1>Paths</h1>

      {pathId ? (
        <ShowPath pathId={pathId} searchParams={searchParams} />
      ) : (
        <PathSelections searchParams={searchParams} />
      )}
    </div>
  );
};

export default PathsView;
