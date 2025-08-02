import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.tsx';
import { useParams, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  Button,
  Loader,
  Group,
  Card,
  Stack,
  Title,
  Badge,
  Textarea,
  Switch,
  Divider,
} from '@mantine/core';
import { Milestone } from '../../data.ts';

export function ProjectMilestoneDetail() {
  const { collabId, projectId, milestoneId } = useParams();
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  
  // Completion editing state
  const [isCompletionEditing, setIsCompletionEditing] = useState(false);
  const [completionSummary, setCompletionSummary] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setCollaborativeId(collabId || null);
    return () => setCollaborativeId(null);
  }, [collabId, setCollaborativeId]);

  useEffect(() => {
    const fetchMilestone = async () => {
      try {
        const response = await fetch(
          new URL(`milestones/${milestoneId}`, import.meta.env.VITE_API_BASE),
          {
            method: "GET",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const milestoneDetails: Milestone = await response.json();
          setMilestone(milestoneDetails);
          setCompletionSummary(milestoneDetails.completionSummary || '');
          setIsCompleted(milestoneDetails.isCompleted || false);
          
          // Also fetch project name for breadcrumb
          const projectResponse = await fetch(
            new URL(`projects/${projectId}`, import.meta.env.VITE_API_BASE),
            {
              method: "GET",
              credentials: "include",
              headers: { 'Content-Type': 'application/json' },
            }
          );
          
          if (projectResponse.ok) {
            const projectData = await projectResponse.json();
            setProjectName(projectData.name);
          }
        }
      } catch (error) {
        console.error("Error fetching milestone:", error);
      } finally {
        setLoading(false);
      }
    };

    if (milestoneId) {
      fetchMilestone();
    }
  }, [milestoneId, projectId]);

  const handleUpdateCompletion = async () => {
    if (!milestone) return;

    try {
      const response = await fetch(
        new URL(`milestones/${milestone.id}/completion`, import.meta.env.VITE_API_BASE),
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isCompleted,
            completionSummary,
          }),
        }
      );

      if (response.ok) {
        const updatedMilestone = await response.json();
        setMilestone(updatedMilestone);
        setIsCompletionEditing(false);
        setSuccessMessage("Completion status updated successfully.");
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error("Error updating completion:", error);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  if (!milestone) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" c="red">Milestone not found.</Text>
      </Container>
    );
  }

  const isAssignee = milestone.assigneeId === user?.userId;

  return (
    <Container size="md" py="xl">
      {/* Breadcrumb */}
      <Group gap="xs" mb="lg">
        <Link to={`/collaboratives/${collabId}/projects/${projectId}`} style={{ textDecoration: 'none', color: '#0077b5' }}>
          {projectName}
        </Link>
        <Text c="dimmed">/</Text>
        <Link to={`/collaboratives/${collabId}/projects/${projectId}/milestones`} style={{ textDecoration: 'none', color: '#0077b5' }}>
          Milestones
        </Link>
        <Text c="dimmed">/</Text>
        <Text c="dimmed">{milestone.name}</Text>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="lg">
          <div>
            <Title order={1} mb="sm">{milestone.name}</Title>
            <Group gap="md">
              <Badge
                color={milestone.approvalStatus === 'Active' ? 'green' : 
                       milestone.approvalStatus === 'Submitted' ? 'yellow' : 'pink'}
                variant="light"
              >
                {milestone.approvalStatus}
              </Badge>
              {milestone.isCompleted && (
                <Badge color="green" variant="filled">
                  Completed
                </Badge>
              )}
            </Group>
          </div>

          <div>
            <Text fw={600} size="sm" c="dimmed" mb={4}>Description</Text>
            <Text>{milestone.description}</Text>
          </div>

          <Group grow>
            <div>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Assignee</Text>
              <Text>{milestone.assigneeName || 'Not assigned'}</Text>
            </div>
            <div>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Due Date</Text>
              <Text>
                {milestone.dueDate 
                  ? new Date(milestone.dueDate).toLocaleDateString()
                  : 'No due date set'
                }
              </Text>
            </div>
            <div>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Launch Tokens</Text>
              <Text>{Number(milestone.launchTokenValue).toFixed(2)}</Text>
            </div>
          </Group>

          {/* Completion Section - Only for assignees */}
          {isAssignee && (
            <>
              <Divider />
              <div>
                <Title order={3} mb="md">Completion Management</Title>
                
                {successMessage && (
                  <Text c="green" size="sm" mb="md">{successMessage}</Text>
                )}

                {isCompletionEditing ? (
                  <Stack gap="md">
                    <Switch
                      label="Mark as completed"
                      checked={isCompleted}
                      onChange={(event) => setIsCompleted(event.currentTarget.checked)}
                    />
                    <Textarea
                      label="Completion Summary"
                      placeholder="Describe what was accomplished..."
                      value={completionSummary}
                      onChange={(e) => setCompletionSummary(e.target.value)}
                      minRows={4}
                    />
                    <Group gap="sm">
                      <Button onClick={handleUpdateCompletion}>
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCompletionEditing(false);
                          setCompletionSummary(milestone.completionSummary || '');
                          setIsCompleted(milestone.isCompleted || false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack gap="md">
                    <Text fw={600} size="sm">
                      Status: {milestone.isCompleted ? 'Completed' : 'In Progress'}
                    </Text>
                    {milestone.completionSummary && (
                      <div>
                        <Text fw={600} size="sm" c="dimmed" mb={4}>Completion Summary</Text>
                        <Text>{milestone.completionSummary}</Text>
                      </div>
                    )}
                    <Button
                      variant="light"
                      onClick={() => setIsCompletionEditing(true)}
                    >
                      Update Completion
                    </Button>
                  </Stack>
                )}
              </div>
            </>
          )}
        </Stack>
      </Card>
    </Container>
  );
}