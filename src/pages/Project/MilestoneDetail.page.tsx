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
import { MilestoneDetail, inviteStatusColors } from '../../data.ts';

export function ProjectMilestoneDetail() {
  const { collabId, projectId, milestoneId } = useParams();
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  
  // Completion editing state
  const [isCompletionEditing, setIsCompletionEditing] = useState(false);
  const [completionSummary, setCompletionSummary] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Approval functionality
  const [isApprovalEditing, setIsApprovalEditing] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'decline' | null>(null);
  const [feedback, setFeedback] = useState('');

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
          const milestoneDetails: MilestoneDetail = await response.json();
          setMilestone(milestoneDetails);
          setCompletionSummary(milestoneDetails.completionSummary || '');
          setProjectName(milestoneDetails.projectName || '');
          setIsComplete(milestoneDetails.isComplete || false);

          console.log("Fetched milestone:", milestoneDetails);
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
        new URL(`milestones/${milestoneId}`, import.meta.env.VITE_API_BASE),
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isComplete,
            completionSummary,
          }),
        }
      );

      if (response.ok) {
        const updatedMilestone: MilestoneDetail = await response.json();
        setMilestone(updatedMilestone);

        setIsCompletionEditing(false);
        setSuccessMessage("Completion status updated successfully.");
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error("Error updating completion:", error);
    }
  };

  const handleApprovalAction = async () => {
    if (!milestone || !approvalAction) return;

    try {
      const response = await fetch(
        new URL(`milestones/${milestoneId}`, import.meta.env.VITE_API_BASE),
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: approvalAction,
            feedback: approvalAction === 'decline' ? feedback : undefined,
          }),
        }
      );

      if (response.ok) {
        const updatedMilestone: MilestoneDetail = await response.json();
        setMilestone(updatedMilestone);
        setIsApprovalEditing(false);
        setApprovalAction(null);
        setFeedback('');
        setSuccessMessage(`Milestone ${approvalAction === 'approve' ? 'approved' : 'declined'} successfully.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error("Error updating approval:", error);
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

  // Check if user is a project admin
  const isProjectAdmin = milestone.projectAdmins?.some(admin => admin.adminId === user?.userId);
  const isAssigneeAndAccepted = milestone.assigneeId === user?.userId && milestone.inviteStatus === 'Accepted';

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
              
              {milestone.isComplete && (
                <Badge color="green" variant="filled">
                  Completed
                </Badge>
              )}
            </Group>
          </div>
          
          <Group grow>
            <div>
            <Text fw={600} size="sm" c="dimmed" mb={4}>Description</Text>
            <Text>{milestone.description}</Text>
          </div>
            <div>
              <Text fw={600} size="sm" c="dimmed" mb={4}>
                Invite Status
              </Text>
              <Badge
                  color={inviteStatusColors[milestone.inviteStatus] || 'gray'} // Default to 'gray' if status is unknown
                  variant="light">
                  {milestone.inviteStatus}
              </Badge>
            </div>
             <div>
              <Text fw={600} size="sm" c="dimmed" mb={4}>
                Approval Status
              </Text>
              <Badge
                color={milestone.approvalStatus === 'Active' ? 'green' : 
                        milestone.approvalStatus === 'Submitted' ? 'yellow' : 'pink'}
                variant="light"
              >
                {milestone.approvalStatus}
              </Badge>
             </div>
          </Group>
          

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
          {isAssigneeAndAccepted && (
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
                      checked={isComplete}
                      onChange={(event) => setIsComplete(event.currentTarget.checked)}
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
                          setIsComplete(milestone.isComplete || false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack gap="md">
                    <Text fw={600} size="sm">
                      Status: {milestone.isComplete ? 'Completed' : 'In Progress'}
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

          {/* Approval Section - Only for project admins when milestone is complete */}
          {isProjectAdmin && milestone.isComplete && (
            <>
              <Divider />
              <div>
                <Title order={3} mb="md">Milestone Approval</Title>
                
                {successMessage && (
                  <Text c="green" size="sm" mb="md">{successMessage}</Text>
                )}

                {isApprovalEditing ? (
                  <Stack gap="md">
                    <Group gap="md">
                      <Button
                        variant={approvalAction === 'approve' ? 'filled' : 'outline'}
                        color="green"
                        onClick={() => setApprovalAction('approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant={approvalAction === 'decline' ? 'filled' : 'outline'}
                        color="red"
                        onClick={() => setApprovalAction('decline')}
                      >
                        Decline
                      </Button>
                    </Group>
                    
                    {approvalAction === 'decline' && (
                      <Textarea
                        label="Feedback (Required for decline)"
                        placeholder="Please explain why this milestone is being declined..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        minRows={3}
                        required
                      />
                    )}
                    
                    <Group gap="sm">
                      <Button
                        onClick={handleApprovalAction}
                        disabled={!approvalAction || (approvalAction === 'decline' && !feedback.trim())}
                      >
                        Submit {approvalAction === 'approve' ? 'Approval' : 'Decline'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsApprovalEditing(false);
                          setApprovalAction(null);
                          setFeedback('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack gap="md">
                    {milestone.feedback && (
                      <div>
                        <Text fw={600} size="sm" c="dimmed" mb={4}>Previous Feedback</Text>
                        <Text size="sm" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          {milestone.feedback}
                        </Text>
                      </div>
                    )}
                    <Text size="sm" c="dimmed">
                      This milestone has been marked complete and is awaiting approval.
                    </Text>
                    <Button
                      variant="light"
                      onClick={() => setIsApprovalEditing(true)}
                    >
                      Review & Approve
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