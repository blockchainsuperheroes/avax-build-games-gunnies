import { useCallback, useEffect, useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { pfpGunniesAbi } from '@/abi/pfpGunnies';
import { ADDRESSES } from '@/app/constants/address';
import { AvalancheMainnet } from '@/app/constants/chains';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

const PFP_ADDRESS = ADDRESSES.PFP_GUNNIES.AVAX as `0x${string}`;

const PFP_LOG = '[PFP]';
function pfpLog(message: string, data?: Record<string, unknown>) {
  if (data !== undefined) {
    console.log(PFP_LOG, message, data);
  } else {
    console.log(PFP_LOG, message);
  }
}

export function usePfpGunniesFees() {
  const { data: mintFeeWei } = useReadContract({
    address: PFP_ADDRESS,
    abi: pfpGunniesAbi,
    chainId: AvalancheMainnet.id,
    functionName: 'mintFee',
  });

  const { data: upgradeFeeWei } = useReadContract({
    address: PFP_ADDRESS,
    abi: pfpGunniesAbi,
    chainId: AvalancheMainnet.id,
    functionName: 'upgradeFee',
  });

  const mintFee: bigint | undefined =
    typeof mintFeeWei === 'bigint' ? mintFeeWei : undefined;
  const upgradeFee: bigint | undefined =
    typeof upgradeFeeWei === 'bigint' ? upgradeFeeWei : undefined;

  const mintFeeFormatted = mintFee !== undefined ? formatEther(mintFee) : undefined;
  const upgradeFeeFormatted = upgradeFee !== undefined ? formatEther(upgradeFee) : undefined;

  return {
    mintFee,
    upgradeFee,
    mintFeeFormatted,
    upgradeFeeFormatted,
    mintFeeDisplay: mintFeeFormatted ? `${mintFeeFormatted} PC` : undefined,
    upgradeFeeDisplay: upgradeFeeFormatted ? `${upgradeFeeFormatted} PC` : undefined,
  };
}

type PfpTxType = 'mint' | 'upgrade';

interface PendingTx {
  hash: `0x${string}`;
  tokenId: number;
  type: PfpTxType;
}

export function usePfpGunnies() {
  const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([]);
  const queryClient = useQueryClient();

  const currentTx = pendingTxs[0] ?? null;
  const txHash = currentTx?.hash ?? null;
  const txType = currentTx?.type ?? null;
  const pendingTokenIds = new Set(pendingTxs.map((t) => t.tokenId));

  const {
    mintFee,
    upgradeFee,
    mintFeeFormatted,
    upgradeFeeFormatted,
    mintFeeDisplay,
    upgradeFeeDisplay,
  } = usePfpGunniesFees();

  useEffect(() => {
    if (mintFee !== undefined || upgradeFee !== undefined) {
      pfpLog('Fees loaded from contract', {
        contract: PFP_ADDRESS,
        chainId: AvalancheMainnet.id,
        mintFeeWei: mintFee?.toString(),
        mintFeeFormatted,
        upgradeFeeWei: upgradeFee?.toString(),
        upgradeFeeFormatted,
      });
    }
  }, [mintFee, upgradeFee, mintFeeFormatted, upgradeFeeFormatted]);

  const { writeContractAsync, isPending: isPendingWrite } = useWriteContract();

  const {
    data: receipt,
    isError,
    isSuccess,
    isLoading: isLoadingReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    chainId: AvalancheMainnet.id,
    query: { enabled: !!txHash },
  });

  useEffect(() => {
    if (!currentTx || (!isSuccess && !isError)) return;
    if (receipt && receipt.transactionHash !== currentTx.hash) return;
    const { tokenId, type: completedType } = currentTx;
    pfpLog('Tx receipt received', {
      tokenId,
      txType: completedType,
      txHash: currentTx.hash,
      isSuccess,
      isError,
      blockNumber: receipt?.blockNumber?.toString(),
      status: receipt?.status,
    });
    if (completedType === 'mint') {
      if (isSuccess) {
        pfpLog('mintSbt confirmed on-chain', { tokenId });
        toast.success('SBT minted successfully');
      } else if (isError) {
        pfpLog('mintSbt on-chain failed', { tokenId });
        toast.error('Mint failed');
      }
    } else if (completedType === 'upgrade') {
      if (isSuccess) {
        pfpLog('upgradeToNft confirmed on-chain', { tokenId });
        toast.success('Upgraded to NFT successfully');
      } else if (isError) {
        pfpLog('upgradeToNft on-chain failed', { tokenId });
        toast.error('Upgrade failed');
      }
    }
    queryClient.invalidateQueries({ queryKey: ['gunnies-pfp-nfts'] });
    setPendingTxs((prev) => prev.slice(1));
  }, [isSuccess, isError, queryClient, receipt, currentTx]);

  const mintSbt = useCallback(
    async (tokenId: number | bigint) => {
      const tokenIdNum = Number(tokenId);
      pfpLog('mintSbt called', { tokenId: tokenIdNum, mintFeeWei: mintFee?.toString() });
      if (mintFee === undefined) {
        pfpLog('mintSbt aborted: mint fee not loaded');
        toast.error('Mint fee not loaded. Please try again.');
        return;
      }
      try {
        pfpLog('mintSbt sending tx', {
          contract: PFP_ADDRESS,
          chainId: AvalancheMainnet.id,
          tokenId: tokenIdNum,
          valueWei: mintFee.toString(),
        });
        const hash = await writeContractAsync({
          address: PFP_ADDRESS,
          abi: pfpGunniesAbi,
          chainId: AvalancheMainnet.id,
          functionName: 'mintSBT',
          args: [BigInt(tokenIdNum)],
          value: mintFee,
        });
        pfpLog('mintSbt tx submitted', { txHash: hash });
        toast.info('Waiting for confirmation...');
        setPendingTxs((prev) => [...prev, { hash, tokenId: tokenIdNum, type: 'mint' }]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Transaction rejected or failed';
        pfpLog('mintSbt failed', { tokenId: tokenIdNum, error: String(err), message });
        toast.error(message);
      }
    },
    [writeContractAsync, mintFee]
  );

  const upgradeToNft = useCallback(
    async (tokenId: number | bigint) => {
      const tokenIdNum = Number(tokenId);
      pfpLog('upgradeToNft called', { tokenId: tokenIdNum, upgradeFeeWei: upgradeFee?.toString() });
      if (upgradeFee === undefined) {
        pfpLog('upgradeToNft aborted: upgrade fee not loaded');
        toast.error('Upgrade fee not loaded. Please try again.');
        return;
      }
      try {
        pfpLog('upgradeToNft sending tx', {
          contract: PFP_ADDRESS,
          chainId: AvalancheMainnet.id,
          tokenId: tokenIdNum,
          valueWei: upgradeFee.toString(),
        });
        const hash = await writeContractAsync({
          address: PFP_ADDRESS,
          abi: pfpGunniesAbi,
          chainId: AvalancheMainnet.id,
          functionName: 'upgradeToNFT',
          args: [BigInt(tokenIdNum)],
          value: upgradeFee,
        });
        pfpLog('upgradeToNft tx submitted', { txHash: hash });
        toast.info('Waiting for confirmation...');
        setPendingTxs((prev) => [...prev, { hash, tokenId: tokenIdNum, type: 'upgrade' }]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Transaction rejected or failed';
        pfpLog('upgradeToNft failed', { tokenId: tokenIdNum, error: String(err), message });
        toast.error(message);
      }
    },
    [writeContractAsync, upgradeFee]
  );

  const isLoading = isPendingWrite || isLoadingReceipt;

  return {
    mintFee,
    upgradeFee,
    mintFeeFormatted,
    upgradeFeeFormatted,
    mintFeeDisplay,
    upgradeFeeDisplay,
    mintSbt,
    upgradeToNft,
    isLoading,
    pendingTokenIds,
    isSuccess,
    isError,
    txHash,
    receipt,
  };
}
