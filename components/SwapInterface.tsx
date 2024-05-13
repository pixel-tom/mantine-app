import React, { useState } from "react";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import mintsData from "@/mints";
import WalletBalance from "@/components/WalletBalance";
import { shdwData } from "@/mints";
import { TbArrowsTransferDown } from "react-icons/tb";
import Toast from "./Toast";
import Link from "next/link";

interface CustomDropdownProps {
  value: string;
  options: { [key: string]: { logoUrl: string; symbol: string } };
  onChange: (option: string) => void;
}

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
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

const SwapInterface: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [inputToken, setInputToken] = useState(
    "So11111111111111111111111111111111111111112"
  );
  const [outputToken, setOutputToken] = useState(
    "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y"
  );
  const [inputTokenAmount, setInputTokenAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [outputTokenAmount, setOutputTokenAmount] = useState(0);
  const [outputTokenDecimals, setOutputTokenDecimals] = useState(
    shdwData["SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y"].decimals
  );
  const [isLoading, setIsLoading] = useState(false);
  const inputTokenData = mintsData[inputToken];
  const outputTokenData = mintsData[outputToken];
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    details: "",
    type: "info",
  });

  const fetchQuoteResponse = async (amount: string) => {
    try {
      const inputTokenData = mintsData[inputToken];
      const outputTokenData = mintsData[outputToken];
      const inputTokenAmountLamports =
        parseFloat(amount) * Math.pow(10, inputTokenData.decimals);
      const slippagePercentage = parseFloat(slippage) / 100;

      const axiosResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputTokenData.mint}&outputMint=${outputTokenData.mint}&amount=${inputTokenAmountLamports}&slippage=${slippagePercentage}&onlyDirectRoutes=true`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const quoteResponse = axiosResponse.data;
      setOutputTokenAmount(quoteResponse.outAmount);
    } catch (error) {
      console.error("Error fetching quote response:", error);
    }
  };

  const handleSwapButtonClick = async () => {
    setIsLoading(true);

    try {
      const userPubkey = wallet.publicKey;

      if (!userPubkey) {
        setToast({
          show: true,
          message: "Please Connect your Wallet to swap.",
          details: "",
          type: "error",
        });
        return;
      }

      setToast({
        show: true,
        message: "Swapping Tokens...",
        details: "",
        type: "loading",
      });

      // Fetch token data from mints.json based on the inputToken and outputToken
      const inputTokenData = mintsData[inputToken];
      const outputTokenData = mintsData[outputToken];

      // Convert user input to the correct value based on token decimals
      const inputTokenAmountLamports =
        parseFloat(inputTokenAmount) * Math.pow(10, inputTokenData.decimals);

      const slippagePercentage = parseFloat(slippage) / 100;

      const axiosResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputTokenData.mint}&outputMint=${outputTokenData.mint}&amount=${inputTokenAmountLamports}&slippage=${slippagePercentage}&onlyDirectRoutes=true`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const quoteResponse = axiosResponse.data;
      console.log("Out Amount:", quoteResponse.outAmount);
      console.log("Min Amount:", quoteResponse.otherAmountThreshold);

      const { swapTransaction } = await axios
        .post(
          "https://quote-api.jup.ag/v6/swap",
          {
            quoteResponse,
            userPublicKey: userPubkey?.toString(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: 1000,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data);

      if (!swapTransaction) {
        setToast({
          show: true,
          message: "Error communicating with Jupiter. Please Try again!",
          details: "",
          type: "error",
        });
        return;
      }

      console.log(swapTransaction);

      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      console.log("transaction" + transaction);

      if (wallet && wallet.signTransaction) {
        const signedTransaction = await wallet.signTransaction(transaction);

        // perform the swap
        const txid = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        await connection.confirmTransaction(txid);
        setToast({
          show: true,
          message: "Swap Successful!",
          details: "",
          type: "success",
        });
        console.log(`https://solscan.io/tx/${txid}`);
      }
    } catch (error) {
      setToast({
        show: true,
        message: `${error}`,
        details: "",
        type: "error",
      });
      console.error("Error performing token swap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className={`flex-grow`}>
      <div
        className={`flex flex-col items-center justify-center transition-all duration-700 transform `}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="wrapper p-2  text-white">
            <div className="flex flex-row justify-between mb-2 border border-[#222222] bg-[#363b3e] hover:bg-[#3c4245] py-2 px-3 rounded-lg shadow-md">
              <div className="flex-1 my-auto">
                <CustomDropdown
                  value={inputToken}
                  options={mintsData}
                  onChange={setInputToken}
                />
              </div>
              <div className="flex-1 ">
                <div className="flex flex-col mb-1 w-[240px] sm:w-52">
                  <input
                    value={inputTokenAmount}
                    placeholder="0.00"
                    onChange={(e) => {
                      setInputTokenAmount(e.target.value);
                      fetchQuoteResponse(e.target.value);
                    }}
                    className="text-right pr-3 py-1 bg-transparent text-white text-lg font-semibold focus:outline-none focus:border-blue-500 text-align-right"
                  />
                  <div className="ml-auto pr-3">
                    <WalletBalance searchMintAddress={inputTokenData?.mint} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full mb-2 mt-2 ">
              <hr className="w-2/5 my-auto border-[#323b43]  mx-auto" />
              <TbArrowsTransferDown className="w-5 h-5  rounded-full  text-gray-600 " />
              <hr className="w-2/5 my-auto border-[#323b43] mx-auto" />
            </div>

            <div className="flex flex-row justify-between mb-5 border border-[#222222] bg-[#363b3e] py-2 px-3 rounded-lg shadow-md">
              <div className="flex-1 my-auto">
                <CustomDropdown
                  value={outputToken}
                  options={shdwData}
                  onChange={(token: any) => {
                    setOutputToken(token);
                    setOutputTokenDecimals(mintsData[token]?.decimals || 0);
                  }}
                />
              </div>
              <div className="flex-2">
                <div className="flex flex-col mb-1 w-44">
                  <input
                    value={(
                      parseFloat(outputTokenAmount.toString()) /
                      Math.pow(10, outputTokenDecimals)
                    ).toFixed(2)}
                    placeholder="0.00"
                    className="rounded text-right px-3 py-1 bg-transparent text-white text-lg font-semibold focus:outline-none focus:border-blue-500 text-align-right"
                    readOnly
                  />
                  <div className="ml-auto px-3">
                    <WalletBalance searchMintAddress={outputTokenData?.mint} />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="text-center">
          <p className="text-sm text-gray-300">Swap Settings</p>
        </div>
        <div className="mb-8 mx-2">
          <div className="flex flex-row justify-between mb-2">
            <h1 className="block mb-2 text-xs text-gray-400">Slippage</h1>
            <span
              className={`text-sm ${
                slippage > 1000
                  ? "text-red-500 opacity-90"
                  : "text-green-500 opacity-90"
              }`}
            >
              {(slippage / 1000).toFixed(2)}%
            </span>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <input
              type="range"
              min="50"
              max="5000"
              step="1"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundSize: `${slippage / 10}% 100%`,
                backgroundColor: "#222222",
              }}
            />
          </div>
        </div> */}
            <button
              onClick={handleSwapButtonClick}
              disabled={isLoading}
              className="font-semibold w-full bg-blue-500 text-gray-50 border border-blue-400 rounded-full px-4 py-3 shadow-inner shadow-bottom hover:bg-[#121212] focus:outline-none"
            >
              <p className="">{isLoading ? "Loading..." : "Swap"}</p>
            </button>
          </div>
          <div className="flex space-x-2 mt-2">
            <p className="text-xs text-gray-400">Powered by</p>
            <Link href={'https://jup.ag/'}><Image src={"https://jup.ag/svg/jupiter-logo.svg"} alt={""} height={15} width={15}></Image>
            </Link>
          </div>
          
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        details={toast.details}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
};

export default SwapInterface;
