import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  splTokenTemplate,
  nftTemplate,
  usefulFile1,
  usefulFile2,
} from "@/templates";
import { Button, Menu, rem } from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { useToast } from "@/contexts/ToastContext";
import { useSHDWDrive } from "@/contexts/ShadowDriveProvider";

interface CreateProps {
  selectedAccount: string | null;
  onUploadSuccess: () => void;
}

type TemplateKeys =
  | "SPL Token"
  | "Metaplex NFT Metadata"
  | "Other Useful File"
  | "Other Useful File 2";

const Create: React.FC<CreateProps> = ({
  selectedAccount,
  onUploadSuccess,
}) => {
  const wallet = useWallet();
  const [content, setContent] = useState<string>("");
  const [fileType, setFileType] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();
  const { drive } = useSHDWDrive();

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
    try {
      if (!fileType) {
        throw new Error("Select a file type.");
        return;
      }
      if (!content) {
        throw new Error("Select a file to upload.");
      }
      if (!selectedAccount) {
        throw new Error("Select an account upload to.");
      }
      if (!wallet) {
        throw new Error("Wallet is not connected.");
      }
      if (!drive) {
        throw new Error("ShdwDrive is not connected.");
      }
      const publicKey = new PublicKey(selectedAccount);
      showToast("Uploading File...", "loading");
      const file = new Blob([content], { type: fileType });
      const fileName = `file.${fileType?.split("/")[1]}`;
      await drive.uploadFile(publicKey, new File([file], fileName));
      showToast("File Uploaded!", "success");
      setShowModal(false);
      onUploadSuccess();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      showToast(`${error.message}`, "error");
    }
  };

  return (
    <div className="relative">
      <Menu position="bottom-end" offset={11} withArrow shadow="lg" width={200}>
        <Menu.Target>
          <Button
            rightSection={<IconPlus size={14} />}
            variant="default"
          >
            <p className="text-gray-100">Create</p>
          </Button>
        </Menu.Target>

        <Menu.Dropdown bg={'#1b1b1b'}>
          <Menu.Label>Create</Menu.Label>
          <Menu.Item
            onClick={() => setShowModal(true)}
            leftSection={
              <IconSettings
                color={"turquoise"}
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Template File
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
            }
            disabled
          >
            Mint NFT
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
            }
            disabled
          >
            Mint SPL Token
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
        </Menu.Dropdown>
      </Menu>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div
            ref={modalRef}
            className="bg-[#242424] max-w-[800px] w-full rounded-lg shadow-lg p-10 relative"
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
              <div className="flex justify-start mb-4">
                <div className="flex gap-3 ">
                  <p className="my-auto text-sm text-gray-400">
                    Select a Template:
                  </p>
                  <select
                    onChange={(e) =>
                      setContent(
                        templates[e.currentTarget.value as TemplateKeys] || ""
                      )
                    }
                    className="py-3 px-3 bg-[#3a3f42] text-gray-300 text-sm border border-gray-600 rounded-lg"
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
              </div>
              <div className="mb-4">
                <CodeMirror
                  value={content}
                  height="400px"
                  theme={vscodeDark}
                  extensions={[json()]}
                  onChange={(value) => setContent(value || "")}
                  className="text-sm"
                />
              </div>

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
                <Button
                  type="submit"
                  variant="outline"
                  color="orange"
                  size="md"
                  c='white'
                  className="py-2 px-6 border border-[#11FA98] text-white text-sm rounded-lg shadow "
                >
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
