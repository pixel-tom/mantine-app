import React, { useState, useEffect, FC, useMemo, useCallback } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Upload from "@/components/UploadFileModal";
import Create from "@/components/Create";
import FileCard from "@/components/FileCard";
import ListView from "@/components/ListView";
import { LuLayoutGrid } from "react-icons/lu";
import { IoIosList } from "react-icons/io";
import {
  Slider,
  Text,
  UnstyledButton,
  HoverCard,
  Group,
} from "@mantine/core";
import { FaHardDrive } from "react-icons/fa6";
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import Loading from "./Loading";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider";
import { useToast } from "@/contexts/ToastContext";

const AccountDetails: FC<{ publicKey: string }> = ({ publicKey }) => {
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [gridCols, setGridCols] = useState<number>(5);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const [animate, setAnimate] = useState(false);
  const { drive } = useSHDWDrive();
  const { showToast } = useToast();

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
        await drive.makeStorageImmutable(new PublicKey(publicKey));
        showToast(`Drive is now Immutable!`, "success");
      } catch (error: any) {
        showToast(`${error.message}`, "error");
      }
    },
    [drive, wallet, showToast]
  );

  const fetchFiles = useCallback(async () => {
    if (!wallet || !wallet.connected || !publicKey) {
      console.error("Wallet not connected or public key is invalid.");
      return;
    }

    try {
      const drive = new ShdwDrive(connection, wallet);
      await drive.init();
      const pubKey = new PublicKey(publicKey);

      const listItems = await drive.listObjects(pubKey);
      if (!listItems || !listItems.keys) {
        console.error("Failed to retrieve list of objects.");
        return;
      }

      setFiles(listItems.keys);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [wallet, connection, publicKey]);

  const fetchStorageAccountDetails = useCallback(async () => {
    if (!wallet || !wallet.connected || !publicKey) {
      console.error("Wallet not connected or public key is invalid.");
      return;
    }

    try {
      const drive = new ShdwDrive(connection, wallet);
      await drive.init();
      const pubKey = new PublicKey(publicKey);

      const acct = await drive.getStorageAccountInfo(pubKey);
      if (!acct) {
        console.error("Failed to retrieve storage account information.");
        return;
      }

      setAccountDetails(acct);

      await fetchFiles();
      setIsOwner(acct.owner1.toString() === wallet.publicKey?.toString());
    } catch (error) {
      console.error("Error fetching storage account details:", error);
    }
  }, [wallet, connection, publicKey, fetchFiles]);

  useEffect(() => {
    fetchStorageAccountDetails();
    setAnimate(true);
  }, [fetchStorageAccountDetails]);

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    }),
    [gridCols]
  );

  const usagePercentage = useMemo(
    () =>
      (accountDetails?.current_usage / accountDetails?.reserved_bytes) * 100,
    [accountDetails]
  );

  if (!accountDetails) {
    return <Loading />;
  }

  const marks = [
    { value: 2, label: "xs" },
    { value: 3, label: "sm" },
    { value: 4, label: "md" },
    { value: 5, label: "md" },
    { value: 6, label: "lg" },
    { value: 7, label: "md" },
    { value: 8, label: "xl" },
    { value: 9, label: "md" },
    { value: 10, label: "md" },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className={`text-white exo-2 p-4 ${animate ? "fade-in" : "hidden"}`}>
      <div className="flex flex-row justify-between mb-4 items-center">
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <p className="font-semibold mt-auto text-xl px-4">
              {accountDetails.identifier}
            </p>
            <div className="flex gap-4 text-gray-200">
              <p className="my-auto text-sm font-semibold text-gray-300 mr-3">
                <span className="text-gray-500 text-xs mr-1">Owner</span>{" "}
                {formatAddress(accountDetails.owner1.toString())}
              </p>
              <p className="py-2 px-4 bg-none border border-[#11FA98] text-black text-sm font-semibold rounded-lg shadow-md">
                {accountDetails.immutable ? (
                  <div className="flex text-sm font-bold text-gray-200">
                    <Group justify="center">
                      <HoverCard shadow="md" closeDelay={700} withArrow>
                        <HoverCard.Target>
                          <UnstyledButton>
                            <MdLockOutline className="text-gray-200 h-4 w-4" />
                          </UnstyledButton>
                        </HoverCard.Target>
                        <HoverCard.Dropdown bg={'#181c20'}>
                          <Text size="sm" className="text-center">
                            Account is Immutable
                          </Text>
                          <Text size="xs" color="#666666" className="text-center ">
                            No changes can be made
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Group>
                  </div>
                ) : (
                  <div onClick={() => handleMakeStorageImmutable(accountDetails.storage_account.toString())} className="flex text-sm font-bold text-gray-200">
                    <Group justify="center">
                      <HoverCard shadow="md" closeDelay={700} withArrow>
                        <HoverCard.Target>
                          <UnstyledButton>
                            <MdLockOpen className="text-gray-200 h-4 w-4" />
                          </UnstyledButton>
                        </HoverCard.Target>
                        <HoverCard.Dropdown bg={'#181c20'}>
                          <Text size="sm" className="text-center">
                            Account is Mutable
                          </Text>
                          <Text size="sm">
                            Click to change mutability status
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Group>
                  </div>
                )}
              </p>
              <p className="ml-5 mb-2 font-semibold">
                <FaHardDrive className="h-6 w-6 my-auto text-[#6d787e]" />
              </p>
              <div className="w-64 my-auto items-center">
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                  <div
                    className=" bg-gradient-to-b from-green-300 to-green-500 h-3 rounded-full"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs ml-5 mt-2 font-medium text-gray-200">
                  {formatBytes(accountDetails.current_usage)} <span className="text-gray-400">of</span>{" "}
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
      <div className="border border-[#323b43] shadow overflow-hidden rounded-lg px-6 pt-3 fade-in">
        <div className="flex flex-row justify-between pt-2">
          <h4 className="text-lg my-auto mb-2">Files</h4>
          <div className="flex">
            <div className="flex flex-row my-auto">
              {viewMode === "grid" && (
                <Slider
                  color={"#11FA98"}
                  defaultValue={4}
                  max={10}
                  min={3}
                  value={gridCols}
                  onChange={setGridCols}
                  step={1}
                  marks={marks}
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
              {isOwner && <Upload selectedAccount={publicKey} onUploadSuccess={fetchFiles} />}
            </div>
            <div className="ml-6">
              {isOwner && <Create selectedAccount={publicKey} onUploadSuccess={fetchFiles} />}
            </div>
          </div>
        </div>
        {files.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Storage Account is empty
          </div>
        ) : viewMode === "grid" ? (
          <div
            style={gridStyle}
            className="grid gap-4 mt-4 fade-in overflow-auto"
          >
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

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
