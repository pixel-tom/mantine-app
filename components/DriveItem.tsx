import React, { useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { Menu, Pill, rem, UnstyledButton } from "@mantine/core";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useToast } from "@/contexts/ToastContext";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider";
import { useWallet } from "@solana/wallet-adapter-react";

interface DriveItemProps {
  account: {
    publicKey: PublicKey;
    details?: any;
  };
  onClick: (publicKey: string) => void;
  deleteStorageAccount: (publicKey: string) => Promise<void>;
  formatBytes: (bytes: number, decimals?: number) => string;
}

const DriveItem: React.FC<DriveItemProps> = ({
  account,
  onClick,
  deleteStorageAccount,
  formatBytes,
}) => {
  const { drive } = useSHDWDrive();
  const wallet = useWallet();
  const { showToast } = useToast();

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMakeStorageImmutable = useCallback(
    async (publicKey: string) => {
      showToast("Making storage account immutable...", "loading");
      try {
        if (!drive) {
          throw new Error("Drive is not connected");
        }
        if (!wallet || !wallet.connected) {
          throw new Error("Wallet is not connected");
        }
        const sig = await drive.makeStorageImmutable(new PublicKey(publicKey));
        showToast(`Drive is now Immutable!`, "success");
      } catch (error: any) {
        showToast(`${error.message}`, "error");
      }
    },
    [drive, wallet, showToast]
  );

  return (
    <li className="py-3 my-2 relative hover:bg-[#242424]  focus:border focus:border-black focus-visible:border focus-visible:border-black rounded-md">
      <div className="flex items-center justify-between px-3">
        <div className="flex space-x-3">
          <div
            onClick={() => onClick(account.publicKey.toString())}
            className="text-sm p-1 font-medium text-gray-100 hover:cursor-pointer"
          >
            {account.details.identifier}
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          
          <Menu
            position="bottom-end"
            offset={11}
            withArrow
            shadow="lg"
            width={200}
            floatingStrategy="absolute"
          >
            <Menu.Target>
              <UnstyledButton onClick={handleMenuClick} className="rounded">
                <div className="flex px-2 flex-col items-center justify-center">
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full"></div>
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                </div>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown bg="#2e2e2e">
              <Menu.Label>{account.details.identifier}</Menu.Label>
              <Menu.Item
                onClick={() =>
                  handleMakeStorageImmutable(account.publicKey.toString())
                }
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Make Immutable
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                onClick={() =>
                  deleteStorageAccount(account.publicKey.toString())
                }
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
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

const MemoizedDriveItem = React.memo(DriveItem);
MemoizedDriveItem.displayName = "StorageAccountItem";

export default MemoizedDriveItem;
