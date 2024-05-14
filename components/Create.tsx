import React, { useState, useEffect, useRef } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Toast from "./Toast";
import {
  splTokenTemplate,
  nftTemplate,
  usefulFile1,
  usefulFile2,
} from "@/templates";

interface CreateProps {
  selectedAccount: string | null;
}

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

type TemplateKeys =
  | "SPL Token"
  | "Metaplex NFT Metadata"
  | "Other Useful File"
  | "Other Useful File 2";

const Create: React.FC<CreateProps> = ({ selectedAccount }) => {
  const [content, setContent] = useState<string>("");
  const [fileType, setFileType] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    details: "",
    type: "info",
  });
  const { connection } = useConnection();
  const wallet = useWallet();
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const templates: Record<TemplateKeys, string> = {
    "SPL Token": splTokenTemplate,
    "Metaplex NFT Metadata": nftTemplate,
    "Other Useful File": usefulFile1,
    "Other Useful File 2": usefulFile2,
  };

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

  const handleFileUpload = async () => {
    if (!content || !fileType) {
      setToast({
        show: true,
        message: "Please enter content and select a file type.",
        details: "",
        type: "error",
      });
      return;
    }

    if (!selectedAccount) {
      setToast({
        show: true,
        message: "Please select a storage account.",
        details: "",
        type: "error",
      });
      return;
    }

    const drive = await new ShdwDrive(connection, wallet).init();
    const publicKey = new PublicKey(selectedAccount);

    try {
      setToast({
        show: true,
        message: "Uploading file...",
        details: "",
        type: "loading",
      });

      const file = new Blob([content], { type: fileType });
      const fileName = `file.${fileType.split("/")[1]}`;

      await drive.uploadFile(publicKey, new File([file], fileName));
      setToast({
        show: true,
        message: "File uploaded successfully!",
        details: "",
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setToast({
        show: true,
        message: "Error uploading file.",
        details: "",
        type: "error",
      });
    }
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="font-semibold text-sm py-2 px-5 my-auto border border-[#11FA98]  text-gray-200 rounded-lg shadow-md hover:bg-[#181c20] hover:text-gray-200 hover:border hover:border-[#11FA98]"
      >
        + Create
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div
            ref={modalRef}
            className="bg-[#292e31] max-w-[800px] w-full rounded-lg shadow-lg p-10 relative"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFileUpload();
              }}
              className="flex flex-col"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-0 right-2 m-2 text-lg font-bold text-gray-900"
              >
                <p className="text-gray-300 text-2xl">&times;</p>
              </button>
              <div className="mb-4">
                <select
                  onChange={(e) =>
                    setContent(
                      templates[e.currentTarget.value as TemplateKeys] || ""
                    )
                  }
                  className="w-full p-2 bg-[#3a3f42] text-gray-300 border border-gray-600 rounded-lg"
                >
                  <option value="" disabled>
                    Select a template
                  </option>
                  {Object.keys(templates).map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Enter your content here..."
                value={content}
                onChange={(e) => setContent(e.currentTarget.value)}
                className="mb-4 p-2 bg-[#181c20] text-gray-300 text-sm border border-gray-600 rounded-lg"
                rows={10}
              />
              <div className="ml-auto mb-4 w-1/3">
                <select
                  value={fileType || ""}
                  onChange={(e) => setFileType(e.currentTarget.value)}
                  className="w-full p-2 text-sm bg-[#3a3f42] text-gray-300 border border-gray-600 rounded-lg"
                >
                  <option value="" disabled>
                    Select file type
                  </option>
                  <option value="text/plain">Text (.txt)</option>
                  <option value="text/markdown">Markdown (.md)</option>
                  <option value="application/json">JSON (.json)</option>
                  <option value="text/html">HTML (.html)</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <p className="mt-auto text-gray-500 text-xs">
                  There are no fees for uploading files to ShdwDrive.
                </p>
                <button
                  type="submit"
                  className="py-2 px-6 border border-[#11FA98] text-white text-sm rounded-lg shadow "
                >
                  Upload
                </button>
              </div>
            </form>
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

export default Create;
