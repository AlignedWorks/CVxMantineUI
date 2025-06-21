import { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import { 
  Container,
  Title,
  SimpleGrid,
  Paper,
  Text,
  Button,
  Avatar,
  TextInput,
  Tooltip,
  Stack,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio: string;
  city: string;
  state: string;
  phoneNumber: string;
  linkedIn: string;
  avatarUrl: string;
  createdAt: string;
  skills: string[];
  experience: string[];
  memberStatus: string;
}

export function MemberDirectory() {
  const [sortedData, setSortedData] = useState<User[]>([]); // State to hold the sorted data
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

  // Fetch members data from the backend
  useEffect(() => {
    fetch(
      new URL("members", import.meta.env.VITE_API_BASE),
    {
      method: 'GET',
      credentials: 'include', // Include cookies if needed
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        return response.json();
      })
      .then((data: User[]) => {
        setSortedData(data); // Set the fetched data
      })
      .catch((error) => {
        console.error('Error fetching member data:', error);
      });
  }, []); // Run only once when the component mounts

  // Filter the users based on the search query
  const filteredUsers = sortedData.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.userName.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query) ||
      user.city.toLowerCase().includes(query) ||
      user.state.toLowerCase().includes(query)
    );
  });

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md" pt="sm" pb="xl">
        Member Directory
      </Title>

      {/* Search Input */}
      <TextInput
        placeholder="Search members"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        mb="xl"
      />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
        {filteredUsers.map((user) => (
          <Paper key={user.id} shadow="sm" radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Stack align="center" gap="0" style={{ height: '100%' }}>
              <Avatar
                src={user.avatarUrl}
                size={120}
                radius={120}
                mx="auto"
              />
              <Text ta="center" fz="lg" fw={500} mt="lg">
                {user.firstName} {user.lastName}
              </Text>
              <Tooltip label={user.bio || 'No user bio available'} multiline w={300} color="gray">
                <Text lineClamp={3} ta="center" c="dimmed" fz="sm" mb="xl">
                  {user.bio}
                </Text>
              </Tooltip>
              <Link
                to={`/members/${user.id}`}
                state={{ from: location.pathname }}
                style={{ textDecoration: 'none', color: 'inherit'}}>
                <Button
                  variant="outline"
                  size="sm"
                  mt="auto">
                  View Profile
                </Button>
              </Link>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
}