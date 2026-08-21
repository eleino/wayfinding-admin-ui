import type { EditStepInput } from "@schemas/step.schema";
import { useGetStepById } from "@hooks/useSteps";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import { EditStepInstructions } from "./EditStepInstructions";
import { useGetImagesByType } from "@hooks/useImages";
import { useLocation, useNavigate } from "@tanstack/react-router";

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
  firstApproachImageUrl?: string;
}) => {
  // we should get all other necessary data from fetching step overview
  const { stepId, stepInstructions, closeModal, stepIndex, locationName } = props;
  const { search } = useLocation();
  const navigate = useNavigate();
  const closeAndClearStepId = () => {
    closeModal();
    if (search.stepId !== undefined) {
      navigate({
        to: "/paths/edit",
        search: { ...search, stepId: undefined },
        replace: true,
      });
    }
  };

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
      <ModalWrapper closeModal={closeAndClearStepId}>
        <div>Loading step data...</div>
      </ModalWrapper>
    );
  if (!hasData)
    return (
      <ModalWrapper closeModal={closeAndClearStepId}>
        <div className="text-red-500">Error loading data.</div>
      </ModalWrapper>
    );

  return (
    <ModalWrapper closeModal={closeAndClearStepId}>
      <EditStepInstructions
        {...props}
        firstApproachTranslations={firstApproachTranslations.data}
        stepData={stepData}
        locationName={locationName}
        stepIndex={props.stepIndex}
        stepInstructions={stepInstructions}
        overlayImages={overlayImages.data}
        firstApproachImageUrl={props.firstApproachImageUrl}
        closeModal={closeAndClearStepId}
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit step instructions"
      className="relative h-full min-h-[20vh] w-full overflow-x-hidden overflow-y-auto rounded bg-sidebar-grey p-4 scrollbar-thin sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:p-6"
    >
      <div className="sticky top-0 z-10 -mt-1 flex w-full justify-end pb-2">
        <button
          type="button"
          aria-label="Close modal"
          onClick={closeModal}
          className="h-10 w-10 cursor-pointer rounded border border-border-grey bg-sidebar-grey/90 text-2xl transition-colors hover:border-lab-turquoise hover:text-lab-turquoise"
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);
