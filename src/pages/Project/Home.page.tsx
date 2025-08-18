import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  Badge,
  Loader,
  Group,
  Grid,
  Card,
  Stack,
  SimpleGrid,
  Title,
  Center,
  Image,
 } from '@mantine/core';
import { ProjectDataHome } from '../../data.ts';

export function ProjectHome() {
  const { collabId, projectId } = useParams();
  const { setCollaborativeId } = useCollaborativeContext();
  const [project, setProject] = useState<ProjectDataHome | null>(null);
  const [loading, setLoading] = useState(true);

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(collabId || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [collabId, setCollaborativeId]);

  useEffect(() => {
    // Check if API base URL is available and valid
    const apiBase = import.meta.env.VITE_API_BASE;
    
    if (!apiBase) {
      console.warn('VITE_API_BASE not configured');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = new URL(`projects/${projectId}`, apiBase);

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
        .then((data: ProjectDataHome) => {
          console.log(data);
          setProject(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('API Error:', error);
          setLoading(false);
        });
    } catch (urlError) {
      console.error('Invalid API URL:', urlError);
      setLoading(false);
    }
  }, [collabId]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }
  if (!collabId || !projectId) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" c="red">
          Collaborative or Project not found.
        </Text>
      </Container>
    );
  }
  if (!project) {
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
      <Link to={`/collaboratives/${collabId}/projects`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
            <Center>
              <Image
                w="80"
                src={project.collabLogoUrl}
                mt="xs"
              />
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
              <Title order={2} ta="center" hiddenFrom="sm" mt="xs">
                {project.name} Project
              </Title>
              <Text lts="2px" ta="center" c="dimmed" hiddenFrom="sm" mb="md">
                {project.collabName.toUpperCase()} COLLABORATIVE
              </Text>
              <Title order={2} visibleFrom="sm" mt="xs">
                {project.name} Project
              </Title>
              <Text lts="2px" visibleFrom="sm" c="dimmed" mb="md">
                {project.collabName.toUpperCase()} COLLABORATIVE
              </Text>
              <SimpleGrid cols={{ base: 1, xs: 2 }} mt="xl" mb="md">
                <div>
                  <Text mb="md">
                    Launch Token Budget: {Number(project.launchTokenBudget).toFixed(2)}
                  </Text>
                  <Text mb="md">
                    Launch Token Balance: {Number(project.launchTokenBalance).toFixed(2)}
                  </Text>
                  <Text mb="md">
                    Admin Compensation: {Number(project.projectAdminCompensation * project.launchTokenBudget).toFixed(2)}<br/>
                    <Text fz="sm" c="dimmed">
                      (Based on {Number(project.projectAdminCompensation * 100).toFixed(2)}% of budget)
                    </Text>
                  </Text>
                  <Group mb="md">
                      {project.approvalStatus === 'Active' ? (
                          <Badge variant="light" color="yellow">
                              {project.approvalStatus}
                          </Badge>
                      ) : (
                          <Badge variant="light" color="pink">
                              {project.approvalStatus}
                          </Badge>
                      )}
                  </Group>
                </div>
                <div>
                  <Group mb="md" align="flex-start">
                    <Text>
                      Admin:
                    </Text>
                    <div>
                      <Text fz="md">
                          {project.projectAdminName}
                      </Text>
                      <Text 
                        fz="sm" 
                        c="#0077b5"
                        component="a"
                        href={`mailto:${project.projectAdminEmail}`}
                        style={{
                          textDecoration: 'none',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {project.projectAdminEmail}
                      </Text>
                    </div>
                  </Group>
                  <Group>
                    <Text>
                        Created:
                    </Text>
                    <Text>
                      {project.createdAt}
                    </Text>
                  </Group>
                </div>
              </SimpleGrid>

              {project.description}<br /><br />

            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

    </Container>
  );
}