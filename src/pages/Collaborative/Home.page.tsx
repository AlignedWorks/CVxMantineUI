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
  Card,
  Stack,
  SimpleGrid,
  Title,
 } from '@mantine/core';
import { CollaborativeData, PayoutFrequency } from '../../data.ts';
import {
  IconAt,
  IconMapPin,
} from '@tabler/icons-react'

const mockCollaborative: CollaborativeData =
{
  id: 1,
  name: 'Breadcoin PA Capital region',
  description: 'Breadcoin destigmatizes hunger and bridges divides. The same coin used in Harrisburg is the same coin used in Mechanicsburg. Breadcoin makes sure everyone is included at the table. We are proud to partner with many local organizations and churches throughout central Pennsylvania.',
  approvalStatus: 'Active',
  websiteUrl: 'https://breadcoin.org/locations/pa/',
  logoUrl: '/assets/logos/ByteSecure.png',
  city: "Harrisburg",
  state: "PA",
  leaderEmail: 'david@aligned.works',
  leaderName: 'David Vader',
  createdAt: 'February 1, 2022',
  revenueShare: 5,
  indirectCosts: 5,
  collabLeaderCompensation: 5,
  payoutFrequency: PayoutFrequency.Monthly,
  userIsCollabLeader: false,
  skills: [
    { id: 101, value: 'Software Development' },
    { id: 102, value: 'Open Source' },
    { id: 103, value: 'DevOps' }
  ],
  experience: [
    { id: 201, value: 'Technology' }
  ],
}

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
    // Check if API base URL is available and valid
    const apiBase = import.meta.env.VITE_API_BASE;
    
    if (!apiBase) {
      console.warn('VITE_API_BASE not configured, using mock data');
      setCollaborative(mockCollaborative);
      setLoading(false);
      return;
    }

    try {
      const apiUrl = new URL(`collaboratives/${id}`, apiBase);
      
      fetch(apiUrl, {
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
          console.error('API Error:', error);
          setCollaborative(mockCollaborative); // Use mock data in case of error
          setLoading(false);
        });
    } catch (urlError) {
      console.error('Invalid API URL:', urlError);
      setCollaborative(mockCollaborative); // Use mock data if URL construction fails
      setLoading(false);
    }
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

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
            <img src={collaborative.logoUrl} width={80}/>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
              <Title order={2} mt="xs" mb="md">
                {collaborative.name}
              </Title>
              <SimpleGrid cols={{ base: 1, xs: 2 }} mb="md">
                <div>
                  <Group>
                      {collaborative.approvalStatus === 'Active' ? (
                          <Badge color="yellow">
                              {collaborative.approvalStatus}
                          </Badge>
                      ) : (
                          <Badge color="pink">
                              {collaborative.approvalStatus}
                          </Badge>
                      )}
                  </Group>
                  <Group wrap="nowrap" gap={10} mt={10}>
                    <IconAt stroke={1.5} size={16} />
                    <a
                      href={collaborative.websiteUrl}
                      style={{ color: '#0077b5', textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer">
                        {getDisplayUrl(collaborative.websiteUrl)}
                    </a>
                  </Group>
                  <Group wrap="nowrap" gap={10} mt={10}>
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
              <SimpleGrid cols={{ base: 1, xs: 2 }} mb="lg">
                <div>
                <Text mb="md">
                  Skills<br/>
                  {collaborative.skills.map((skill, index) => (
                    <Badge key={index} variant="light" color="blue">
                      {skill.value}
                    </Badge>
                  ))}
                </Text>
                </div>
                <div>
                  <Text mb="md">
                    Experience<br/>
                    {collaborative.experience.map((exp, index) => (
                      <Badge key={index} variant="light" color="green">
                        {exp.value}
                      </Badge>
                    ))}
                  </Text>
                </div>
              </SimpleGrid>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
      
      <Group justify="right">
        <Button 
          component={Link} 
          to={`/collaboratives/${collaborative.id}/csa-agreement`}
          variant="default"
          mb="sm"
        >
          View Collaborative Sharing Agreement
        </Button>
        
        {collaborative.userIsCollabLeader && (
          <Link to={`/collaboratives/${id}/edit`} style={{ textDecoration: 'none' }}>
            <Button variant="default" mb="sm">
              Edit Collaborative Info
            </Button>
        </Link>
        )}
      </Group>

    </Container>
  );
}