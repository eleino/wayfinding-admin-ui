import type { EditStepInput } from "@apptypes/step";
import { useGetStepById } from "@hooks/useSteps";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import { EditStepInstructions } from "./EditStepInstructions";
import { useGetImagesByType } from "@hooks/useImages";

/**
 * Modal for editing step instructions and overlay.
 * Fetches the data needed and passes it on to the EditStepInstructions component which contains the actual form.
 */
export const EditStepModal = (props: {
  stepId: number;
  stepInstructions?: {stepInstructionTranslations: EditStepInput, trl_instruction_to_next_key: string, trl_instruction_on_approach_key: string};
  closeModal: () => void;
  stepIndex: number;
  locationName?: string;
}) => {
  // we should get all other necessary data from fetching step overview
  const { stepId, stepInstructions, closeModal, stepIndex, locationName } = props;

  const stepOverview = useGetStepById(stepId);
  const firstApproachTranslations = useGetTranslationsAllLangs(
    stepOverview.data?.step.instructions.find((step) => step.direction === "on_approach")?.trl_instruction_key || "",
    { enabled: stepIndex === 0 },
  );
  const overlayImages = useGetImagesByType("overlay");

  const stepData = stepOverview.data;

  const isLoading =
    stepOverview.isLoading ||
    overlayImages.isLoading ||
    (stepIndex === 0 && firstApproachTranslations.isLoading);
  const hasData = stepData && overlayImages.data;

  if (isLoading)
    return (
      <ModalWrapper closeModal={closeModal}>
        <div>Loading step data...</div>
      </ModalWrapper>
    );
  if (!hasData)
    return (
      <ModalWrapper closeModal={closeModal}>
        <div className="text-red-500">Error loading data.</div>
      </ModalWrapper>
    );

  return (
    <ModalWrapper closeModal={closeModal}>
      <EditStepInstructions
        {...props}
        firstApproachTranslations={firstApproachTranslations.data}
        stepData={stepData}
        locationName={locationName}
        stepIndex={props.stepIndex}
        stepInstructions={stepInstructions}
        overlayImages={overlayImages.data}
      />
    </ModalWrapper>
  );
};

const ModalWrapper = ({
  children,
  closeModal,
}: {
  children: React.ReactNode;
  closeModal: () => void;
}) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-sidebar-grey rounded p-6 w-220 relative max-h-[90vh] min-h-[20vh] overflow-y-auto scrollbar-thin">
      <div className="sticky w-full top-0 left-0 flex justify-end ">
        <button
          onClick={closeModal}
          className="cursor-pointer border border-border-grey bg-sidebar-grey/90 rounded w-10 h-10 text-2xl hover:border-lab-turquoise hover:text-lab-turquoise transition-colors"
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);
