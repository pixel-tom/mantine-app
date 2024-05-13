import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-[#24292d] py-3 px-6">
      <input type='text' placeholder='Search for Account by Address..' className='w-1/2 py-3 px-5 bg-[#181c20] rounded-md'/>
      <WalletMultiButton />
    </div>
  );
};

export default Header;
