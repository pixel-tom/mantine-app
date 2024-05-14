import { useState, useEffect, useCallback, useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { debounce } from 'lodash';
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider"; // Ensure this import points to the correct path

const useStorageAccounts = () => {
  const { drive, connection } = useSHDWDrive();
  const [accounts, setAccounts] = useState<{ publicKey: PublicKey; details?: any }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Add a flag to indicate if accounts have been fetched

  const loadStorageAccounts = useCallback(async () => {
    if (drive) {
      setIsLoading(true);
      try {
        await drive.init();
        // Simulate a delay
        
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
        setHasFetched(true); // Set the flag to indicate accounts have been fetched
      } catch (error: any) {
        console.error("Error fetching storage accounts:", error.message);
        setAccounts([]); // Ensure accounts is set to an empty array on error
      } finally {
        setIsLoading(false);
      }
    }
  }, [drive]);

  useEffect(() => {
    if (drive && !hasFetched) {
      loadStorageAccounts();
    }
  }, [drive, hasFetched, loadStorageAccounts]); // Include hasFetched to prevent re-fetching

  return { accounts, setAccounts, isLoading };
};

export default useStorageAccounts;
