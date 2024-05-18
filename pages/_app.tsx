import React, { useState } from "react";
import { MantineProvider } from "@mantine/core";
import dynamic from "next/dynamic";
import Head from "next/head";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { SHDWDriveProvider } from "@/contexts/ShadowDriveProvider";
import useEndpoint from "@/hooks/useEndpoint";
import { ToastProvider } from "@/contexts/ToastContext";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  { ssr: false }
);

const App = ({ Component, pageProps }: AppProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const endpoint = useEndpoint();

  const handleAccountSelect = (publicKey: string) => {
    setSelectedAccount(publicKey);
  };

  const navbarWidth = "w-[380px]";

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={true}>
        <SHDWDriveProvider>
          <MantineProvider defaultColorScheme="dark">
            <ToastProvider>
              <Head>
                <title>Scoop</title>
              </Head>
              <div className="flex h-[100vh] w-[100vw] overflow-hidden bg-[#24292d]">
                <div className={navbarWidth}>
                  <Navbar onAccountSelect={handleAccountSelect} />
                </div>
                <div className="flex flex-col flex-grow h-[100vh]">
                  <Header />
                  <main className="flex-grow overflow-auto py-2 px-6 bg-[#24292d]">
                    <Component {...pageProps} />
                  </main>
                </div>
              </div>
            </ToastProvider>
          </MantineProvider>
        </SHDWDriveProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
