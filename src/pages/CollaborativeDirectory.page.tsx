import { useState, useEffect } from 'react';
import { 
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Button,
  TextInput,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface CollaborativeData {
  id: number;
  name: string;
  description: string;
  leaderEmail: string;
  createdAt: string;
  skills: string[];
  experience: string[];
}

export function CollaborativeDirectory() {
  const [sortedData, setSortedData] = useState<CollaborativeData[]>([]); // State to hold the sorted data
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

  // Fetch collaborative data from the backend
     useEffect(() => {
      fetch('https://cvx.jordonbyers.com/collaboratives', {
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
          console.log('Fetched collaborative data:', data); // Log the data to the console
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
      collaborative.leaderEmail.toLowerCase().includes(query) ||
      collaborative.skills.some((skill) => skill.toLowerCase().includes(query)) ||
      collaborative.experience.some((exp) => exp.toLowerCase().includes(query))
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
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2, xl: 3 }} spacing="xl">
        {filteredData.map((collaborative) => (
          <Card key={collaborative.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xl" mb="xl">{collaborative.name}</Text>
            <Text size="md" mb="md">
              {collaborative.description}
            </Text>
            <Text size="md" c="#666" mb="xs">
              Leader: <br/>{collaborative.leaderEmail}

            </Text>
            <Text size="md" c="#666" mb="xs">
              Projects: <br/>{collaborative.skills.join(', ')}
            </Text>
            <Button variant="outline" size="sm" mt="auto">View</Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}