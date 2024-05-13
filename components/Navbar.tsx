import React from 'react';
import CreateStorageAccount from '@/components/CreateStorageAccount';
import StorageAccounts from '@/components/Drives';
import SwapInterface from '@/components/SwapInterface';

interface NavbarProps {
  onAccountSelect: (publicKey: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAccountSelect }) => {
  return (
    <div
      className="flex flex-col h-full p-4"
      style={{
        maxWidth: '400px',
        backgroundColor: '#181c20',
        color: '#fff',
      }}
    >
      <div className='flex items-center justify-between mb-6'>
        <h1>My Drives</h1>
        <CreateStorageAccount />
      </div>
      <div className="flex-grow overflow-y-auto">
        <StorageAccounts onAccountSelect={onAccountSelect} />
      </div>
      <div className="mt-auto">
        <SwapInterface />
      </div>
    </div>
  );
};

export default Navbar;
