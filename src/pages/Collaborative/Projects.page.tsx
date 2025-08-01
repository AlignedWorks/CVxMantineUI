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
 } from '@mantine/core';
import { CollaborativeData, Project } from '../../data.ts';


export function CollaborativeProjects() {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
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

  fetchCollaborativeData();
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
              <img src={collaborative.logoUrl} width={80}/>
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
              <Title order={2} ta="center" hiddenFrom="sm"  mt="xs" mb="md">
                  {collaborative.name} Collaborative
              </Title>
              <Title order={2} visibleFrom="sm" mt="xs" mb="md">
                  {collaborative.name} Collaborative
              </Title>

              {projects.length > 0 ? (
              <Table.ScrollContainer minWidth={400} mt="xl">
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Projects</Table.Th>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Approval Status</Table.Th>
                      <Table.Th>Launch Token Budget</Table.Th>
                      <Table.Th>Created</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {projects.map((project) => (
                      <Table.Tr key={project.id}>
                        <Table.Td>
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
                        <Table.Td>{project.description}</Table.Td>
                        <Table.Td>{project.approvalStatus}</Table.Td>
                        <Table.Td>{project.launchTokenBudget}</Table.Td>
                        <Table.Td>{new Date(project.createdAt).toLocaleDateString()}</Table.Td>
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
              Add a Project
            </Button>
          </Link>
        </Group>
      ) : (
        <Group justify="right">
          <Tooltip label="Only collaborative admins can add projects">
            <Button disabled mb="sm">
              Add a Project
            </Button>
          </Tooltip>
        </Group>
      )}

    </Container>
  );
}