import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useNetwork, usePublicClient } from "wagmi";
import { switchNetwork } from "wagmi/actions";
import { Operation, OperationStatus } from "~/model/operation";
import { closeModal, openModal } from "~/services/modal";
import { addOperation, emmitStep, updateOperation } from "~/services/operation";
import {
  getSwapperStore,
  lockEstimation,
  setEstimationIsLocked,
} from "~/services/swapper";
import { approve } from "~/services/transaction";
import { OperationStep } from "~/store/interfaces/operations";
import { setOnWrite, unlockEstimation } from "~/store/swapper";
import { useExecuteSwap } from "./swap";
import {
  useCanSwap,
  useEstimatedRoute,
  useFromToken,
  useFromValue,
  useToToken,
} from "./swapper";
export const useWriteDebounce = () => {
  const fromValue = useFromValue();

  useEffect(() => {
    if (!fromValue) return;

    const debounce = getSwapperStore().debounceTimer;

    if (debounce) clearTimeout(debounce);
    setOnWrite({
      onWrite: true,
      debounceTimer: setTimeout(() => {
        setOnWrite({
          onWrite: false,
        });
      }, 1000),
    });
  }, [fromValue, setOnWrite]);
};

export const useExectuteSwapperRoute = () => {
  const publicClient = usePublicClient();
  const fromToken = useFromToken();
  const toToken = useToToken();
  const canSwap = useCanSwap();

  const estimation = useEstimatedRoute();

  const executeSwap = useExecuteSwap();
  const currentNetwork = useNetwork();
  return useCallback(async () => {
    if (!fromToken || !toToken || !canSwap) return;
    setEstimationIsLocked(true);
    lockEstimation();
    openModal({ modal: "steps",title: "TX TRACKER" });

    const operation = new Operation({
      id: window.crypto.randomUUID(),
      fromToken,
      toToken,
      steps: estimation.steps.map((step) => {
        return {
          ...step,
          status: OperationStatus.WAITING,
        } as OperationStep;
      }),
      estimation,
    });

    try {
      if (currentNetwork.chain.id !== fromToken.network.id)
        await switchNetwork({ chainId: fromToken?.network?.id });
      if (estimation.steps[0].type === "Approve") {
        const approveStep = estimation.steps[0];

        addOperation(operation);
        const { hash: approveHash } = await approve({
          spender: approveStep.toAddress as `0x${string}`,
          amount: BigInt(approveStep.fromAmount),
          address: approveStep.fromAddress as `0x${string}`,
          chainId: approveStep.fromChain,
        });
        const approvePending = publicClient.waitForTransactionReceipt({
          hash: approveHash,
        });
        toast.promise(approvePending, {
          loading: "Approve is pending...",
          success: "Approve transaction successful",
          error: "approve reverted rejected 🤯",
        });
        emmitStep({
          operationId: operation.id,
          promise: approvePending,
        });
        const hash = await executeSwap(operation);
        updateOperation({
          id: operation.id,
          payload: {
            status: OperationStatus.PENDING,
            txHash: hash,
          },
        });
      } else {
        addOperation(operation);
        const hash = await executeSwap(operation);
        updateOperation({
          id: operation.id,
          payload: {
            status: OperationStatus.PENDING,
            txHash: hash,
          },
        });
      }
    } catch (error) {
      closeModal();
      setEstimationIsLocked(false);
      unlockEstimation();
      toast.error(error.message);
      updateOperation({
        id: operation.id,
        payload: {
          status: OperationStatus.FAILED,
          steps: operation.steps
            .filter(({ status }) => status !== OperationStatus.DONE)
            .map((step) => {
              return {
                ...step,
                status: OperationStatus.FAILED,
              };
            }),
        },
      });
    }
  }, [
    canSwap,
    closeModal,
    currentNetwork.chain.id,
    estimation,
    executeSwap,
    fromToken,
    openModal,
    publicClient,
    setEstimationIsLocked,
    toToken,
  ]);
};
