import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Connection } from '@solana/web3.js';
import { ShdwDrive } from "@shadow-drive/sdk"; // Replace with the actual SDK import if it's different
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SOLANA_API } from '@/constants/constants';

interface SHDWDriveContextType {
  drive: ShdwDrive | null;
  
}

interface SHDWDriveProviderProps {
  children: ReactNode;
}

const SHDWDriveContext = createContext<SHDWDriveContextType | null>(null);

export const SHDWDriveProvider: React.FC<SHDWDriveProviderProps> = ({ children }) => {
  const wallet = useWallet();
  const [drive, setDrive] = useState<ShdwDrive | null>(null);

  useEffect(() => {
    const conn = new Connection(SOLANA_API, 'processed');
    const initializeDrive = async () => {
      if (wallet.connected) {
        const driveInstance = new ShdwDrive(conn, wallet); // Initialize the ShdwDrive instance
        setDrive(driveInstance);
      }
    };

    initializeDrive();
  }, [wallet]);

  return (
    <SHDWDriveContext.Provider value={{ drive }}>
      {children}
    </SHDWDriveContext.Provider>
  );
};

export const useSHDWDrive = (): SHDWDriveContextType => {
  const context = useContext(SHDWDriveContext);
  if (!context) {
    throw new Error('useSHDWDrive must be used within a SHDWDriveProvider');
  }
  return context;
};
