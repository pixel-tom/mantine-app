import React, { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/router";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

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
    <div className="flex items-center justify-between bg-[#242424] py-3 px-6">
      <div className="flex space-x-2 w-1/2">
        
        <TextInput
          placeholder="Search files"
          size="md"
          mb="md"
          w='100%'
          h={10}
          value={inputText}
          onChange={(event) => handleInputChange(event)}
          
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-3 border border-[#424242] rounded-[4px]"
        >
          <IconSearch size={16} stroke={1.5} />
        </button>
      </div>
      <WalletMultiButton />
    </div>
  );
};

export default Header;

function DarkModeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        <IconSun  stroke={1.5} />
        <IconMoon  stroke={1.5} />
      </ActionIcon>
    </Group>
  );
}