import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Button,
  TextInput,
  Stack,
  Grid,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface CollaborativeData {
  id: number;
  name: string;
  description: string;
  leaderEmail: string;
  leaderName: string;
  createdAt: string;
  city: string;
  state: string;
}

export function CollaborativeDirectory() {
  const [sortedData, setSortedData] = useState<CollaborativeData[]>([]); // State to hold the sorted data
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

  // Fetch collaborative data from the backend
     useEffect(() => {
      fetch(
        new URL("collaboratives", import.meta.env.VITE_API_BASE),
      {
        method: 'GET',
        credentials: 'include', // Include cookies if needed
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch collaborative data');
          }
          return response.json();
        })
        .then((data: CollaborativeData[]) => {
          setSortedData(data); // Set the fetched data
        })
        .catch((error) => {
          console.error('Error fetching collaborative data:', error);
        });
    }, []); // Run only once when the component mounts

  // Filter the data based on the search query
  const filteredData = sortedData.filter((collaborative) => {
    const query = searchQuery.toLowerCase();
    return (
      collaborative.name.toLowerCase().includes(query) ||
      collaborative.description.toLowerCase().includes(query) ||
      collaborative.leaderName.toLowerCase().includes(query)
    );
  });

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md" pt="sm" pb="xl">
        Collaborative Directory
      </Title>

      {/* Search Input */}
      <TextInput
        placeholder="Search collaboratives"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        mb="xl"
      />

      {/* Grid to display collaborative data */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
        {filteredData.map((collaborative) => (
          <Card key={collaborative.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center">
                <img src='/assets/EmptyLogo.png' alt="Collaborative Logo" height={90} />
                <Text ta="center" fz="lg" fw={500} >
                    {collaborative.name}
                </Text>
            </Stack>
            <Text ta="center" c="dimmed" size="sm" mb="lg">
                Formed on {collaborative.createdAt}
            </Text>
            <Grid>
                <Grid.Col span={6}>
                    <Text ta="center" c="dimmed" fz="sm" mb="xs">
                        Projects
                    </Text>
                    <Title order={3} c="dimmed" ta="center">5</Title>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text ta="center" c="dimmed" fz="sm" mb="xs">
                        Members
                    </Text>
                    <Title order={3} c="dimmed" ta="center">5</Title>
                </Grid.Col>
            </Grid>
            <Link
              to={`/collaboratives/${collaborative.id}`}
              state={{ from: location.pathname }}
              style={{ textDecoration: 'none', color: 'inherit'}}>
              <Button variant="default" fullWidth size="sm" mt="lg">View</Button>
            </Link>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}