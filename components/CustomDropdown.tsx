import React, { useState } from "react";
import Image from "next/image";

interface CustomDropdownProps {
  value: string;
  options: { [key: string]: { logoUrl: string; symbol: string } };
  onChange: (option: string) => void;
}

const TokenDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-[100px]">
      <div
        className="flex items-center bg-transparent rounded px-2 py-[5px] text-black cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-black rounded-full mr-2">
          <Image
            src={options[value]?.logoUrl}
            alt=""
            height={25}
            width={25}
            className="rounded-full"
          />
        </div>

        <span className="font-extrabold text-gray-200">
          {options[value]?.symbol}
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-44 bg-[#fbfbfb] rounded shadow-lg">
          {Object.keys(options).map((key) => (
            <div
              key={key}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-[#333333]"
              onClick={() => handleOptionClick(key)}
            >
              <Image
                src={options[key]?.logoUrl}
                alt=""
                height={20}
                width={20}
                className="mr-2 rounded-full"
              />
              <span className="text-black">{options[key]?.symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenDropdown;
