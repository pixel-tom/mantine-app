import React, { useState, Suspense } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Toast from "@/components/Toast";
import StorageAccountItem from "./StorageAccountItem";
import useStorageAccounts from "@/hooks/useStorageAccounts";
import { formatBytes } from "@/utils/formatBytes";
import {
  deleteStorageAccount,
  makeStorageImmutable,
} from "@/services/shdwDriveService";
import { useRouter } from "next/router";

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
  const { connection } = useConnection();
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

  const handleClick = (publicKey: string) => {
    router.push(`/account/${publicKey}`);
  };

  const handleDeleteStorageAccount = async (publicKey: string) => {
    showToast("Deleting storage account...", "loading");
    try {
      const sig = await deleteStorageAccount(connection, wallet, publicKey);
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
  };

  const handleMakeStorageImmutable = async (publicKey: string) => {
    showToast("Making storage account immutable...", "loading");
    try {
      const sig = await makeStorageImmutable(connection, wallet, publicKey);
      showToast(
        "Storage account made immutable successfully!",
        "success",
        `Transaction signature: ${sig}`
      );
    } catch (error) {
      showToast(`Error making storage immutable: ${error}`, "error");
    }
  };

  const SkeletonLoader = () => {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-14 bg-gray-800 rounded w-full"></div>
        <div className="h-14 bg-gray-800 rounded w-full"></div>
        <div className="h-14 bg-gray-800 rounded w-full"></div>
        <div className="h-14 bg-gray-800 rounded w-full"></div>
      </div>
    );
  };

  if (isLoading) {
    return <div><SkeletonLoader /></div>;
  }

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center text-center h-full">
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          Connect your wallet to view your accounts
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col`}>
      <div className="flex-1 rounded-lg dark:text-gray-300">
        <div>
          {accounts.length > 0 ? (
            <ul>
              {accounts.map((account, index) => (
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
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
        details={toast.details}
      />
    </div>
  );
};

export default StorageAccounts;
