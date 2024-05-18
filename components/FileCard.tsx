import React, { useState } from "react";
import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  BiSolidFileDoc,
  BiSolidFileJson,
  BiSolidFilePdf,
  BiSolidFileTxt,
} from "react-icons/bi";
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconArrowsLeftRight,
  IconTrash,
} from "@tabler/icons-react";
import { PiFileCodeFill } from "react-icons/pi";
import { BsFileEarmarkZipFill } from "react-icons/bs";
import { Menu, rem, UnstyledButton } from "@mantine/core";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider"; // Ensure this import points to the correct path

interface FileCardProps {
  fileName: string;
  fileUrl: string;
  height?: string;
  publicKey: string;
}

const FileCard: React.FC<FileCardProps> = ({
  fileName,
  fileUrl,
  height = "110px",
  publicKey,
}) => {
  const [imageError, setImageError] = useState(false);
  const isImage = /\.(jpg|jpeg|png|gif)$/.test(fileName);
  const { drive } = useSHDWDrive();
  const wallet = useWallet();

  const fileIcon = (fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    switch (fileExtension) {
      case "pdf":
        return <BiSolidFilePdf size={54} />;
      case "docx":
      case "doc":
        return <BiSolidFileDoc size={54} />;
      case "txt":
        return <BiSolidFileTxt size={54} />;
      case "xlsx":
      case "xls":
        return "/icons/excel-icon.png";
      case "zip":
        return <BsFileEarmarkZipFill size={54} />;
      case "json":
        return <BiSolidFileJson size={54} />;
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "rs":
        return <PiFileCodeFill size={54} />;
      default:
        return "/icons/file-icon.png";
    }
  };

  const renderFileIcon = (fileName: string) => {
    const icon = fileIcon(fileName);
    if (typeof icon === "string") {
      return <Image src={icon} alt={fileName} width={54} height={54} />;
    } else {
      return icon;
    }
  };

  const deleteFile = async (publicKey: string, fileUrl: string) => {
    if (!drive || !wallet) return;
    try {
      await drive.deleteFile(new PublicKey(publicKey), fileUrl);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="fade-in border border-[#cbcbcb] dark:border-[#3b3b3b] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-[#ededed] dark:bg-[#292e31]">
      <div
        className={`flex justify-center items-center overflow-hidden bg-[#363b3e]`}
        style={{ height: height }}
      >
        {isImage ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src={fileUrl}
              alt={fileName}
              width={200}
              height={200}
              layout="intrinsic"
              objectFit="contain"
              onError={() => setImageError(true)}
            />
          </a>
        ) : (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 flex justify-center items-center"
          >
            {renderFileIcon(fileName)}
          </a>
        )}
      </div>
      <div className="py-1 px-3 h-full">
        <div className="flex justify-between">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="my-auto text-xs py-2 font-medium text-gray-800 dark:text-gray-300 hover:text-blue-600 transition-colors duration-300 overflow-hidden whitespace-nowrap text-ellipsis"
          >
            {fileName}
          </a>
          <Menu
            position="bottom-end"
            offset={11}
            withArrow
            shadow="lg"
            width={200}
          >
            <Menu.Target>
              <UnstyledButton className="">
                <div className="px-1">
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full"></div>
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                  <div className="block h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                </div>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown bg="#181c20">
              <Menu.Label>Application</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Settings
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconMessageCircle
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                Copy Link
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Gallery
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={
                  <IconArrowsLeftRight
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                Transfer my data
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={async () => {
                  try {
                    await deleteFile(publicKey, fileUrl);
                  } catch (error) {
                    console.error("Error deleting file:", error);
                  }
                }}
              >
                Delete File
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
