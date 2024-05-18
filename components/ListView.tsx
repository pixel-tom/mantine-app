import React, { useState, useEffect, FC } from "react";
import FileRow from "@/components/FileRow";

type FileDetail = {
  name: string;
  size?: string;
};

type ListViewProps = {
  files: string[];
  publicKey: string;
};

const ListView: FC<ListViewProps> = ({ files, publicKey }) => {
  const [fileDetails, setFileDetails] = useState<FileDetail[]>(
    files.map((file) => ({ name: file }))
  );

  useEffect(() => {
    const fetchFileSizes = async () => {
      const promises = files.map(async (file) => {
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
    <div className="w-full mt-4 fade-in">
      <div className="w-full grid grid-cols-12 gap-4 text-left text-sm text-gray-500 font-semibold py-2">
        <div className="col-span-1"></div>
        <div className="col-span-6 px-5">Name</div>
        <div className="col-span-2 px-3">File Type</div>
        <div className="col-span-2 px-3">File Size</div>
        <div className="col-span-1"></div>
      </div>
      {fileDetails.map((file, index) => (
        <FileRow key={index} file={file} publicKey={publicKey} index={index} />
      ))}
    </div>
  );
};

export default ListView;
