import cx from 'clsx';
import React, { useState, useEffect, FC } from "react";
import FileRow from "@/components/FileRow";
import { ScrollArea, Table, Checkbox, rem, Button, TextInput, UnstyledButton, Group, Center, Text } from "@mantine/core";
import { IconSearch, IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import classes from './modules/TableSelection.module.css';

type FileDetail = {
  name: string;
  size?: string;
};

type ListViewProps = {
  files: string[];
  publicKey: string;
};

const Th = ({ children, reversed, sorted, onSort }: { children: React.ReactNode; reversed: boolean; sorted: boolean; onSort: () => void }) => {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
};

const filterData = (data: FileDetail[], search: string) => {
  const query = search.toLowerCase().trim();
  return data.filter((item) => item.name.toLowerCase().includes(query));
};

const sortData = (data: FileDetail[], payload: { sortBy: keyof FileDetail | null; reversed: boolean; search: string }) => {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy]!.localeCompare(a[sortBy]!);
      }
      return a[sortBy]!.localeCompare(b[sortBy]!);
    }),
    payload.search
  );
};

const ListView: FC<ListViewProps> = ({ files, publicKey }) => {
  const [fileDetails, setFileDetails] = useState<FileDetail[]>(files.map((file) => ({ name: file })));
  const [selection, setSelection] = useState<string[]>([]);
  const [displayedRows, setDisplayedRows] = useState<number>(50);
  const [search, setSearch] = useState<string>('');
  const [sortedData, setSortedData] = useState<FileDetail[]>(fileDetails);
  const [sortBy, setSortBy] = useState<keyof FileDetail | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const toggleRow = (id: string) =>
    setSelection((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const toggleAll = () => setSelection((current) => (current.length === sortedData.length ? [] : sortedData.map((_, index) => index.toString())));

  useEffect(() => {
    const fetchFileSizes = async () => {
      const promises = files.map(async (file) => {
        const fileUrl = `https://shdw-drive.genesysgo.net/${publicKey}/${file}`;
        try {
          const response = await fetch(fileUrl, { method: "HEAD" });
          if (!response.ok) {
            throw new Error(`Failed to fetch size for ${file}`);
          }
          const sizeBytes = response.headers.get("content-length");
          const size = sizeBytes ? (parseInt(sizeBytes) > 0 ? `${(parseInt(sizeBytes) / 1024).toFixed(2)} KB` : "<1B") : "Unknown";
          return { name: file, size };
        } catch (error) {
          console.error("Error fetching file size for:", file, error);
          // Assuming any failure to fetch means the file is very small or zero bytes
          return { name: file, size: "<1B" };
        }
      });
      const results = await Promise.all(promises);
      setFileDetails(results);
      setSortedData(results);
    };

    fetchFileSizes();
  }, [files, publicKey]);

  useEffect(() => {
    setSortedData(sortData(fileDetails, { sortBy, reversed: reverseSortDirection, search }));
  }, [search, sortBy, reverseSortDirection, fileDetails]);

  const setSorting = (field: keyof FileDetail) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const showMoreRows = () => {
    setDisplayedRows((prev) => prev + 50);
  };

  return (
    <>
      <TextInput
        placeholder="Search files"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        className='mt-6'
      />
      <ScrollArea className="mt-6">
        <Table miw={800} verticalSpacing="sm" striped highlightOnHover withRowBorders={false} className={cx([classes.th], [classes.tr])}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === sortedData.length}
                  indeterminate={selection.length > 0 && selection.length !== sortedData.length}
                />
              </Table.Th>
              <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>
                Name
              </Th>
              <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>
                File Type
              </Th>
              <Th sorted={sortBy === 'size'} reversed={reverseSortDirection} onSort={() => setSorting('size')}>
                File Size
              </Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.slice(0, displayedRows).map((file, index) => (
              <FileRow
                key={index}
                file={file}
                publicKey={publicKey}
                index={index}
                selection={selection}
                toggleRow={toggleRow}
              />
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {displayedRows < sortedData.length && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Button onClick={showMoreRows}>Show More</Button>
        </div>
      )}
    </>
  );
};

export default ListView;
