import { Cluster } from "@solana/web3.js";
import { ENV as ENVChainId } from "@solana/spl-token-registry";

require("dotenv").config();

// Endpoints, connection
export const ENV: Cluster =
  (process.env.NEXT_PUBLIC_CLUSTER as Cluster) || "mainnet-beta";
export const CHAIN_ID =
  ENV === "mainnet-beta"
    ? ENVChainId.MainnetBeta
    : ENV === "devnet"
    ? ENVChainId.Devnet
    : ENV === "testnet"
    ? ENVChainId.Testnet
    : ENVChainId.MainnetBeta;
export const SOLANA_RPC_ENDPOINT =
  ENV === "devnet"
    ? "https://devnet.helius-rpc.com/?api-key=d31340bd-19ab-4fd6-9d30-f6b8360f7f29"
    : "https://mainnet.helius-rpc.com/?api-key=d31340bd-19ab-4fd6-9d30-f6b8360f7f29";