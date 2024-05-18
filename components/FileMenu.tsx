import React, { useState, FC } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  Menu,
  rem,
  UnstyledButton,
} from "@mantine/core";
import {
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
import { useToast } from '@/contexts/ToastContext';

type FileDetail = {
  name: string;
  size?: string;
};

type FileMenuProps = {
  file: FileDetail;
  publicKey: string;
};

const FileMenu: FC<FileMenuProps> = ({ file, publicKey }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [ copySuccess, setCopySuccess ] = useState("");
  const { showToast } = useToast();

  const deleteFile = async (fileUrl: string) => {
    const drive = await new ShdwDrive(connection, wallet).init();
    const pubKey = new PublicKey(publicKey);
    const sig = await drive.deleteFile(pubKey, fileUrl);
    console.log(sig);
  };

  const fileUrl = `https://shdw-drive.genesysgo.net/${publicKey}/${file.name}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(fileUrl)
      .then(() => {
        setCopySuccess("Link copied!");
        showToast("Link copied to clipboard", "success");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setCopySuccess("Failed to copy link");
        showToast("Failed to copy link", "error");
      });
  };

  return (
    <>
      <Menu position="bottom-end" offset={11} withArrow shadow="lg" width={200}>
        <Menu.Target>
          <UnstyledButton>
            <div className="px-3">
              <div className="block ml-auto mr-5 h-[3px] w-[3px] bg-gray-400 rounded-full"></div>
              <div className="block ml-auto mr-5 h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
              <div className="block ml-auto mr-5 h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
            </div>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown bg="#181c20">
          <Menu.Label>{file.name}</Menu.Label>
          <Menu.Item
            leftSection={
              <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={handleCopyLink}
          >
            Copy Link
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconArrowsLeftRight
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Update File
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => deleteFile(fileUrl)}
          >
            Delete File
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default FileMenu;
