import React, { useState, useEffect, useRef } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { MdInfo } from "react-icons/md";
import { useRouter } from "next/router";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@mantine/core";
import { IconDownload, IconPlus } from "@tabler/icons-react";

const CreateStorageAccount: React.FC = () => {
  const [accountName, setAccountName] = useState<string>("");
  const [storageSize, setStorageSize] = useState<number>(10);
  const [storageUnit, setStorageUnit] = useState<string>("MB");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { showToast } = useToast();
  const { connection } = useConnection();
  const wallet = useWallet();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateDrive = async () => {
    try {
      showToast("Creating new drive...", "loading");
      if (!wallet.connected) {
        throw new Error("Wallet is not connected");
        return;
      }
      if (!storageSize) {
        throw new Error("Select a storage size.");
        return;
      }
      const size = `${storageSize}${storageUnit}`;
      const drive = new ShdwDrive(connection, wallet);
      await drive.init();
      const newAccount = await drive.createStorageAccount(accountName, size);
      setShowModal(false);
      showToast("Drive created!", "success");
      setShowModal(false);
      router.push(`/account/${newAccount.shdw_bucket}`);
    } catch (error: any) {
      showToast(`${error.message.toString()}`, "error");
      console.error("Error creating new drive:", error);
    }
  };

  return (
    <div>
      <Button
        rightSection={<IconPlus size={14} />}
        onClick={() => setShowModal(true)}
        variant="default"
        color="orange"
      >
        <p className="text-gray-100">New</p>
      </Button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 shadow-2xl">
          <div
            ref={modalRef}
            className="w-full max-w-md bg-[#292e31] rounded-lg shadow-lg relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-2 m-2 text-lg font-bold text-gray-900"
            >
              <p className="text-white text-2xl">&times;</p>
            </button>
            <div className="w-full bg-gradient-to-br from-[#5D616D]/50 to-[#A5ACBC]/50 py-10 rounded-t-lg">
              <Image
                src={
                  "https://assets-global.website-files.com/653ae95e36bd81f87299010a/653bfaddaa8ce3747b4adab9_ShdwDrive_Stacked_Black_Green.svg"
                }
                alt={""}
                width={100}
                height={100}
                className="mx-auto"
              />
            </div>
            <div className="p-8">
              <div className="mb-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-100">
                  Create a Storage Drive
                </h2>
                <p className="text-sm text-gray-400">
                  Enter the details for your new storage account below.
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-400"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="ex. Ohmies"
                  className="mt-1 text-gray-100 block w-full px-3 py-2 bg-[#181c20] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="size"
                  className="block text-sm font-semibold text-gray-400"
                >
                  Storage Size
                </label>
                <div className="mt-1 w-full flex rounded-md">
                  <input
                    id="size"
                    type="number"
                    value={storageSize}
                    onChange={(e) => setStorageSize(Number(e.target.value))}
                    placeholder="Size"
                    className="flex-1 max-w-48 text-gray-100 px-3 py-2 bg-[#181c20] border border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                    min={1}
                    required
                  />
                  <select
                    value={storageUnit}
                    onChange={(e) => setStorageUnit(e.target.value)}
                    className="text-gray-200 px-3 bg-[#181c20] border-b border-t border-r border-gray-600 rounded-r-md shadow-sm focus:outline-none focus:ring-green-400 focus:border-green-400"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                  </select>
                  <MdInfo className="text-gray-300 h-6 w-6 ml-2 my-auto" />
                </div>
              </div>
              <div className=" flex justify-end mt-6 gap-4">
                <p className="mt-auto text-gray-500 text-xs">
                  You will be charged SOL and $SHDW
                </p>
                <button
                  onClick={handleCreateDrive}
                  className="flex-end py-2 px-5 bg-[#181c20] text-white border border-[#11FA98] rounded-md"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStorageAccount;
