import React, { useState, useEffect, FC } from "react";
import Image from "next/image";
import FileMenu from "@/components/FileMenu";

type FileDetail = {
  name: string;
  size?: string;
};

type FileRowProps = {
  file: FileDetail;
  publicKey: string;
  index: number;
};

const FileRow: FC<FileRowProps> = ({ file, publicKey, index }) => {
  const [animate, setAnimate] = useState(false);
  const fileUrl = `https://shdw-drive.genesysgo.net/${publicKey}/${file.name}`;
  const fileType = file.name.includes(".")
    ? file.name.split(".").pop()
    : "Unknown";

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      className={`grid grid-cols-12 gap-4 h-14 items-center p-2 rounded-md mb-2 hover:border hover:border-[#586166] ${
        index % 2 === 0 ? "bg-[#363b3e]" : "bg-[#2f3437]"
      } ${animate ? "fade-in" : "hidden"}`}
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
      <div className="text-sm col-span-2 px-4 text-gray-400">{file.size}</div>
      <FileMenu file={file} publicKey={publicKey} />
    </div>
  );
};

export default FileRow;
