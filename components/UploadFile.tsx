import React, { useEffect, useState } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Toast from "./Toast";
import { useRef } from "react";
import {
  Text,
  Group,
  Button,
  rem,
  useMantineTheme,
  Center,
  UnstyledButton,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconDownload, IconX } from "@tabler/icons-react";
import classes from "@/styles/Dropzone.module.css";
import Image from "next/image";

interface UploadProps {
  selectedAccount: string | null;
}

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

const Upload: React.FC<UploadProps> = ({ selectedAccount }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // Added to store the file name
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    details: "",
    type: "info",
  });
  const { connection } = useConnection();
  const wallet = useWallet();
  const theme = useMantineTheme();
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef<() => void>(null);

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

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="font-medium text-sm  py-2 px-5 my-auto border border-[#11FA98] bg-[#11FA98] text-[#24292d] rounded-lg shadow-md hover:bg-[#5bffbb] hover:border hover:border-[#11FA98]"
      >
        + Upload
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-[#292e31] max-w-[800px] w-full rounded-lg shadow-lg p-10 relative">
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
              <div>
                <div className={classes.wrapper}>
                  <Dropzone
                    openRef={openRef}
                    onDrop={(files) => {
                      const selectedFile = files.length > 0 ? files[0] : null;
                      setFile(selectedFile);
                      setFileName(selectedFile ? selectedFile.name : null); // Set the file name
                      setFileSize(selectedFile ? selectedFile.size : null);
                    }}
                    className={`border border-gray-400 border-dashed bg-gradient-to-br from-[#5D616D]/50 to-[#222935]/50 px-16 py-14 rounded-lg ${classes.dropzone}`}
                    accept={[
                      MIME_TYPES.png,
                      MIME_TYPES.pdf,
                      MIME_TYPES.jpeg,
                      MIME_TYPES.gif,
                      MIME_TYPES.csv,
                      MIME_TYPES.docx,
                      MIME_TYPES.doc,
                      MIME_TYPES.exe,
                      MIME_TYPES.mp4,
                      MIME_TYPES.heic,
                      MIME_TYPES.ppt,
                      MIME_TYPES.pptx,
                      MIME_TYPES.svg,
                      MIME_TYPES.webp,
                      MIME_TYPES.xls,
                      MIME_TYPES.xlsx,
                      MIME_TYPES.zip,
                    ]}
                    maxSize={30 * 1024 ** 2}
                  >
                    <div style={{ pointerEvents: "none" }}>
                      <Group justify="center">
                        <Dropzone.Accept>
                          <IconDownload
                            style={{ width: rem(50), height: rem(50) }}
                            color={theme.colors.blue[6]}
                            stroke={1.5}
                          />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <IconX
                            style={{ width: rem(50), height: rem(50) }}
                            color={theme.colors.red[6]}
                            stroke={1.5}
                          />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <Image src={"https://assets-global.website-files.com/653ae95e36bd81f87299010a/653ae95e36bd81f87299020e_10A%20S%20Logomark.svg"} alt={""} height={70} width={70} />
                        </Dropzone.Idle>
                      </Group>

                      <Text ta="center" fw={700} fz="lg" mt="xl" className="text-gray-300">
                        <Dropzone.Accept>Drop files here</Dropzone.Accept>

                        <Dropzone.Idle>Upload Files</Dropzone.Idle>
                      </Text>
                      <Text ta="center" fz="sm" mt="xs" className="text-gray-500">
                        Drag&apos;n&apos;drop files here to upload.
                      </Text>
                    </div>
                  </Dropzone>
                  <Center>
                    <button
                      className={`px-5 py-2 bg-[#11FA98] text-gray-800 text-sm font-semibold rounded-lg ${classes.control}`}
                      onClick={() => openRef.current?.()}
                    >
                      Select files
                    </button>
                  </Center>
                </div>
                <div className="flex mt-10 space-x-2 max-h-20 overflow-auto">
                  {fileName && (
                    <p className="text-sm text-gray-300">
                      {fileName} {/* Display the file name */}
                    </p>
                  )}
                  {fileSize && (
                    <p className="mt-auto text-xs text-gray-500">
                      {fileSize} b
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <p className="mt-auto text-gray-500 text-xs">There are no fees for uploading files to ShdwDrive.</p>
                <button
                  type="submit"
                  className="py-2 px-6 border border-[#11FA98] font-semibold text-sm text-white rounded-lg shadow"
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

export default Upload;
