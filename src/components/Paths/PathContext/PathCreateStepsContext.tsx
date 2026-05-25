import { createContext, useContext } from "react";
import type { FormStore } from "@formisch/react";
import { CreatePathSchema } from "@schemas/path.schema";
import type { ListLocation, EntranceLocation } from "@apptypes/location";

type PathCreateStepsContextValue = {
    form: FormStore<typeof CreatePathSchema>;
    locationList?: ListLocation[] | undefined;
    entryLocations?: EntranceLocation[] | undefined;
    calcPathLength: () => void;
}

const PathCreateStepsContext = createContext<PathCreateStepsContextValue | null>(null);

export const usePathCreateSteps = () => {
    const context = useContext(PathCreateStepsContext);
    if (!context) {
        throw new Error("usePathCreateSteps must be used within a PathCreateStepsProvider");
    }
    return context;
}

export const PathCreateStepsProvider = PathCreateStepsContext.Provider;