import React, { useState, useEffect, FC } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Upload from "@/components/UploadFile";
import FileCard from "@/components/FileCard";
import { LuLayoutGrid } from "react-icons/lu";
import { IoIosList } from "react-icons/io";
import {
  Menu,
  Button,
  Slider,
  Text,
  rem,
  UnstyledButton,
  HoverCard,
  Group,
} from "@mantine/core";
import {
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";

import Image from "next/image";
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { FaHardDrive } from "react-icons/fa6";

type FileDetail = {
  name: string;
  size?: string;
};

type ListViewProps = {
  files: string[];
  publicKey: string;
};

const AccountDetails: React.FC<{ publicKey: string }> = ({ publicKey }) => {
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [gridCols, setGridCols] = useState<number>(5);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    fetchStorageAccountDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, connection, publicKey]);

  const fetchStorageAccountDetails = async () => {
    if (wallet && wallet.connected && publicKey) {
      const drive = new ShdwDrive(connection, wallet);
      await drive.init();
      const pubKey = new PublicKey(publicKey);
      const acct = await drive.getStorageAccountInfo(pubKey);
      setAccountDetails(acct);
      const listItems = await drive.listObjects(pubKey);
      setFiles(listItems.keys);
      console.log(acct);
    }
  };

  const refreshFiles = async () => {
    await fetchStorageAccountDetails();
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
  };

  const deleteFile = async (publicKey: string, fileUrl: string) => {
    const drive = await new ShdwDrive(connection, wallet).init();
    const pubKey = new PublicKey(publicKey);
    const sig = await drive.deleteFile(pubKey, fileUrl);
    console.log(sig);
  };

  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const usagePercentage =
    (accountDetails?.current_usage / accountDetails?.reserved_bytes) * 100;

  const ListView: FC<ListViewProps> = ({ files, publicKey }) => {
    const [fileDetails, setFileDetails] = useState<FileDetail[]>(
      files.map((file) => ({ name: file }))
    );

    useEffect(() => {
      const fetchFileSizes = async () => {
        const promises = files.map(async (file, index) => {
          const fileUrl = `https://shdw-drive.genesysgo.net/${publicKey}/${file}`;
          try {
            const response = await fetch(fileUrl, { method: "HEAD" });
            const sizeBytes = response.headers.get("content-length");
            const size = sizeBytes
              ? `${(parseInt(sizeBytes) / 1024).toFixed(2)} KB`
              : "Unknown";
            return { name: file, size };
          } catch (error) {
            console.error("Error fetching file size for:", file, error);
            return { name: file, size: "Error" };
          }
        });
        const results = await Promise.all(promises);
        setFileDetails(results);
      };

      fetchFileSizes();
    }, [files, publicKey]);

    return (
      <div className="w-full mt-4">
        <div className="w-full grid grid-cols-12 gap-4 text-left text-sm text-gray-500 font-semibold py-2">
          <div className="col-span-1"></div>
          <div className="col-span-6 px-5">Name</div>
          <div className="col-span-2 px-3">File Type</div>
          <div className="col-span-2 px-3">File Size</div>
          <div className="col-span-1"></div>
        </div>
        {fileDetails.map((file, index) => {
          const fileUrl = `https://shdw-drive.genesysgo.net/${publicKey}/${file.name}`;
          const fileType = file.name.includes(".")
            ? file.name.split(".").pop()
            : "Unknown";

          return (
            <div
              key={index}
              className={`grid grid-cols-12 gap-4 h-14 items-center p-2 rounded-md mb-2 hover:border hover:border-[#586166] ${
                index % 2 === 0 ? "bg-[#363b3e]" : "bg-[#2f3437]"
              }`}
            >
              <div className="col-span-2 sm:col-span-1 px-4">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={fileUrl}
                    alt=""
                    width={40}
                    height={40}
                    layout="intrinsic"
                    objectFit="contain"
                    className="rounded-md bg-gray-400"
                  />
                </a>
              </div>
              <div className="col-span-6 px-4">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm text-blue-50 hover:text-blue-200"
                >
                  {file.name}
                </a>
              </div>
              <div className="text-sm col-span-2 px-4">{fileType}</div>
              <div className="text-sm col-span-2 px-4 text-gray-400">
                {file.size}
              </div>

              <Menu
                position="bottom-end"
                offset={11}
                withArrow
                shadow="lg"
                width={200}
              >
                <Menu.Target>
                  <UnstyledButton>
                    <div className="px-3">
                      <div className="block ml-auto mr-5 h-[3px] w-[3px] bg-gray-400 rounded-full"></div>
                      <div className="block ml-auto mr-5 h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                      <div className="block ml-auto mr-5 h-[3px] w-[3px] bg-gray-400 rounded-full mt-1"></div>
                    </div>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>{file.name}</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconMessageCircle
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                    onClick={async () => {
                      try {
                        await deleteFile(publicKey, fileUrl);
                      } catch (error) {
                        console.error("Error deleting file:", error);
                      }
                    }}
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
          );
        })}
      </div>
    );
  };

  if (!accountDetails) {
    return <div>Loading account details...</div>;
  }

  const marks = [
    { value: 2, label: "xs" },
    { value: 3, label: "sm" },
    { value: 4, label: "md" },
    { value: 6, label: "lg" },
    { value: 8, label: "xl" },
  ];

  return (
    <div className="text-white exo-2  py-4">
      <div className="flex flex-row justify-between mb-4 items-center">
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <p className="font-semibold mt-auto text-2xl px-4">
              {accountDetails.identifier}
            </p>
            <div className="flex gap-4 text-gray-200">
              <p className="py-2 px-4 bg-none border border-blue-400 text-black text-sm font-semibold rounded-lg shadow-md">
                {accountDetails.immutable ? (
                  <div className="flex gap-1 text-sm font-bold text-gray-200">
                    <Group justify="center">
                      <HoverCard shadow="md" closeDelay={700} withArrow>
                        <HoverCard.Target>
                          <Button>
                            <MdLockOutline className="my-auto text-gray-200 h-4 w-4" />
                          </Button>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">Will close with 1000ms delay</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Group>
                  </div>
                ) : (
                  <div className="flex  text-sm font-bold text-gray-200">
                    <Group justify="center">
                      <HoverCard shadow="md" closeDelay={700} withArrow>
                        <HoverCard.Target>
                          <UnstyledButton>
                            <MdLockOpen className=" text-gray-200 h-4 w-4 " />
                          </UnstyledButton>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm" className="text-center">Account is Mutable</Text>
                          <Text size="sm">Click to change mutability status</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Group>
                  </div>
                )}
              </p>
              <p className="ml-5 mb-2 font-semibold">
                <FaHardDrive className="h-6 w-6 my-auto text-[#6d787e]" />
              </p>
              <div className=" w-64 my-auto items-center">
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs ml-5 mt-2 font-medium text-gray-200">
                  {formatBytes(accountDetails.current_usage)} of{" "}
                  {formatBytes(accountDetails.reserved_bytes)}{" "}
                  <span className="font-medium">{`(${usagePercentage.toFixed(
                    2
                  )} %)`}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#323b43] shadow overflow-hidden rounded-lg px-6 py-3">
        <div className="flex flex-row justify-between py-2">
          <h4 className="text-lg my-auto mb-2">Files</h4>
          <div className="flex">
            <div className="flex flex-row my-auto">
              {viewMode === "grid" && (
                <Slider
                  defaultValue={4}
                  max={10}
                  min={3}
                  value={gridCols}
                  onChange={setGridCols}
                  step={1}
                  marks={[
                    { value: 3 },
                    { value: 4 },
                    { value: 5 },
                    { value: 6 },
                    { value: 7 },
                    { value: 8 },
                    { value: 9 },
                    { value: 10 },
                  ]}
                  styles={{ markLabel: { display: "none" } }}
                  className="w-32 my-auto"
                />
              )}

              <div className="flex ml-6">
                <button onClick={() => setViewMode("grid")} className="p-2">
                  <LuLayoutGrid className="text-gray-200 h-5 w-5" />
                </button>
                <button onClick={() => setViewMode("list")} className="p-2">
                  <IoIosList className="text-gray-200 h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="ml-6">
              <Upload selectedAccount={publicKey} />
            </div>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Storage Account is empty. Upload files to get started.
          </div>
        ) : viewMode === "grid" ? (
          <div style={gridStyle} className="grid gap-4 mt-4">
            {files.map((file, index) => (
              <FileCard
                key={index}
                fileName={file}
                fileUrl={`https://shdw-drive.genesysgo.net/${publicKey}/${file}`}
                publicKey={publicKey}
              />
            ))}
          </div>
        ) : (
          <ListView files={files} publicKey={publicKey} />
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
