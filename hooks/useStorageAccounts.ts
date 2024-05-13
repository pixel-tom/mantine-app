import { useState, useEffect } from 'react';
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const useStorageAccounts = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [accounts, setAccounts] = useState<{ publicKey: PublicKey; details?: any }[]>([]);
  const [isLoading, setIsLoading] = useState(false);  // Added loading state

  useEffect(() => {
    const loadStorageAccounts = async () => {
      if (wallet && wallet.connected) {
        setIsLoading(true);  // Set loading to true at the start of data fetching
        const drive = new ShdwDrive(connection, wallet);
        await drive.init();
        const fetchedAccounts = await drive.getStorageAccounts();
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
        setIsLoading(false);  // Set loading to false once data is fetched
      }
    };

    loadStorageAccounts();

    // Optionally, consider cleaning up in case the wallet disconnects
    return () => {
      setAccounts([]);
      setIsLoading(false);  // Ensure loading is reset on unmount
    };

  }, [connection, wallet]);

  return { accounts, setAccounts, isLoading };  // Now returning isLoading as well
};

export default useStorageAccounts;
