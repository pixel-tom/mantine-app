import { useState, useEffect, useCallback, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider";

const useStorageAccounts = () => {
  const { drive, connection } = useSHDWDrive();
  const [accounts, setAccounts] = useState<
    { publicKey: PublicKey; details?: any }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const loadStorageAccounts = useCallback(async () => {
    if (drive) {
      setIsLoading(true);
      try {
        await drive.init();
        const fetchedAccounts = await drive.getStorageAccounts();
        if (fetchedAccounts.length === 0) {
          throw new Error(
            "You have not created a storage account on Shadow Drive yet."
          );
        }
        const accountsWithDetails = await Promise.all(
          fetchedAccounts.map(async (account) => {
            const acctDetails = await drive.getStorageAccount(
              account.publicKey
            );
            return {
              publicKey: account.publicKey,
              details: acctDetails,
            };
          })
        );

        setAccounts(accountsWithDetails);
        setHasFetched(true);
      } catch (error: any) {
        console.error("Error fetching storage accounts:", error.message);
        setAccounts([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [drive]);

  useEffect(() => {
    if (drive && !hasFetched) {
      loadStorageAccounts();
    }
  }, [drive, hasFetched, loadStorageAccounts]);

  return { accounts, setAccounts, isLoading };
};

export default useStorageAccounts;
