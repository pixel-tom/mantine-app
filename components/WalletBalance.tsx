import React, { useState, useEffect } from 'react';
import { Connection, GetProgramAccountsFilter, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from '@solana/wallet-adapter-react';

const rpcEndpoint = 'https://mainnet.helius-rpc.com/?api-key=d31340bd-19ab-4fd6-9d30-f6b8360f7f29';
const solanaConnection = new Connection(rpcEndpoint);

const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';

type MyComponentProps = {
  searchMintAddress: string;
};

const MyComponent: React.FC<MyComponentProps> = ({ searchMintAddress }) => {
    const walletAddress = useWallet().publicKey?.toString();
    const [tokenBalance, setTokenBalance] = useState<number | null>(null);

    useEffect(() => {
        if (walletAddress) {
            getTokenAccounts(walletAddress, searchMintAddress, solanaConnection);
        }
    }, [walletAddress, searchMintAddress]);

    async function getTokenAccounts(walletAddress: string, mintAddress: string, solanaConnection: Connection) {
        if (mintAddress === SOL_MINT_ADDRESS) {
            const balanceInLamports = await solanaConnection.getBalance(new PublicKey(walletAddress));
            const balanceInSol = balanceInLamports / 1e9; // Convert lamports to SOL
            setTokenBalance(balanceInSol);
        } else {
            const filters: GetProgramAccountsFilter[] = [
                {
                    dataSize: 165,
                },
                {
                    memcmp: {
                        offset: 32,
                        bytes: walletAddress,
                    },            
                },
                {
                    memcmp: {
                        offset: 0,
                        bytes: mintAddress,
                    },
                }
            ];

            const accounts = await solanaConnection.getParsedProgramAccounts(
                TOKEN_PROGRAM_ID,
                { filters: filters }
            );

            if (accounts.length > 0) {
                const accountInfo = accounts[0].account.data as ParsedAccountData;
                if (accountInfo.parsed) {
                    const tokenAmount = accountInfo.parsed.info.tokenAmount.uiAmount;
                    setTokenBalance(tokenAmount);
                }
            } else {
                console.log('No accounts found with the specified mint address.');
                setTokenBalance(0);
            }
        }
    }

    return (
        <div className="text-gray-300">
            <h1 className="text-[11px] text-gray-400"><span className='text-gray-500 text-[9px] mr-1'>Balance </span>{tokenBalance?.toFixed(3) ?? 'Loading...'}</h1>
        </div>
    );
};

export default MyComponent;
