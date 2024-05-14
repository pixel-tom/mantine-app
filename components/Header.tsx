import React, { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = () => {
    if (inputText) {
      router.push(`/account/${inputText}`);
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#24292d] py-3 px-6">
      <div className="flex space-x-2 w-1/2">
        <input
          type="text"
          placeholder="Search for Account by Address.."
          value={inputText}
          onChange={handleInputChange}
          className="w-full py-2 text-sm px-5 bg-[#181c20] rounded-md"
        />
        <button 
          type="submit" 
          onClick={handleSubmit}
          className="px-4 py-3 border border-gray-600 rounded-md"
        >
          <BiSearch />
        </button>
      </div>
      <WalletMultiButton />
    </div>
  );
};

export default Header;
