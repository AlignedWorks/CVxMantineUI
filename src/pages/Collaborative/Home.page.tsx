import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.tsx';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import {
  Container,
  Text,
  Badge,
  Button,
  Loader,
  Group,
  Grid,
  Table,
  Card,
  Stack,
  SimpleGrid,
  Title,
  Center,
 } from '@mantine/core';
import { CollaborativeData } from '../../data.ts';
import {
  IconAt,
  IconMapPin,
} from '@tabler/icons-react'

export function CollaborativeHome() {
  const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the "from" state or default to a fallback
  const from = location.state?.from || '/collaborative-directory';

  if (user) {
    console.log(user.username);
  } else {
    console.log('User is null');
  }

  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      // Return just the hostname, removing www. if present
      return urlObj.hostname.replace(/^www\./, '');
    } catch (e) {
      // If URL parsing fails, return the original
      return url;
    }
  };

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [id, setCollaborativeId]);

  useEffect(() => {
    fetch(
      new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
    {
      method: 'GET',
      credentials: 'include',
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
      .then((data: CollaborativeData) => {
        console.log(data);
        setCollaborative(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  if (!collaborative) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" c="red">
          Collaborative not found.
        </Text>
      </Container>
    );
  }

  const stakingTierRows = collaborative.stakingTiers.map((item) => (
    <Table.Tr>
        <Table.Td>
          {item.tier}
        </Table.Td>
        <Table.Td>
          {(Number(item.exchangeRate) * 100).toFixed(0)}%
        </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx">
        <Grid>
          <Grid.Col span={2}>
              <Center mt="xs">
                <img src='/assets/EmptyLogo.png' width={80}/>
              </Center>
          </Grid.Col>
          <Grid.Col span={10}>
            <Stack>
              <Title order={2} mt="xs" mb="md">
                {collaborative.name}
              </Title>
              <SimpleGrid cols={2} mb="md">
                <div>
                    <Group wrap="nowrap" gap={10}>
                      <IconAt stroke={1.5} size={16} />
                      <a
                        href={collaborative.websiteUrl}
                        style={{ color: '#0077b5', textDecoration: 'none' }}
                        target="_blank"
                        rel="noopener noreferrer">
                          {getDisplayUrl(collaborative.websiteUrl)}
                      </a>
                    </Group>
                    <Group wrap="nowrap" gap={10}>
                      <IconMapPin stroke={1.5} size={16} />
                      <Text>
                          {collaborative.city}, {collaborative.state}
                      </Text>
                    </Group>
                </div>
                <div>
                  <Group mb="md" align="flex-start">
                    <Text>
                      Leader:
                    </Text>
                    <div>
                      <Text fz="md">
                          {collaborative.leaderName}
                      </Text>
                      <Text fz="sm" c="dimmed">
                          {collaborative.leaderEmail}
                      </Text>
                    </div>
                  </Group>
                  <Group>
                    <Text>
                        Created:
                    </Text>
                    <Text>
                      {collaborative.createdAt}
                    </Text>
                  </Group>
                </div>
              </SimpleGrid>
                {collaborative.description}<br /><br />
              <Grid>
                <Grid.Col span={6}>
                  <Text mb="md">
                    Skills<br/>
                    {collaborative.skills.map((skill, index) => (
                      <Badge key={index} variant="light" color="blue">
                        {skill}
                      </Badge>
                    ))}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text mb="md">
                    Experience<br/>
                    {collaborative.experience.map((exp, index) => (
                      <Badge key={index} variant="light" color="green">
                        {exp}
                      </Badge>
                    ))}
                  </Text>
                </Grid.Col>
              </Grid>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Button variant="default" mt="xl" mb="sm">
          Edit Collaborative
      </Button>

      <Card shadow="sm" padding="lg" radius="md" mt="xl" mb="xl" withBorder>
        <Title order={4} mb="xl">
            Revenue Sharing Pool
        </Title>
        <Grid>
          <Grid.Col span={4}>
              <Text fz="md" fw={500}>
                  Revenue Share %
              </Text>
              <Text fz="xl" c="#222" mb="lg">
                {collaborative.revenueShare}
              </Text>
              <Text fz="md" fw={500}>
                  Payout Frequency
              </Text>
              <Text fz="xl" c="#222" mb="lg">
                  {collaborative.payoutFrequency}
              </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Table variant="vertical" layout="fixed" withTableBorder>
             <Table.Thead>
              <Table.Tr>
                  <Table.Th>Duration</Table.Th>
                  <Table.Th>Exchange Rate</Table.Th>
              </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{stakingTierRows}</Table.Tbody>
            </Table>
          </Grid.Col>
          <Grid.Col span={4}>
              <Button variant="default" ml="xl" mb="sm">
                  Edit Revenue Share %
              </Button>
              <Button variant="default" ml="xl" mb="sm">
                  Edit Exchange Rates
              </Button>
          </Grid.Col>
        </Grid>
      </Card>

    </Container>
  );
}