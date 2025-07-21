import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.tsx';
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
 } from '@mantine/core';
import { CollaborativeData, Project } from '../../data.ts';


export function CollaborativeProjects() {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  if (user) {
    console.log(user.username);
  } else {
    console.log('User is null');
  }

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
            <img src={collaborative.logoUrl} width={80}/>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
              <Title order={2} mt="xs" mb="md">
                  {collaborative.name} Collaborative
              </Title>

              {/* Projects Table */}
              <Title order={3} mt="lg" mb="sm">
                Projects
              </Title>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Approval Status</th>
                    <th>Launch Token Budget</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.description}</td>
                      <td>{project.approvalStatus}</td>
                      <td>{project.launchTokenBudget}</td>
                      <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
      <Group justify="right">
        <Link to={`/create-project/${id}`} style={{ textDecoration: 'none' }}>
          <Button variant="default" mb="sm">
            Add a Project
          </Button>
        </Link>
      </Group>

    </Container>
  );
}