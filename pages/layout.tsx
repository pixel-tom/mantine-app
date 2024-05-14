import React, { ReactNode, useState } from "react";
import {
  AppShell,
  Group,
  Flex,
  Box,
  Burger,
  Image,
  ScrollArea,
  UnstyledButton,
  Collapse,
  Center,
} from "@mantine/core";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DM_Sans } from "next/font/google";
import StorageAccounts from "@/components/Drives";
import SwapInterface from "@/components/SwapInterface";
import AccountDetails from "@/components/AccountDetails";
import { useDisclosure } from "@mantine/hooks";
import CreateStorageAccount from "@/components/CreateStorageAccount";

// Define a type for the props expected by the Layout component
interface LayoutProps {
  children: ReactNode;
  opened: boolean;
  toggle: () => void; // Assuming toggle is a simple function with no parameters and no return value
}

const raleway = DM_Sans({
  subsets: ["latin"],
  weight: "variable",
});

const Layout: React.FC<LayoutProps> = ({ children, opened, toggle }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const handleAccountSelect = (publicKey: string) => {
    setSelectedAccount(publicKey);
  };

  return (
    <AppShell
      layout="alt"
      header={{ height: { base: 60, md: 70, lg: 70 } }}
      navbar={{
        width: { base: 300, md: 300, lg: 400 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      bg="#010100"
      className={raleway.className}
    >
      {/* Header configuration */}
      <AppShell.Header
        bg="#24292d"
        withBorder={false}
        className="border-b border-[#293037]"
      >
        <Group h="100%" px="md">
          <Flex w="100%" justify="between">
            <Box className="flex space-x-4">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
                my={"auto"}
              />
            </Box>
            <div className="flex-grow"></div>
            <Flex justify="flex-end">
              <WalletMultiButton />
            </Flex>
          </Flex>
        </Group>
      </AppShell.Header>

      {/* Navbar configuration */}
      <AppShell.Navbar
        bg="#181c20"
        p="xs"
        withBorder={false}
        className="border-r border-[#293037]"
      >
        <AppShell.Section grow my="md" component={ScrollArea}>
        <div className="flex justify-between mx-4 mb-2">
          <h1 className="font-semibold my-auto text-blue-400 text-lg">
            My Drives
          </h1>
          <div className="my-auto py-2">
            <CreateStorageAccount />
          </div>
        </div>
        <hr className="w-11/12 mx-auto border-[#323b43] mb-2.5" />
          <StorageAccounts onAccountSelect={handleAccountSelect} />
        </AppShell.Section>
        <AppShell.Section>
          <div className="mb-2">
            <Group justify="center" mb={5}>
              <UnstyledButton onClick={toggle}>
                {opened && <p className="text-gray-400 text-sm">Hide</p>}
                {!opened && (
                  <p className="text-gray-400 text-sm">Swap for $SHDW</p>
                )}
              </UnstyledButton>
            </Group>
            <Collapse
              in={opened}
              transitionDuration={400}
              transitionTimingFunction="linear"
            >
              <SwapInterface />
            </Collapse>
          </div>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main content area */}
      <AppShell.Main bg="#24292d">
        {selectedAccount && <AccountDetails publicKey={selectedAccount} />}
        {!selectedAccount && (
          <Center>
            <Box>Securely Store your Data</Box>
          </Center>
        )}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
