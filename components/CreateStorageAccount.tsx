import React, { useState, useEffect, useRef } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { MdInfo } from "react-icons/md";
import Toast from "./Toast";

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

const CreateStorageAccount: React.FC = () => {
  const [accountName, setAccountName] = useState<string>("");
  const [storageSize, setStorageSize] = useState<number>(10);
  const [storageUnit, setStorageUnit] = useState<string>("MB");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    details: "",
    type: "info",
  });

  const wallet = useWallet();
  const { connection } = useConnection();

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

  const handleCreateAccount = async () => {
    if (!wallet.connected) {
      setToast({
        show: true,
        message: "Please connect your wallet.",
        details: "",
        type: "error",
      });
      return;
    }

    if (!storageSize) {
      setToast({
        show: true,
        message: "Please enter a Storage Size.",
        details: "",
        type: "error",
      });
      return;
    }

    if (!wallet.connected) {
      alert("Please connect your wallet first.");
      return;
    }

    setToast({
      show: true,
      message: "Creating account...",
      details: "",
      type: "loading",
    });

    const size = `${storageSize}${storageUnit}`;
    const drive = new ShdwDrive(connection, wallet);
    await drive.init();
    const newAccount = await drive.createStorageAccount(accountName, size);
    setShowModal(false);
    setToast({
      show: true,
      message: "File uploaded successfully!",
      details: "",
      type: "success",
    });
    console.log(newAccount);
    setToast({
      show: true,
      message: "Error uploading file.",
      details: "",
      type: "error",
    });
    setShowModal(false);
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="pb-1 pt-0 px-3 text-center bg-gradient-to-tr from-[#363b3e] to-[#323232] text-[#11FA98] border border-[#11FA98] text-2xl rounded-lg shadow-sm hover:bg-[#303030]"
      >
        +
      </button>

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
            <div className="w-full bg-gradient-to-br from-[#996bba]/50 to-[#506ac7]/50 py-10 rounded-t-lg">
              <Image
                src={
                  "https://assets-global.website-files.com/653ae95e36bd81f87299010a/653bfac986a961f71aecfa95_ShdwDrive_Stacked_AllWhite.svg"
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
                  className="mt-1 text-gray-100 block w-full px-3 py-2 bg-[#434343] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400"
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
                    className="flex-1 max-w-48 text-gray-100 px-3 py-2 bg-[#434343] border border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400"
                    min={1}
                    required
                  />
                  <select
                    value={storageUnit}
                    onChange={(e) => setStorageUnit(e.target.value)}
                    className="text-gray-200 px-3 bg-[#434343] border-b border-t border-r border-gray-600 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                  </select>
                  <MdInfo className="text-gray-300 h-6 w-6 ml-2 my-auto" />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleCreateAccount}
                  className="w-full py-2 bg-[#272727] text-white border border-[#506ac7] rounded-md hover:bg-[#506ac7]"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
        details={toast.details}
      />
    </div>
  );
};

export default CreateStorageAccount;
