import { useMemo } from "react";

import {
  useCurrentStep,
  useCurrentSteps,
  useSelectedOperation,
} from "~/hooks/operation";

import ChevronLeft from "~/assets/icons/chevron-left.svg?react";
import Close from "~/assets/icons/close.svg?react";

import clsx from "clsx";
import ArrowRight from "~/assets/icons/left-to-right-thin.svg?react";
import ActionRouteDetail from "~/components/swap/helpers/OperationRouteDetail";
import ActionStepsAnimation from "~/components/swap/helpers/ActionStepsAnimation.tsx";
import TokenPresentation from "../TokenPresentation";
import { closeModal } from "~/services/modal";

const ActionStepsModal = () => {
  const currentSteps = useCurrentSteps();
  const currentStep = useCurrentStep();
  const operation = useSelectedOperation();

  const animationStep = useMemo(() => {
    if (!currentStep) return null;
    return currentStep.type;
  }, [currentStep]);

  return (
    <div className="flex flex-col gap-3">
      <ActionStepsAnimation
        mode={animationStep}
        className="mx-auto overflow-hidden invert w-52 -mt-6 mb-2"
      />
      <div
        key={`notification-${operation.id}`}
        className={clsx("flex flex-col")}
      >
        <div
          className={clsx(
            "relative flex flex-row justify-between border-solid border-2 rounded-2xl py-4 px-8",
            "border-darkGrey"
          )}
        >
          <TokenPresentation
            token={operation.fromToken}
            isHoverable={false}
          />
          <div className="centerXY">
            <ArrowRight className="fill-base-content w-10" />
          </div>
          <TokenPresentation token={operation.toToken} isHoverable={false} />
        </div>
      </div>
      <ActionRouteDetail operation={operation} showStatus={true} />
    </div>
  );
};
export default ActionStepsModal;
