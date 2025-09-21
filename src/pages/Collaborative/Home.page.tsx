import { useEffect, useState } from 'react';
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
  Tooltip,
  Center,
  Image,
 } from '@mantine/core';
import { CollaborativeData } from '../../data.ts';
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
  adminEmail: 'david@aligned.works',
  adminName: 'David Vader',
  createdAt: 'February 1, 2022',
  readyForSubmittal: false,
  reasonForDecline: '',
  collabAdminCompensationPercent: 5,
  userIsCollabAdmin: false,
  userIsCollabContributor: true,
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
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the "from" state or default to a fallback
  const from = location.state?.from || '/collaborative-directory';

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

  const handleSubmitForApproval = () => {
    // Logic to submit the collaborative for approval
    if (collaborative) {
      const apiBase = import.meta.env.VITE_API_BASE;

      if (!apiBase) {
        console.warn('VITE_API_BASE not configured');
        return;
      }

      try {
        const apiUrl = new URL(`collaboratives/${collaborative.id}/submit`, apiBase);
        fetch(apiUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to submit collaborative for approval');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Submission successful:', data);
            setCollaborative((prev) => (prev ? { ...prev, approvalStatus: 'Submitted' } : prev));
          })
          .catch((error) => {
            console.error('API Error:', error);
          });
      } catch (urlError) {
        console.error('Invalid API URL:', urlError);
      }
    }
  };

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
            <Center>
              <Image
                w="80"
                src={collaborative.logoUrl}
                mt="xs"
                />
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
              <Title order={2} ta="center" hiddenFrom="sm" mt="xs">
                {collaborative.name} Collaborative
              </Title>
              <Title order={2} visibleFrom="sm" mt="xs" >
                {collaborative.name} Collaborative
              </Title>

              {collaborative.approvalStatus === 'Active' ? (
                <Badge variant="light" color="yellow" mb="xl">
                    {collaborative.approvalStatus}
                </Badge>
              ) : (
                <Badge variant="light" color="pink" mb="xl">
                    {collaborative.approvalStatus}
                </Badge>
              )}

              <SimpleGrid cols={{ base: 1, xs: 2 }} mb="md">
                <div>
                  <Stack>
                    <div>
                      <Text fz="sm" c="dimmed">
                        Collab Admin
                      </Text>
                      <div>
                        <Text fz="lg">
                            {collaborative.adminName}
                        </Text>
                        <Text 
                          fz="sm" 
                          c="#0077b5"
                          component="a"
                          href={`mailto:${collaborative.adminEmail}`}
                          style={{
                            textDecoration: 'none',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {collaborative.adminEmail}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text fz="sm" c="dimmed">
                          Created
                      </Text>
                      <Text fz="lg">
                        {collaborative.createdAt}
                      </Text>
                    </div>
                    <div>
                      <Text fz="sm" c="dimmed">
                          Description
                      </Text>
                      <Text fz="lg">
                        {collaborative.description}
                      </Text>
                    </div>
                    <Group wrap="nowrap" gap={10}>
                      <IconAt stroke={1.5} size={18} />
                      <a
                        href={collaborative.websiteUrl}
                        style={{ color: '#0077b5', textDecoration: 'none' }}
                        target="_blank"
                        rel="noopener noreferrer">
                          {getDisplayUrl(collaborative.websiteUrl)}
                      </a>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={10}>
                      <IconMapPin stroke={1.5} size={18} />
                      <Text fz="lg">
                          {collaborative.city}, {collaborative.state}
                      </Text>
                    </Group>
                  </Stack>
                </div>
                <div>
                  <Text mb="md">
                    Skills<br/>
                    {collaborative.skills.map((skill, index) => (
                      <Badge key={index} variant="light" color="blue">
                        {skill.value}
                      </Badge>
                    ))}
                  </Text>
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

              {collaborative.reasonForDecline && collaborative.approvalStatus === 'Declined' && collaborative.userIsCollabAdmin ? (
                <Text c="red">
                  <strong>Reason this collaborative was declined:</strong> {collaborative.reasonForDecline}
                </Text>
              ) : null}
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
      
      <Group justify="right">
        {/* Submit for approval — visible only to collab admins; enabled only when readyForSubmittal
        and approvalStatus is Draft or Declined */}
        {(collaborative.approvalStatus === 'Draft' || collaborative.approvalStatus === 'Declined') && collaborative.userIsCollabAdmin && (
          collaborative.readyForSubmittal ? (
              <Button variant="outline" color="green" mb="sm" ml="xs"
                onClick={handleSubmitForApproval}>
                Submit for Approval
              </Button>
          ) : (
            <Tooltip
              color="gray"
              label="Collaborative not ready for submittal. The CSA must be uploaded and approved by all members first."
              multiline
              w={220}
            >
              <Button disabled mb="sm" ml="xs">
                Submit for Approval
              </Button>
            </Tooltip>
          )
        )}

        {collaborative.userIsCollabContributor && collaborative.csaDocUrl ? (
          <Button 
            component={Link} 
            to={`/collaboratives/${collaborative.id}/csa-agreement`}
            variant="default"
            mb="sm"
          >
            View Collaborative Sharing Agreement
          </Button>
        ) : (
          <Tooltip
            color="gray"
            label={
              !collaborative.userIsCollabContributor
                ? 'Only collaborative contributors can view the CSA'
                : 'Collaborative Sharing Agreement not available'
            }
            multiline
            w={220}
          >
            <Button disabled mb="sm">
              View Collaborative Sharing Agreement
            </Button>
          </Tooltip>
        )}
        
        {collaborative.userIsCollabAdmin ? (
          <Link to={`/collaboratives/${id}/edit`} style={{ textDecoration: 'none' }}>
            <Button variant="default" mb="sm">
              Edit Collaborative Profile
            </Button>
          </Link>
        ) : (
          <Tooltip
            color="gray"
            label="Only collaborative admins can edit the profile"
            multiline
            w={220}
          >
            <Button disabled mb="sm">
              Edit Collaborative Profile
            </Button>
          </Tooltip>
        )}
      </Group>

    </Container>
  );
}