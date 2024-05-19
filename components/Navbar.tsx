import React, { useState, useEffect } from "react";
import CreateStorageAccount from "@/components/NewDriveModal";
import Drives from "@/components/Drives";
import Image from "next/image";
import { useRouter } from "next/router";
import JupiterSwap from "@/components/JupiterSwap";

interface NavbarProps {
  onAccountSelect: (publicKey: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAccountSelect }) => {
  const [isSwapVisible, setIsSwapVisible] = useState(false);
  const [divStyle, setDivStyle] = useState({
    maxHeight: "0px",
    opacity: 0,
    transition: "max-height 0.5s ease, opacity 0.5s ease",
    overflow: "hidden",
  });
  const router = useRouter();

  useEffect(() => {
    if (isSwapVisible) {
      setDivStyle({
        maxHeight: "500px",
        opacity: 1,
        transition: "max-height 0.5s ease, opacity 0.5s ease",
        overflow: "hidden",
      });
    } else {
      setDivStyle({
        maxHeight: "0px",
        opacity: 0,
        transition: "max-height 0.5s ease, opacity 0.5s ease",
        overflow: "hidden",
      });
    }
  }, [isSwapVisible]);

  const toggleSwapVisibility = () => {
    setIsSwapVisible(!isSwapVisible);
  };

  return (
    <div
      className="flex flex-col h-full p-4"
      style={{
        maxWidth: "380px",
        width: "100%",
        backgroundColor: "#1b1b1b",
        color: "#fff",
      }}
    >
      <div
        onClick={() => {
          router.push(`/`);
        }}
        className="mb-10 mx-2"
      >
        <Image
          src={
            "https://assets-global.website-files.com/653ae95e36bd81f87299010a/653af7770c7052f674db89ad_ShdwDrive_AllWhite_wGenGo.svg"
          }
          alt={""}
          height={50}
          width={200}
        ></Image>
      </div>

      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="font-semibold text-gray-200">My Drives</h1>
        <CreateStorageAccount />
      </div>
      <hr className="mx-auto w-11/12 border-gray-700" />
      <div className="flex-grow overflow-y-auto mt-3">
        <Drives onAccountSelect={onAccountSelect} />
      </div>
      <div className="mt-auto">
        <button
          onClick={toggleSwapVisibility}
          className="w-full font-semibold text-sm text-gray-400 rounded-md hover:border-gray-600 transition"
        >
          {isSwapVisible ? "Hide" : "Need $SHDW?"}
        </button>
        <div style={{ ...divStyle, marginTop: "16px" }}>
          <JupiterSwap shouldFetchBalance={isSwapVisible} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
