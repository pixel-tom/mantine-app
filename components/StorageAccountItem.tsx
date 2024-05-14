import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { Menu, rem, UnstyledButton } from '@mantine/core';
import { IconSettings, IconTrash } from '@tabler/icons-react';

interface StorageAccountItemProps {
  account: {
    publicKey: PublicKey;
    details?: any;
  };
  onClick: (publicKey: string) => void;
  makeStorageImmutable: (publicKey: string) => Promise<void>;
  deleteStorageAccount: (publicKey: string) => Promise<void>;
  formatBytes: (bytes: number, decimals?: number) => string;
}

const StorageAccountItem: React.FC<StorageAccountItemProps> = ({
  account,
  onClick,
  makeStorageImmutable,
  deleteStorageAccount,
  formatBytes,
}) => {

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <li
      className="py-5 relative hover:bg-[#24292d]  focus:border focus:border-black focus-visible:border focus-visible:border-black rounded-md"
      
    >
      <div className="flex items-center justify-between px-3">
        <div className="flex space-x-3">
          <div onClick={() => onClick(account.publicKey.toString())} className="text-sm p-1 font-semibold text-gray-100 hover:cursor-pointer">
            {account.details.identifier}
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <p className="px-3 py-1 mr-1 my-auto text-[10px] font-bold rounded-full bg-gradient-to-tr from-[#363b3e] to-[#323232] text-blue-200 shadow-sm">
            {formatBytes(account.details.storage.toNumber())}
          </p>
          <Menu
            position="bottom-end"
            offset={11}
            withArrow
            shadow="lg"
            width={200}
            floatingStrategy="absolute"
          >
            <Menu.Target>
              <UnstyledButton
                onClick={handleMenuClick}
                className="hover:bg-[#31383c]  rounded"
              >
                <div className="flex px-2 flex-col items-center justify-center" >
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full"></div>
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                </div>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown bg="#232a2d">
              <Menu.Label>{account.details.identifier}</Menu.Label>
              <Menu.Item
                onClick={() => makeStorageImmutable(account.publicKey.toString())}
                leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
              >
                Make Immutable
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                onClick={() => deleteStorageAccount(account.publicKey.toString())}
                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
              >
                Delete Account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </li>
  );
};

// Add display name to the memoized component
const MemoizedStorageAccountItem = React.memo(StorageAccountItem);
MemoizedStorageAccountItem.displayName = "StorageAccountItem";

export default MemoizedStorageAccountItem;
