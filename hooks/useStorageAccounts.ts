import { useState, useEffect } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const useStorageAccounts = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [accounts, setAccounts] = useState<
    { publicKey: PublicKey; details?: any }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStorageAccounts = async () => {
      if (wallet && wallet.connected) {
        setIsLoading(true);
        try {
          const drive = new ShdwDrive(connection, wallet);
          await drive.init();
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
    };

    loadStorageAccounts();

    return () => {
      setAccounts([]);
      setIsLoading(false);
    };
  }, [connection, wallet]);

  return { accounts, setAccounts, isLoading };
};

export default useStorageAccounts;
