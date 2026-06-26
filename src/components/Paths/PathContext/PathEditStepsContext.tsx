import { createContext, useContext } from "react";
import type { FormStore } from "@formisch/react";
import type { StepArraySchema } from "@schemas/step.schema";
import type { EntranceLocation, ListLocation } from "@apptypes/location";
import type { PathApiResponse } from "@apptypes/path";
import type { StepInstructionsList } from "@apptypes/step";

export type PathEditStepsContextValue = {
  form: FormStore<typeof StepArraySchema>;
  locationList?: ListLocation[];
  entryLocations?: EntranceLocation[];
  pathData: PathApiResponse;
  pathInstructionsFi?: StepInstructionsList;
  pathInstructionsEn?: StepInstructionsList;
  allowRearranging?: boolean;
};

const PathEditStepsContext = createContext<PathEditStepsContextValue | null>(null);

export const usePathEditSteps = () => {
  const context = useContext(PathEditStepsContext);
  if (!context) throw new Error("usePathEditSteps must be used within PathEditStepsProvider");
  return context;
};

export const PathEditStepsProvider = PathEditStepsContext.Provider;