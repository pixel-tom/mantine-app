import cx from 'clsx';
import React, { useState, useEffect, FC } from "react";
import { Avatar, Checkbox, Group, Table, Text } from "@mantine/core";
import FileMenu from "@/components/FileMenu";
import classes from './modules/TableSelection.module.css';
import Image from "next/image";
import { BiSolidFileDoc, BiSolidFileJson, BiSolidFilePdf, BiSolidFileTxt } from "react-icons/bi";
import { PiFileCodeFill } from "react-icons/pi";
import { BsFileEarmarkZipFill } from "react-icons/bs";

type FileDetail = {
  name: string;
  size?: string;
};

type FileRowProps = {
  file: FileDetail;
  publicKey: string;
  index: number;
  selection: string[];
  toggleRow: (id: string) => void;
};

const fileIcon = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  switch (fileExtension) {
    case "pdf":
      return <BiSolidFilePdf size={24} />;
    case "docx":
    case "doc":
      return <BiSolidFileDoc size={24} />;
    case "txt":
      return <BiSolidFileTxt size={24} />;
    case "xlsx":
    case "xls":
      return "/icons/excel-icon.png";
    case "zip":
      return <BsFileEarmarkZipFill size={24} />;
    case "json":
      return <BiSolidFileJson size={24} />;
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
    case "rs":
      return <PiFileCodeFill size={24} />;
    default:
      return "/icons/file-icon.png";
  }
};

const renderFileIcon = (fileName: string, fileUrl: string) => {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(fileName);
  if (isImage) {
    return <Image src={fileUrl} alt={fileName} width={40} height={40} className='rounded-md' loading='lazy'/>;
  } else {
    const icon = fileIcon(fileName);
    if (typeof icon === "string") {
      return <Image src={icon} alt={fileName} width={30} height={30} className='rounded-md' loading='lazy'/>;
    } else {
      return icon;
    }
  }
};

const FileRow: FC<FileRowProps> = ({ file, publicKey, index, selection, toggleRow }) => {
  const [animate, setAnimate] = useState(false);
  const fileUrl = `https://shdw-drive.genesysgo.net/${publicKey}/${file.name}`;
  const fileType = file.name.includes(".") ? file.name.split(".").pop() : "Unknown";

  useEffect(() => {
    setAnimate(true);
  }, []);

  const selected = selection.includes(index.toString());

  return (
    <Table.Tr key={index} className={cx({ [classes.rowSelected]: selected }, [classes.td])}>
      <Table.Td>
        <Checkbox checked={selected} onChange={() => toggleRow(index.toString())} />
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <div className='h-[40px] w-[40px] flex justify-center items-center'>
            {renderFileIcon(file.name, fileUrl)}
          </div>
          <Text size="sm" fw={500}>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Text c={'#f5f5f5'} fw={500}>{file.name}</Text>
            </a>
          </Text>
        </Group>
      </Table.Td>
      <Table.Td w={160} c={'#777'}>{fileType}</Table.Td>
      <Table.Td w={140} c={'#555'}>{file.size}</Table.Td>
      <Table.Td w={10}>
        <FileMenu file={file} publicKey={publicKey} />
      </Table.Td>
    </Table.Tr>
  );

};

export default FileRow;
