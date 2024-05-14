import { useState, useEffect, useCallback, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { debounce } from 'lodash';
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider"; // Ensure this import points to the correct path

const useStorageAccounts = () => {
  const { drive, connection } = useSHDWDrive();
  const [accounts, setAccounts] = useState<{ publicKey: PublicKey; details?: any }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadStorageAccounts = useCallback(async () => {
    if (drive) {
      setIsLoading(true);
      try {
        await drive.init();
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const fetchedAccounts = await drive.getStorageAccounts();
        if (fetchedAccounts.length === 0) {
          throw new Error("You have not created a storage account on Shadow Drive yet.");
        }
        const accountsWithDetails = await Promise.all(
          fetchedAccounts.map(async (account) => {
            const acctDetails = await drive.getStorageAccount(account.publicKey);
            return {
              publicKey: account.publicKey,
              details: acctDetails,
            };
          })
        );
      
        setAccounts(accountsWithDetails);
      } catch (error: any) {
        console.error("Error fetching storage accounts:", error.message);
        setAccounts([]); // Ensure accounts is set to an empty array on error
      } finally {
        setIsLoading(false);
      }
    }
  }, [drive]);

  useEffect(() => {
    if (drive && connection) {
      loadStorageAccounts();
    }
  }, [loadStorageAccounts, connection, drive]);

  const throttledLog = useMemo(() => debounce((accounts: any) => {
    console.log(accounts);
  }, 100), []);

  useEffect(() => {
    throttledLog(accounts);
  }, [accounts, throttledLog]);

  return { accounts, setAccounts, isLoading };
};

export default useStorageAccounts;
