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
import { SHDWDriveProvider } from '@/contexts/ShadowDriveProvider'; // Ensure this import points to the correct path
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

  const navbarWidth = '380px';

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={true}>
        <SHDWDriveProvider>
          <MantineProvider defaultColorScheme="dark">
            <Head>
              <title>Scoop</title>
            </Head>
            <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#24292d' }}>
              <div style={{ width: navbarWidth }}>
                <Navbar onAccountSelect={handleAccountSelect} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh', width: `calc(100vw - ${navbarWidth})` }}>
                <Header />
                <main className='overflow-auto py-2 px-6' style={{ flexGrow: 1, backgroundColor: '#24292d' }}>
                  <Component {...pageProps} />
                </main>
              </div>
            </div>
          </MantineProvider>
        </SHDWDriveProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
