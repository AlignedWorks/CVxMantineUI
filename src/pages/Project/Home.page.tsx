import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
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
  Center,
  Image,
  Tooltip,
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

  const handleSubmitForApproval = () => {
    // Logic to submit the project for approval
    if (project) {
      const apiBase = import.meta.env.VITE_API_BASE;

      if (!apiBase) {
        console.warn('VITE_API_BASE not configured');
        return;
      }

      try {
        const apiUrl = new URL(`projects/${project.id}/submit`, apiBase);
        fetch(apiUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to submit project for approval');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Submission successful:', data);
            if (data.message === "submitted")
            {
              setProject((prev) => (prev ? { ...prev, approvalStatus: 'Submitted' } : prev));
            }
            else if (data.message === "active")
            {
              setProject((prev) => (prev ? { ...prev, approvalStatus: 'Active' } : prev));
            }
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
                  <Tooltip color="gray" label="Total number of Launch Tokens allocated for this budget">
                    <Text mb="md">Project Budget: {Number(project.budget).toFixed(2)} Tokens</Text>
                  </Tooltip>
                  <Tooltip color="gray" label="Tokens in the project budget that have not yet been allocated">
                    <Text mb="md">Available Budget: {Number(project.balance).toFixed(2)} Tokens</Text>
                  </Tooltip>
                  <Text mb="md">
                    Project Admin Pay: {Number(project.adminPay).toFixed(2)} Tokens<br/>
                    <Text fz="sm" c="dimmed">
                      {(() => {
                        const pay = Number(project.adminPay);
                        const budget = Number(project.budget);
                        const pct = budget > 0 && Number.isFinite(pay) && Number.isFinite(budget)
                          ? (pay / budget) * 100
                          : 0;
                      return `(${pct.toFixed(2)}% of budget)`;
                      })()}
                    </Text>
                  </Text>
                  <Group mb="md">
                    {project.approvalStatus === 'Active' ? (
                      <Badge variant="light" color="yellow">{project.approvalStatus}</Badge>
                    ) : project.approvalStatus === 'Draft' ? (
                      <Tooltip
                        color="gray"
                        label="Pending submission of a completed proposal by the assigned Project Admin"
                        multiline
                        w={220}
                      >
                        <Badge variant="light" color="pink">{project.approvalStatus}</Badge>
                      </Tooltip>
                    ) : (
                      <Badge variant="light" color="pink">{project.approvalStatus}</Badge>
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
                        {project.adminName}
                      </Text>
                      <Text 
                        fz="sm" 
                        c="#0077b5"
                        component="a"
                        href={`mailto:${project.adminEmail}`}
                        style={{
                          textDecoration: 'none',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {project.adminEmail}
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

              {project.userIsProjectAdmin && Array.isArray(project.reasonsForDecline) && project.approvalStatus === 'Declined' ? (
                <div>
                  <Text c="red" mb="xs">
                    <strong>Reasons this collaborative was declined:</strong>
                  </Text>
                  {project.reasonsForDecline.map((decline) => (
                    <Text c="red" key={decline.id}>
                      <strong>{decline.memberName}:</strong> {decline.reason}
                    </Text>
                  ))}
                </div>
              ) : null}

            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Group justify="right">
        {/* Submit for approval — visible only to project admins; approvalStatus is Draft or Declined */}
        {(project.approvalStatus === 'Draft' || project.approvalStatus === 'Declined') && project.userIsProjectAdmin ? (
          <Tooltip
            color="gray"
            label="Submit this project to all members for their approval. The project becomes active once all members approve it."
            multiline
            w={220}
          >
            <Button variant="default" mb="sm" ml="xs"
              onClick={handleSubmitForApproval}>
              Submit for Approval
            </Button>
          </Tooltip>
        ) : (
          <>
            {project.userIsProjectAdmin ? (
              <Tooltip
                color="gray"
                label="Project status must be either Draft or Declined"
                multiline
                w={220}
              >
                <Button disabled mb="sm" ml="xs">
                  Submit for Approval
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                color="gray"
                label="Only project admins can submit the project for approval"
                multiline
                w={220}
              >
                <Button disabled mb="sm" ml="xs">
                  Submit for Approval
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </Group>

    </Container>
  );
}