import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import {
  Container,
  Text,
  Loader,
  Grid,
  Card,
  Stack,
  Title,
  Group,
  Button,
  Table,
  Center,
  Tooltip,
  Badge,
  Image,
 } from '@mantine/core';
import { CollaborativeData, Project, approvalStatusColors, approvalStatusSortOrder } from '../../data.ts';

interface TokenDistribution {
  currentTokenRelease: number;
  launchTokensBalance: number;
}

export function CollaborativeProjects() {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [tokenDistribution, setTokenDistribution] = useState<TokenDistribution | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [id, setCollaborativeId]);

  useEffect(() => {
    const fetchCollaborativeData = async () => {
    try {
      const response = await fetch(
        new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch collaborative data');
      }

      const data: CollaborativeData = await response.json();
      console.log(data);
      setCollaborative(data);
    } catch (error) {
      console.error('Error fetching collaborative data:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated regardless of success or failure
    }
  };

  const fetchTokenDistribution = async () => {
      try {
        const response = await fetch(
          new URL(`collaboratives/${id}/token-distribution`, import.meta.env.VITE_API_BASE),
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch token distribution');
        }

        const data: TokenDistribution = await response.json();
        setTokenDistribution(data);
        console.log('Token Distribution:', tokenDistribution);

      } catch (error) {
        console.error('Error fetching token distribution:', error);
        setTokenDistribution({launchTokensBalance: 1000, currentTokenRelease: 0});
      }
    };
    
  fetchCollaborativeData();
  fetchTokenDistribution();
}, [id]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          new URL(`collaboratives/${id}/projects`, import.meta.env.VITE_API_BASE),
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [id]);

  // Sort projects by approval status before mapping
  const sortedProjects = [...projects].sort((a, b) => {
    const aOrder = approvalStatusSortOrder[a.approvalStatus as keyof typeof approvalStatusSortOrder] || 999;
    const bOrder = approvalStatusSortOrder[b.approvalStatus as keyof typeof approvalStatusSortOrder] || 999;
    return aOrder - bOrder;
  });

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
      <Link to={`/collaboratives/${id}`} style={{ textDecoration: 'none', color: '#0077b5' }}>
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
              <Title order={2} ta="center" hiddenFrom="sm" mt="xs" mb="md">
                  {collaborative.name} Collaborative
              </Title>
              <Title order={1} visibleFrom="sm" mt="xs" mb="md">
                  {collaborative.name} Collaborative
              </Title>

              {projects.length > 0 ? (
              <Table.ScrollContainer minWidth={400} mt="xl">
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ verticalAlign: 'top' }}>Project</Table.Th>
                      <Table.Th style={{ verticalAlign: 'top' }}>Description</Table.Th>
                      <Table.Th style={{ verticalAlign: 'top' }}>Admin</Table.Th>
                      <Table.Th w={110} style={{ verticalAlign: 'top' }}>Approval Status</Table.Th>
                      <Table.Th w={80} style={{ textAlign: 'right', verticalAlign: 'top' }}>Budget (tokens)</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sortedProjects.map((project) => (
                      <Table.Tr key={project.id}>
                        <Table.Td style={{ verticalAlign: 'top' }}>
                          <Text fz="sm" fw={500} 
                            style={{ 
                              color: '#0077b5', 
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            component={Link}
                            to={`/collaboratives/${project.collabId}/projects/${project.id}`}
                            >
                            {project.name}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ verticalAlign: 'top' }}>{project.description}</Table.Td>
                        <Table.Td style={{ verticalAlign: 'top' }}>{project.adminName}</Table.Td>
                        <Table.Td style={{ verticalAlign: 'top' }}>
                          {project.approvalStatus == 'Draft' ? (
                            <Tooltip color="gray" label="Pending submission of a completed proposal by the assigned Project Admin">
                              <Badge color={'gray'} variant="light">
                                {project.approvalStatus}
                              </Badge>
                            </Tooltip>
                          ) : (
                            <Badge
                              color={approvalStatusColors[project.approvalStatus] ?? 'gray'}
                              variant="light"
                            >
                              {project.approvalStatus}
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right', verticalAlign: 'top' }}>{project.budget.toFixed(2)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
              ) : (
                <Text size="md" c="dimmed" mt="xl">
                  No projects created yet for this collaborative.
                </Text>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {collaborative.userIsCollabAdmin ? (
        <Group justify="right">
          <Link to={`/create-project/${id}`} style={{ textDecoration: 'none' }}>
            <Button variant="default" mb="sm">
              Propose a Project
            </Button>
          </Link>
        </Group>
      ) : (
        <Group justify="right">
          <Tooltip
            color="gray"
            label="Only collaborative admins can add projects"
            multiline
            w={220}
          >
            <Button disabled mb="sm">
              Propose a Project
            </Button>
          </Tooltip>
        </Group>
      )}

    </Container>
  );
}