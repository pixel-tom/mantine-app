import React, { useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import mintsData from "@/mints";
import WalletBalance from "@/components/WalletBalance";
import { shdwData } from "@/mints";
import { TbArrowsTransferDown } from "react-icons/tb";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";
import TokenDropdown from "@/components/CustomDropdown";

const JupiterSwap: React.FC = () => {
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
  const { showToast } = useToast();

  const fetchQuoteResponse = async (amount: string) => {
    try {
      const inputTokenData = mintsData[inputToken];
      const outputTokenData = mintsData[outputToken];
      const inputTokenAmountLamports =
        parseFloat(amount) * Math.pow(10, inputTokenData.decimals);
      const slippagePercentage = parseFloat(slippage) / 100;

      const axiosResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?
        inputMint=${inputTokenData.mint}&
        outputMint=${outputTokenData.mint}&
        amount=${inputTokenAmountLamports}&
        slippage=${slippagePercentage}&
        onlyDirectRoutes=true`,
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

  const handleSwapTokens = async () => {
    setIsLoading(true);
    const userPubkey = wallet.publicKey;
    const inputTokenData = mintsData[inputToken];
    const outputTokenData = mintsData[outputToken];
    const inputTokenAmountLamports =
        parseFloat(inputTokenAmount) * Math.pow(10, inputTokenData.decimals);
    const slippagePercentage = parseFloat(slippage) / 100;

    try {
      showToast("Swapping tokens", "loading");

      if (!userPubkey) {
        throw new Error("Wallet not connected!");
        return;
      }

      const axiosResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?
        inputMint=${inputTokenData.mint}&
        outputMint=${outputTokenData.mint}&
        amount=${inputTokenAmountLamports}&
        slippage=${slippagePercentage}&
        onlyDirectRoutes=true`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const quoteResponse = axiosResponse.data;

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
        throw new Error("Please try again");
        return;
      }

      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      if (wallet && wallet.signTransaction) {
        const signedTransaction = await wallet.signTransaction(transaction);

        const txid = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        await connection.confirmTransaction(txid, "confirmed");
        showToast("Swap successful", "success");
        console.log(`https://solscan.io/tx/${txid}`);
      }
    } catch (error: any) {
      showToast(`${error.message}`, 'error')
      console.error("Error performing token swap:", error);
    } finally {
      setIsLoading(false);
    }
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
                <TokenDropdown
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
              <TbArrowsTransferDown className="w-5 h-5  rounded-full  text-gray-500 " />
              <hr className="w-2/5 my-auto border-[#323b43] mx-auto" />
            </div>

            <div className="flex flex-row justify-between mb-5 border border-[#222222] bg-[#363b3e] py-2 px-3 rounded-lg shadow-md">
              <div className="flex-1 my-auto">
                <TokenDropdown
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
            <button
              onClick={handleSwapTokens}
              disabled={isLoading}
              className="font-semibold w-full text-gray-50 border border-[#11FA98] rounded-full px-4 py-3 shadow-inner shadow-bottom hover:bg-[#22272e] focus:outline-none"
            >
              <p className="">{isLoading ? "Swapping" : "Swap"}</p>
            </button>
          </div>
          <div className="flex space-x-2 mt-2">
            <p className="text-xs text-gray-400">Powered by</p>
            <Link href={"https://jup.ag/"}>
              <Image
                src={"https://jup.ag/svg/jupiter-logo.svg"}
                alt={""}
                height={15}
                width={15}
              ></Image>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JupiterSwap;
