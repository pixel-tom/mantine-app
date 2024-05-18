import React, { useState, useCallback, Suspense } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Toast from "@/components/Toast";
import StorageAccountItem from "./DriveItem";
import useStorageAccounts from "@/hooks/useStorageAccounts";
import { formatBytes } from "@/utils/formatBytes";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

interface StorageAccountsProps {
  onAccountSelect: (publicKey: string) => void;
}

const StorageAccounts: React.FC<StorageAccountsProps> = ({
  onAccountSelect,
}) => {
  const { accounts, setAccounts, isLoading } = useStorageAccounts();
  const { drive } = useSHDWDrive();
  const wallet = useWallet();
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    details: "",
    type: "info",
  });
  const router = useRouter();

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "loading",
    details: string = ""
  ) => {
    setToast({ show: true, message, type, details });
  };

  const handleClick = useCallback(
    (publicKey: string) => {
      router.push(`/account/${publicKey}`);
    },
    [router]
  );

  const handleDeleteStorageAccount = useCallback(
    async (publicKey: string) => {
      if (!drive || !wallet) return;
      showToast("Deleting storage account...", "loading");
      try {
        const sig = await drive.deleteStorageAccount(new PublicKey(publicKey));
        const updatedAccounts = accounts.filter(
          (account) => account.publicKey.toBase58() !== publicKey
        );
        setAccounts(updatedAccounts);
        showToast(
          "File deleted successfully!",
          "success",
          `Transaction signature: ${sig}`
        );
      } catch (error) {
        showToast(`Failed to delete storage account: ${error}`, "error");
      }
    },
    [drive, wallet, accounts, setAccounts]
  );

  const handleMakeStorageImmutable = useCallback(
    async (publicKey: string) => {
      if (!drive || !wallet) return;
      showToast("Making storage account immutable...", "loading");
      try {
        const sig = await drive.makeStorageImmutable(new PublicKey(publicKey));
        showToast(
          "Storage account made immutable successfully!",
          "success",
          `Transaction signature: ${sig}`
        );
      } catch (error) {
        showToast(`Error making storage immutable: ${error}`, "error");
      }
    },
    [drive, wallet]
  );

  const SkeletonLoader = () => {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-[#24292d] rounded w-full"></div>
        <div className="h-16 bg-[#24292d] rounded w-full"></div>
        <div className="h-16 bg-[#24292d] rounded w-full"></div>
        <div className="h-16 bg-[#24292d] rounded w-full"></div>
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
                    makeStorageImmutable={handleMakeStorageImmutable}
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

export default StorageAccounts;
