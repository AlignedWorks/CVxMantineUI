import { useState } from 'react';
import { Button, Drawer, TextInput, Textarea, MultiSelect } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import classes from './TableSort.module.css';

interface RowData {
  id: number;
  name: string;
  description: string;
  manager_email: string;
  created_date: string;
  skills: string[];
  industry: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toString().toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy].toString());
      }

      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    }),
    payload.search
  );
}

const data: RowData[] = [
  {
    id: 1,
    name: 'CodeForge Collective',
    description: 'A developer-focused collaborative building open-source tools and frameworks.',
    manager_email: 'alex@codeforge.com',
    created_date: '2023-06-12',
    skills: ['Software Development', 'Open Source', 'DevOps'],
    industry: 'Technology',
  },
  {
    id: 2,
    name: 'GreenFuture Innovators',
    description: 'A sustainability-driven group working on eco-friendly solutions and smart energy.',
    manager_email: 'emily@greenfuture.org',
    created_date: '2022-09-25',
    skills: ['Renewable Energy', 'Environmental Science', 'IoT'],
    industry: 'Clean Energy',
  },
  {
    id: 3,
    name: 'HealthSync Alliance',
    description: 'A collaborative focused on building seamless healthcare integration systems.',
    manager_email: 'james@healthsync.com',
    created_date: '2024-01-18',
    skills: ['Healthcare IT', 'Data Security', 'AI in Medicine'],
    industry: 'Healthcare',
  },
  {
    id: 4,
    name: 'NextGen Creators',
    description: 'A creative hub for digital artists, animators, and designers working on innovative media projects.',
    manager_email: 'sophia@nextgencreators.com',
    created_date: '2023-03-14',
    skills: ['Graphic Design', 'Animation', 'Digital Art'],
    industry: 'Creative Arts',
  },
  {
    id: 5,
    name: 'EdTech Visionaries',
    description: 'A team dedicated to enhancing education through technology and AI-driven learning solutions.',
    manager_email: 'michael@edtechvision.com',
    created_date: '2021-11-30',
    skills: ['AI in Education', 'E-Learning', 'Software Development'],
    industry: 'Education Technology',
  },
  {
    id: 6,
    name: 'ByteSecure Collective',
    description: 'A cybersecurity-focused group tackling modern threats with cutting-edge defense strategies.',
    manager_email: 'oliver@bytesecure.net',
    created_date: '2023-08-05',
    skills: ['Cybersecurity', 'Ethical Hacking', 'Cloud Security'],
    industry: 'Cybersecurity',
  },
  {
    id: 7,
    name: 'UrbanAgri Solutions',
    description: 'An urban farming think tank developing high-tech agricultural solutions for cities.',
    manager_email: 'jessica@urbanagri.com',
    created_date: '2022-05-10',
    skills: ['Vertical Farming', 'Hydroponics', 'IoT in Agriculture'],
    industry: 'AgTech',
  },
  {
    id: 8,
    name: 'FinTech Pioneers',
    description: 'A team of financial innovators building next-gen banking and investment solutions.',
    manager_email: 'william@fintechpioneers.com',
    created_date: '2023-12-01',
    skills: ['Blockchain', 'FinTech', 'Data Analytics'],
    industry: 'Financial Technology',
  },
  {
    id: 9,
    name: 'GameCraft Studios',
    description: 'An indie game development collaborative focused on immersive storytelling and gameplay.',
    manager_email: 'david@gamecraftstudios.com',
    created_date: '2024-02-20',
    skills: ['Game Development', 'Unreal Engine', 'Narrative Design'],
    industry: 'Gaming',
  },
  {
    id: 10,
    name: 'BuildTogether Makerspace',
    description: 'A community of engineers, designers, and tinkerers creating hardware and robotics projects.',
    manager_email: 'sarah@buildtogether.com',
    created_date: '2021-07-15',
    skills: ['Robotics', '3D Printing', 'Hardware Prototyping'],
    industry: 'Engineering & Manufacturing',
  },
];

export function TableSort() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [formValues, setFormValues] = useState<RowData>({
    id: 0,
    name: '',
    description: '',
    manager_email: '',
    created_date: '',
    skills: [],
    industry: '',
  });

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleEditClick = (row: RowData) => {
    setSelectedRow(row);
    setFormValues(row);
    setDrawerOpened(true);
  };

  const handleFormChange = (field: keyof RowData, value: any) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleFormSubmit = () => {
    setSortedData((current) =>
      current.map((item) => (item.id === formValues.id ? formValues : item))
    );
    setDrawerOpened(false);
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td className={classes.td}>{row.name}</Table.Td>
      <Table.Td className={classes.td}>{row.description}</Table.Td>
      <Table.Td className={classes.td}>{row.manager_email}</Table.Td>
      <Table.Td className={classes.td}>{row.created_date}</Table.Td>
      <Table.Td className={classes.td}>{row.skills.join(', ')}</Table.Td>
      <Table.Td className={classes.td}>{row.industry}</Table.Td>
      <Table.Td className={classes.td}>
        <Button variant="outline" size="xs" leftSection={<IconEdit size={14} />} onClick={() => handleEditClick(row)}>
          Edit
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Drawer
        position="right"
        offset={8}
        radius="md"
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Edit Collaborative"
        padding="xl"
        size="xl"
      >
        {selectedRow && (
          <div>
            <TextInput
              label="Name"
              value={formValues.name}
              onChange={(event) => handleFormChange('name', event.currentTarget.value)}
            />
            <Textarea
              label="Description"
              value={formValues.description}
              onChange={(event) => handleFormChange('description', event.currentTarget.value)}
            />
            <TextInput
              label="Manager Email"
              value={formValues.manager_email}
              onChange={(event) => handleFormChange('manager_email', event.currentTarget.value)}
            />
            <TextInput
              label="Created Date"
              value={formValues.created_date}
              onChange={(event) => handleFormChange('created_date', event.currentTarget.value)}
            />
            <MultiSelect
              label="Skills"
              data={formValues.skills}
              value={formValues.skills}
              onChange={(value) => handleFormChange('skills', value)}
            />
            <TextInput
              label="Industry"
              value={formValues.industry}
              onChange={(event) => handleFormChange('industry', event.currentTarget.value)}
            />
            <Button onClick={handleFormSubmit} mt="md">
              Save
            </Button>
          </div>
        )}
      </Drawer>
      <ScrollArea>
          <TextInput
            placeholder="Search by any field"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === 'name'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('name')}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === 'description'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('description')}
              >
                Description
              </Th>
              <Th
                sorted={sortBy === 'manager_email'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('manager_email')}
              >
                Leader Email
              </Th>
              <Th
                sorted={sortBy === 'created_date'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('created_date')}
              >
                Created Date
              </Th>
              <Th
                sorted={sortBy === 'skills'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('skills')}
              >
                Skills
              </Th>
              <Th
                sorted={sortBy === 'industry'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('industry')}
              >
                Industry
              </Th>

            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Object.keys(data[0]).length + 1}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}