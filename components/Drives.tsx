import React, { useState, useCallback, Suspense } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Toast from "@/components/Toast";
import StorageAccountItem from "./DriveItem";
import useStorageAccounts from "@/hooks/useStorageAccounts";
import { formatBytes } from "@/utils/formatBytes";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "@/contexts/ToastContext";

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

interface DriveItemProps {
  onAccountSelect: (publicKey: string) => void;
}

const DriveItem: React.FC<DriveItemProps> = ({
  onAccountSelect,
}) => {
  const { accounts, setAccounts, isLoading } = useStorageAccounts();
  const { drive } = useSHDWDrive();
  const wallet = useWallet();
  const { showToast } = useToast();
  const router = useRouter();


  const handleClick = useCallback(
    (publicKey: string) => {
      router.push(`/account/${publicKey}`);
    },
    [router]
  );

  const handleDeleteStorageAccount = useCallback(
    async (publicKey: string) => {
      showToast("Deleting Drive...", "loading");
      try {
        if (!drive) {
          throw new Error("Drive is not connected");
        }
        if (!wallet) {
          throw new Error("Wallet is not connected");
        }
        const sig = await drive.deleteStorageAccount(new PublicKey(publicKey));
        const updatedAccounts = accounts.filter(
          (account) => account.publicKey.toBase58() !== publicKey
        );
        setAccounts(updatedAccounts);
        showToast("File deleted successfully!", "success",);
      } catch (error) {
        showToast(`Failed to delete storage account: ${error}`, "error");
      }
    },
    [drive, wallet, showToast, accounts, setAccounts]
  );

  const handleMakeStorageImmutable = useCallback(
    async (publicKey: string) => {
      showToast("Making storage account immutable...", "loading");
      try {
        if (!drive) {
          throw new Error("Drive is not connected");
        }
        if (!wallet || !wallet.connected) {
          throw new Error("Wallet is not connected");
        }
        const sig = await drive.makeStorageImmutable(new PublicKey(publicKey));
        showToast(`Drive is now Immutable!`, "success");
      } catch (error: any) {
        showToast(`${error.message}`, "error");
      }
    },
    [drive, wallet, showToast]
  );
  
  

  const SkeletonLoader = () => {
    return (
      <div className="animate-pulse space-y-4 mt-2">
        <div className="h-12 bg-[#2e2e2e] rounded w-full"></div>
        <div className="h-12 bg-[#2e2e2e] rounded w-full"></div>
        <div className="h-12 bg-[#2e2e2e] rounded w-full"></div>
        <div className="h-12 bg-[#2e2e2e] rounded w-full"></div>
      </div>
    );
  };

  return (
    <div className={`fade-in flex flex-col`}>
      <div className="flex-1 rounded-lg dark:text-gray-300">
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : accounts.length > 0 ? (
            <ul>
              {accounts.map((account) => (
                <Suspense
                  key={account.publicKey.toBase58()}
                  fallback={<SkeletonLoader />}
                >
                  <StorageAccountItem
                    account={account}
                    onClick={handleClick}
                    deleteStorageAccount={handleDeleteStorageAccount}
                    formatBytes={formatBytes}
                  />
                </Suspense>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center text-center h-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                Create a Storage Account to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveItem;
