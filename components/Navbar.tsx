import React, { useState, useEffect } from 'react';
import CreateStorageAccount from '@/components/CreateStorageAccount';
import StorageAccounts from '@/components/Drives';
import SwapInterface from '@/components/SwapInterface';
import Image from 'next/image';

interface NavbarProps {
  onAccountSelect: (publicKey: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAccountSelect }) => {
  const [isSwapVisible, setIsSwapVisible] = useState(false);
  const [divStyle, setDivStyle] = useState({
    maxHeight: '0px',
    opacity: 0,
    transition: 'max-height 0.5s ease, opacity 0.5s ease',
    overflow: 'hidden'
  });

  useEffect(() => {
    if (isSwapVisible) {
      setDivStyle({
        maxHeight: '500px', // Adjust as necessary
        opacity: 1,
        transition: 'max-height 0.5s ease, opacity 0.5s ease',
        overflow: 'hidden'
      });
    } else {
      setDivStyle({
        maxHeight: '0px',
        opacity: 0,
        transition: 'max-height 0.5s ease, opacity 0.5s ease',
        overflow: 'hidden'
      });
    }
  }, [isSwapVisible]);

  const toggleSwapVisibility = () => {
    setIsSwapVisible(!isSwapVisible);
  };

  return (
    <div
      className="flex flex-col h-full p-4"
      style={{
        maxWidth: '380px',
        width: '100%',
        backgroundColor: '#181c20',
        color: '#fff',
      }}
    >
      <div className='flex space-x-1 mb-10'>
        <Image src={'/scoop-logo.svg'} alt={''} height={50} width={50}></Image>
        <h1 className='font-bold text-4xl'>Scoop</h1>
      </div>
      
      <div className='flex items-center justify-between mb-6 px-2'>
        <h1 className='font-semibold text-gray-200'>My Drives</h1>
        <CreateStorageAccount />
      </div>
      <div className="flex-grow overflow-y-auto">
        <StorageAccounts onAccountSelect={onAccountSelect} />
      </div>
      <div className="mt-auto">
        <button
          onClick={toggleSwapVisibility}
          className="w-full  text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {isSwapVisible ? 'Hide' : 'Need $SHDW?'}
        </button>
        <div style={{ ...divStyle, marginTop: '16px' }}>
          <SwapInterface />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
