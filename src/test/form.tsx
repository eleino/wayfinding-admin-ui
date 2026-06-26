import { StepArraySchema } from "@schemas/step.schema";
import { useForm, type FormStore } from "@formisch/react";
import type { PathEditStepsContextValue } from "@components/Paths/PathContext/PathEditStepsContext";
import type { ReactNode } from "react";
import { PathEditStepsProvider } from "@components/Paths/PathContext/PathEditStepsContext";
import { mockPathData, mockLocationList, mockEntryLocations } from "./mockData";


export type PathEditStepsProviderProps = {
  children: ReactNode;
  contextOverrides?: Partial<
    Omit<PathEditStepsContextValue, "form" | "pathData">
  >;
  formOverrides?: Partial<
    Pick<
      FormStore<typeof StepArraySchema>,
      | "isSubmitting"
      | "isSubmitted"
      | "isValidating"
      | "isTouched"
      | "isDirty"
      | "isValid"
      | "errors"
    >
  >;
};

export const PathEditStepsTestProvider = ({
  children,
  contextOverrides = {},
  formOverrides = {},
}: PathEditStepsProviderProps) => {
  const form = useForm({
    schema: StepArraySchema,
    initialInput: { steps: mockPathData.steps },
  });
  const testForm = Object.assign(form, formOverrides);

  const contextValue = {
    form: testForm,
    pathData: mockPathData,
    locationList: mockLocationList,
    entryLocations: mockEntryLocations,
    ...contextOverrides,
  };

  return (
    <PathEditStepsProvider value={contextValue}>
      {children}
    </PathEditStepsProvider>
  );
};
