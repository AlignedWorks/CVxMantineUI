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
  Paper,
  Center,
  Grid,
} from '@mantine/core';
import { MilestoneDetail, inviteStatusColors } from '../../data.ts';
import { FileUpload } from '../../components/uploads/FileUpload.tsx';
import { CSADocumentViewer } from '../../components/CSADocumentViewer';

export function ProjectMilestoneDetail() {
  const { collabId, projectId, milestoneId } = useParams();
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [hasReadDoc, setHasReadDoc] = useState(false);
  
  // Completion editing state
  const [isCompletionEditing, setIsCompletionEditing] = useState(false);
  const [completionSummary, setCompletionSummary] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [artifactUrl,setArtifactUrl] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  // Approval functionality
  const [isApprovalEditing, setIsApprovalEditing] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'decline' | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setCollaborativeId(collabId || null);
    return () => setCollaborativeId(null);
  }, [collabId, setCollaborativeId]);

  const handleAgreementComplete = () => {
    setHasReadDoc(true);
  };

  console.log("hasReadDoc:", hasReadDoc);

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
          console.log(projectName);
          setIsComplete(milestoneDetails.isComplete || false);
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
            artifactUrl,
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
            approvalStatus: approvalAction,
            feedback: approvalAction === 'decline' ? feedback : undefined,
            isComplete: milestone.isComplete,
            completionSummary: milestone.completionSummary,
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
        if (updatedMilestone.approvalStatus === 'Declined')
        {
          setIsComplete(false);
        }
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
      {/* Back Link */}
      <Link to={`/collaboratives/${collabId}/projects/${projectId}/milestones`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="lg">
          <div>
            <Title order={1} mb="lg">{milestone.name}</Title>
            <Group gap="md">
              
              {milestone.isComplete && (
                <Badge color="green" variant="filled">
                  Completed
                </Badge>
              )}
            </Group>
          </div>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Description</Text>
              <Text mb="md">{milestone.description}</Text>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Definition of Done</Text>
              <Text mb="md">{milestone.definitionOfDone}</Text>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Deliverables</Text>
              <Text>{milestone.deliverables}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Assignee</Text>
              <Text mb="md">{milestone.assigneeName || 'Not assigned'}</Text>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Start Date</Text>
              <Text mb="md">
                {milestone.startDate 
                  ? new Date(milestone.startDate).toLocaleDateString()
                  : 'No start date set'
                }
              </Text>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Due Date</Text>
              <Text>
                {milestone.dueDate 
                  ? new Date(milestone.dueDate).toLocaleDateString()
                  : 'No due date set'
                }
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Launch Tokens</Text>
              <Text mb="md">{Number(milestone.allocatedLaunchTokens).toFixed(2)}</Text>
              <Text fw={600} size="sm" c="dimmed" mb={4}>
                Invite Status
              </Text>
              <Badge
                  color={inviteStatusColors[milestone.inviteStatus] || 'gray'} // Default to 'gray' if status is unknown
                  variant="light"
                  mb="md"
              >
                  {milestone.inviteStatus}
              </Badge>
              <Text fw={600} size="sm" c="dimmed" mb={4}>
                Approval Status
              </Text>
              <Badge
                color={milestone.approvalStatus === 'Active' ? 'green' : 
                        milestone.approvalStatus === 'Submitted' ? 'yellow' : 'pink'}
                variant="light"
                mb="md"
              >
                {milestone.approvalStatus}
              </Badge>
            </Grid.Col>
          </Grid>

          {milestone.approvalStatus === 'Declined' && (
            <>
              <Text fw={600} size="sm" c="dimmed" mb={4}>Feedback</Text>
              <Text c="red">{milestone.feedback}</Text>
            </>
          )}

          {/* Completion Section - Only for assignees */}
          {isAssigneeAndAccepted && milestone.approvalStatus != 'Archived' && (
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

                    {/* File Upload Section */}
                    <div>
                      <FileUpload
                        onSuccess={(url) => {
                          setArtifactUrl(url);
                          setSuccessMessage("Artifact uploaded successfully.");
                          setTimeout(() => setSuccessMessage(''), 3000);
                        }}
                      />
                    </div>

                    <Paper 
                      withBorder 
                      style={{ 
                        overflow: 'hidden',
                        maxWidth: '100%'
                      }}
                    >
                      {loading ? (
                        <Center p="xl">
                          <Loader size="lg" />
                          <Text ml="md">Loading document...</Text>
                        </Center>
                      ) : milestone?.artifactUrl ? (
                        <div style={{ 
                          overflow: 'auto',
                          maxWidth: '100%',
                          width: '100%'
                        }}>
                          <CSADocumentViewer 
                            documentUrl={milestone?.artifactUrl || ""}
                            allPagesRead={handleAgreementComplete}
                          />
                        </div>
                      ) : (
                        <Center p="xl">
                          <Text c="red">No document URL available</Text>
                        </Center>
                      )}
                    </Paper>

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
          {isProjectAdmin && milestone.isComplete && milestone.approvalStatus != 'Archived' && (
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