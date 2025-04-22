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

interface CollaborativeData {
  id: number;
  name: string;
  description: string;
  manager_email: string;
  created_date: string;
  skills: string[];
  experience: string[];
}

const data: CollaborativeData[] = [
  {
    id: 1,
    name: 'CodeForge Collective',
    description: 'A developer-focused collaborative building open-source tools and frameworks.',
    manager_email: 'alex@codeforge.com',
    created_date: '2023-06-12',
    skills: ['Software Development', 'Open Source', 'DevOps'],
    experience: ['Technology'],
  },
  {
    id: 2,
    name: 'GreenFuture Innovators',
    description: 'A sustainability-driven group working on eco-friendly solutions and smart energy.',
    manager_email: 'emily@greenfuture.org',
    created_date: '2022-09-25',
    skills: ['Renewable Energy', 'Environmental Science', 'IoT'],
    experience: ['Clean Energy'],
  },
  {
    id: 3,
    name: 'HealthSync Alliance',
    description: 'A collaborative focused on building seamless healthcare integration systems.',
    manager_email: 'james@healthsync.com',
    created_date: '2024-01-18',
    skills: ['Healthcare IT', 'Data Security', 'AI in Medicine'],
    experience: ['Healthcare'],
  },
  {
    id: 4,
    name: 'NextGen Creators',
    description: 'A creative hub for digital artists, animators, and designers working on innovative media projects.',
    manager_email: 'sophia@nextgencreators.com',
    created_date: '2023-03-14',
    skills: ['Graphic Design', 'Animation', 'Digital Art'],
    experience: ['Creative Arts'],
  },
  {
    id: 5,
    name: 'EdTech Visionaries',
    description: 'A team dedicated to enhancing education through technology and AI-driven learning solutions.',
    manager_email: 'michael@edtechvision.com',
    created_date: '2021-11-30',
    skills: ['AI in Education', 'E-Learning', 'Software Development'],
    experience: ['Education Technology'],
  },
  {
    id: 6,
    name: 'ByteSecure Collective',
    description: 'A cybersecurity-focused group tackling modern threats with cutting-edge defense strategies.',
    manager_email: 'oliver@bytesecure.net',
    created_date: '2023-08-05',
    skills: ['Cybersecurity', 'Ethical Hacking', 'Cloud Security'],
    experience: ['Cybersecurity'],
  },
  {
    id: 7,
    name: 'UrbanAgri Solutions',
    description: 'An urban farming think tank developing high-tech agricultural solutions for cities.',
    manager_email: 'jessica@urbanagri.com',
    created_date: '2022-05-10',
    skills: ['Vertical Farming', 'Hydroponics', 'IoT in Agriculture'],
    experience: ['AgTech'],
  },
  {
    id: 8,
    name: 'FinTech Pioneers',
    description: 'A team of financial innovators building next-gen banking and investment solutions.',
    manager_email: 'william@fintechpioneers.com',
    created_date: '2023-12-01',
    skills: ['Blockchain', 'FinTech', 'Data Analytics'],
    experience: ['Financial Technology'],
  },
  {
    id: 9,
    name: 'GameCraft Studios',
    description: 'An indie game development collaborative focused on immersive storytelling and gameplay.',
    manager_email: 'david@gamecraftstudios.com',
    created_date: '2024-02-20',
    skills: ['Game Development', 'Unreal Engine', 'Narrative Design'],
    experience: ['Gaming'],
  },
  {
    id: 10,
    name: 'BuildTogether Makerspace',
    description: 'A community of engineers, designers, and tinkerers creating hardware and robotics projects.',
    manager_email: 'sarah@buildtogether.com',
    created_date: '2021-07-15',
    skills: ['Robotics', '3D Printing', 'Hardware Prototyping'],
    experience: ['Engineering & Manufacturing'],
  },
];

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
      collaborative.manager_email.toLowerCase().includes(query) ||
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
        placeholder="Search collaboratives..."
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
              Manager: <br/>{collaborative.manager_email}

            </Text>
            <Text size="md" c="#666" mb="xs">
              Projects: <br/>{collaborative.skills.join(', ')}
            </Text>
            <Button variant="outline" size="sm" mt="xl">View</Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}