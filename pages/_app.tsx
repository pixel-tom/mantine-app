import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import '@/styles/globals.css';
import '@mantine/core/styles.css';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import useEndpoint from '@/hooks/useEndpoint';

const WalletProvider = dynamic(
  () => import('../contexts/ClientWalletProvider'),
  { ssr: false }
);

const App = ({ Component, pageProps }: AppProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const endpoint = useEndpoint();

  const handleAccountSelect = (publicKey: string) => {
    setSelectedAccount(publicKey);
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={true}>
        <MantineProvider defaultColorScheme="dark">
          <Head>
            <title>Scoop</title>
          </Head>
          <div style={{ display: 'flex', height: '100vh', backgroundColor: '#010100' }}>
            <Navbar onAccountSelect={handleAccountSelect} />
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh' }}>
              <Header />
              <main className='overflow-auto p-6' style={{ flexGrow: 1, backgroundColor: '#24292d' }}>
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        </MantineProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
