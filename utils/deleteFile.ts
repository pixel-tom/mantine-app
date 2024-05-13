import { ShdwDrive } from "@shadow-drive/sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from '@solana/web3.js'
import { useState } from "react";

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

export const useDeleteFile = async (publicKey: string, fileUrl: string) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const drive = await new ShdwDrive(connection, wallet).init();
  const pubKey = new PublicKey(publicKey);
  const sig = await drive.deleteFile(pubKey, fileUrl);
  console.log(sig);
};

export const useHandleFileUpload = async (file: File, selectedAccount: string) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    details: "",
    type: "info",
  });

  if (!file) {
    setToast({
      show: true,
      message: "Please select a file to upload.",
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
    await drive.uploadFile(publicKey, file);
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