import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext.tsx';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import { DatesProvider, DateTimePicker } from '@mantine/dates';
import {
  Container,
  Text,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Loader,
  Group,
  Grid,
  Table,
  Modal,
  Card,
  Stack,
  Title,
  Tooltip,
  Center,
  Select,
  Badge,
  Image,
  Divider,
  Switch,
  Paper,
 } from '@mantine/core';
import { ProjectDataWithMilestones, ProjectMember, ProjectDataWithMembers, Milestone, MilestoneDetail, inviteStatusColors } from '../../data.ts';
import { FileUpload } from '../../components/uploads/FileUpload.tsx';
import { CSADocumentViewer } from '../../components/CSADocumentViewer';

export function ProjectMilestones() {
  // const location = useLocation();
  const { collabId, projectId } = useParams();
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [project, setProject] = useState<ProjectDataWithMilestones | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [launchTokenError, setLaunchTokenError] = useState<string | null>(null);

  // Milestone Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [hasReadDoc, setHasReadDoc] = useState(false);
  
  // Completion editing state
  const [isCompletionEditing, setIsCompletionEditing] = useState(false);
  const [completionSummary, setCompletionSummary] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [artifactUrl, setArtifactUrl] = useState<string>('');

  // Approval functionality
  const [isApprovalEditing, setIsApprovalEditing] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'decline' | null>(null);
  const [feedback, setFeedback] = useState('');

  // Milestone form state
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneDefinitionOfDone, setMilestoneDefinitionOfDone] = useState('');
  const [milestoneDeliverables, setMilestoneDeliverables] = useState('');
  const [launchTokenAmount, setLaunchTokenAmount] = useState<number | string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  // Get the "from" state or default to a fallback
  // const from = location.state?.from || '/collaborative-directory';

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(collabId || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [collabId, setCollaborativeId]);

  useEffect(() => {
    fetch(
      new URL(`projects/${projectId}/milestones`, import.meta.env.VITE_API_BASE),
    {
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
      .then((data: ProjectDataWithMilestones) => {
        console.log(data);
        setProject(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [projectId]);

  // New function to fetch milestone details
  const fetchMilestoneDetails = async (milestoneId: number) => {
    setDetailLoading(true);
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
        setSelectedMilestone(milestoneDetails);
        setCompletionSummary(milestoneDetails.completionSummary || '');
        setIsComplete(milestoneDetails.isComplete || false);
        setArtifactUrl(milestoneDetails.artifactUrl || '');
      }
    } catch (error) {
      console.error("Error fetching milestone:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle milestone row click
  const handleMilestoneClick = (milestoneId: number) => {
    fetchMilestoneDetails(milestoneId);
    setIsDetailModalOpen(true);
  };

  // Handle closing detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMilestone(null);
    setIsCompletionEditing(false);
    setIsApprovalEditing(false);
    setApprovalAction(null);
    setFeedback('');
    setHasReadDoc(false);
  };

  // Handle agreement complete
  const handleAgreementComplete = () => {
    setHasReadDoc(true);
  };

  // Handle update completion
  const handleUpdateCompletion = async () => {
    if (!selectedMilestone) return;

    try {
      const response = await fetch(
        new URL(`milestones/${selectedMilestone.id}`, import.meta.env.VITE_API_BASE),
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
        setSelectedMilestone(updatedMilestone);
        setIsCompletionEditing(false);
        setSuccessMessage("Completion status updated successfully.");
        setTimeout(() => setSuccessMessage(''), 3000);

        console.log(hasReadDoc);
        
        // Update the project milestones list
        setProject(prev => prev ? {
          ...prev,
          milestones: prev.milestones.map(m => 
            m.id === updatedMilestone.id 
              ? { ...m, approvalStatus: updatedMilestone.approvalStatus }
              : m
          )
        } : null);
      }
    } catch (error) {
      console.error("Error updating completion:", error);
    }
  };

  // Handle approval action
  const handleApprovalAction = async () => {
    if (!selectedMilestone || !approvalAction) return;

    try {
      const response = await fetch(
        new URL(`milestones/${selectedMilestone.id}`, import.meta.env.VITE_API_BASE),
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approvalStatus: approvalAction,
            feedback: approvalAction === 'decline' ? feedback : undefined,
            isComplete: selectedMilestone.isComplete,
            completionSummary: selectedMilestone.completionSummary,
          }),
        }
      );

      if (response.ok) {
        const updatedMilestone: MilestoneDetail = await response.json();
        setSelectedMilestone(updatedMilestone);
        setIsApprovalEditing(false);
        setApprovalAction(null);
        setFeedback('');
        setSuccessMessage(`Milestone ${approvalAction === 'approve' ? 'approved' : 'declined'} successfully.`);
        if (updatedMilestone.approvalStatus === 'Declined') {
          setIsComplete(false);
        }
        setTimeout(() => setSuccessMessage(''), 3000);

        // Update the project milestones list
        setProject(prev => prev ? {
          ...prev,
          milestones: prev.milestones.map(m => 
            m.id === updatedMilestone.id 
              ? { ...m, approvalStatus: updatedMilestone.approvalStatus }
              : m
          )
        } : null);
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

  if (!project) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" c="red">
          Project not found.
        </Text>
      </Container>
    );
  }

  const fetchProjectMembers = async () => {
    await fetch(
      new URL(`projects/${projectId}/members`, import.meta.env.VITE_API_BASE),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        return response.json();
      })
      .then((data: ProjectDataWithMembers) => {

        setProjectMembers(data.members); // Set the filtered data

      })
      .catch((error) => {
        console.error('Error fetching member data:', error);
      })
  };

  const handleAddMilestone = async () => {
    if (!milestoneName || !milestoneDescription) return;

    // Validate due date is in the future
    if (dueDate && dueDate <= new Date()) {
      setDueDateError('Due date must be in the future');
      return;
    }

    // Validate start date is before due date
    if (startDate && dueDate && startDate >= dueDate) {
      setStartDateError('Start date must be before due date');
      return;
    }

    // Validate launch token allocation
    if (launchTokenAmount && Number(launchTokenAmount) > project.launchTokenBalance) {
      setLaunchTokenError(`This allocation (${Number(launchTokenAmount).toFixed(0)} tokens) exceeds available balance (${project.launchTokenBalance} tokens)`);
      return;
    }

    try {
      const response = await fetch(
        new URL("milestones", import.meta.env.VITE_API_BASE),
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            projectId: projectId,
            name: milestoneName,
            description: milestoneDescription,
            definitionOfDone: milestoneDefinitionOfDone,
            deliverables: milestoneDeliverables,
            launchTokenAmount: Number(launchTokenAmount) || 0,
            startDate: startDate ? startDate.toISOString() : null,
            dueDate: dueDate ? dueDate.toISOString() : null,
            assigneeId: assigneeId,
          }),
        }
      );

      if (response.ok) {
        const newMilestone: Milestone = await response.json();
        console.log("Milestone added successfully:", newMilestone);
        
        // Update the project state with the new milestone
        setProject(prev => prev ? {
          ...prev,
          milestones: [...prev.milestones, newMilestone]
        } : null);

        // Reset form
        setMilestoneName('');
        setMilestoneDescription('');
        setLaunchTokenAmount('');
        setDueDate(null);
        setAssigneeId(null);
        setStartDateError(null);
        setDueDateError(null);
        setLaunchTokenError(null);

        // Close modal
        setIsModalOpen(false);
        
        // Show success message briefly on the main page
        setSuccessMessage(`Milestone "${milestoneName}" has been added successfully.`);
        setTimeout(() => setSuccessMessage(''), 3000);

      } else {
        console.error("Failed to add milestone");
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  // Function to handle due date change with validation
  const handleDueDateChange = (date: Date | null) => {
    setDueDate(date);
    
    // Clear error when user changes date
    if (dueDateError) {
      setDueDateError(null);
    }
    
    // Validate if date is provided and is in the past
    if (date && date <= new Date()) {
      setDueDateError('Due date must be in the future');
    }

    // Validate if date is after start date
    if (date && startDate && date <= startDate) {
      setDueDateError('Due date must be after start date');
    }
  };

  // Function to handle start date change with validation
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);

    // Clear error when user changes date
    if (startDateError) {
      setStartDateError(null);
    }
    
    // Validate if date is provided and is in the past
    if (date && date <= new Date()) {
      setStartDateError('Start date must be in the future');
    }

    // Validate if date is before due date
    if (date && dueDate && date >= dueDate) {
      setStartDateError('Start date must be before due date');
    }
  };

  // Function to handle launch token amount change with validation
  const handleLaunchTokenChange = (value: number | string) => {
    setLaunchTokenAmount(value);
    
    // Clear error when user changes value
    if (launchTokenError) {
      setLaunchTokenError(null);
    }
    
    // Validate if value is provided
    if (value && Number(value) > 0) {
      if (launchTokenAmount && Number(launchTokenAmount) > project.launchTokenBalance) {
        setLaunchTokenError(`This allocation (${Number(launchTokenAmount).toFixed(0)} tokens) exceeds available balance (${project.launchTokenBalance} tokens)`);
      }
    }
  };

  // Check if form is valid
  const isFormValid = milestoneName && 
                     milestoneDescription && 
                     !dueDateError && 
                     !launchTokenError &&
                     (!dueDate || dueDate > new Date());

  // Prepare assignee options for the dropdown - only accepted members
  const assigneeOptions = projectMembers
    .filter(member => member.inviteStatus === 'Accepted')
    .map(member => ({
      value: member.id,
      label: `${member.firstName} ${member.lastName}`,
  }));

  // Define the sort order for approval status
  const statusOrder = { 'Submitted': 1, 'Declined': 2, 'Draft': 3, 'Archived': 4 };

  // Sort milestones by approval status before mapping
  const sortedMilestones = [...project.milestones].sort((a, b) => {
    const aOrder = statusOrder[a.approvalStatus as keyof typeof statusOrder] || 999;
    const bOrder = statusOrder[b.approvalStatus as keyof typeof statusOrder] || 999;
    return aOrder - bOrder;
  });

  const milestoneRows = sortedMilestones.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td style={{ verticalAlign: 'top' }}>
          <Text 
            fz="sm" 
            fw={500} 
            style={{ 
              color: '#0077b5', 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onClick={() => handleMilestoneClick(item.id)}
          >
            {item.name}
          </Text>
      </Table.Td>
      <Table.Td style={{ verticalAlign: 'top' }}>
        <Text>
          {item.description}
        </Text>
      </Table.Td>
      <Table.Td style={{ verticalAlign: 'top' }}>
        <Text>
          {item.assigneeName}
        </Text>
      </Table.Td>
      <Table.Td style={{ verticalAlign: 'top' }}>
        <Text>
          {Number(item.allocatedLaunchTokens).toFixed(2)}
        </Text>
      </Table.Td>
      <Table.Td style={{ verticalAlign: 'top' }}>
        <Badge
          color={item.approvalStatus === 'Active' ? 'green' : 
                  item.approvalStatus === 'Submitted' ? 'yellow' : 'pink'}
          variant="light"
        >
          {item.approvalStatus}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  // Check permissions for the selected milestone
  const isProjectAdmin = selectedMilestone?.projectAdmins?.some(admin => admin.adminId === user?.userId);
  const isAssigneeAndAccepted = selectedMilestone?.assigneeId === user?.userId && selectedMilestone?.inviteStatus === 'Accepted';

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={`/collaboratives/${collabId}/projects/${projectId}`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx" pr="xl">
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

              {project.milestones.length > 0 ? (
                <Table.ScrollContainer minWidth={400} mt="xl">
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Milestones</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Assignee</Table.Th>
                        <Table.Th>Launch Tokens</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{milestoneRows}</Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              ) : (
                <Text c="dimmed" mt="xl">
                  No milestones have been added yet.
                </Text>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {project.userIsProjectAdminAndStatusAccepted ? (
        <Group justify="right">
          <Button
            mb="sm"
            variant="default"
            onClick={() => {
                setIsModalOpen(true);
                if (projectMembers.length === 0) {
                    fetchProjectMembers(); // Fetch users only if not already loaded
                }
            }}
            >
            Add Milestone
          </Button>
        </Group>
      ) : (
        <Group justify="right">
          <Tooltip label="Only project admins who have accepted their invites can add milestones">
            <Button disabled mb="sm">
              Add Milestone
            </Button>
          </Tooltip>
        </Group>
      )}

    <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Milestone"
        size="lg"
      >
        <Stack gap="md">
          {/* Milestone Name */}
          <TextInput
            label="Milestone Name"
            placeholder="Enter milestone name"
            value={milestoneName}
            onChange={(e) => setMilestoneName(e.target.value)}
            required
          />

          {/* Milestone Description */}
          <Textarea
            label="Description"
            placeholder="Enter milestone description"
            value={milestoneDescription}
            onChange={(e) => setMilestoneDescription(e.target.value)}
            minRows={3}
            required
          />

          {/* Milestone Definition of Done */}
          <Textarea
            label="Definition of Done"
            placeholder="List any criteria that must be satisfied for the milestone to be accepted and paid"
            value={milestoneDefinitionOfDone}
            onChange={(e) => setMilestoneDefinitionOfDone(e.target.value)}
            minRows={3}
            required
          />

          {/* Milestone Deliverables */}
          <Textarea
            label="Deliverables"
            placeholder="List any documents, artifacts, or other tangible items that must be submitted for the milestone to be accepted and paid"
            value={milestoneDeliverables}
            onChange={(e) => setMilestoneDeliverables(e.target.value)}
            minRows={3}
            required
          />

          {/* Assignee Selection */}
          <Select
            label="Assignee"
            placeholder="Select an assignee"
            value={assigneeId}
            onChange={setAssigneeId}
            data={assigneeOptions}
            required
            searchable
            clearable
            nothingFoundMessage="No project members found"
          />

          {/* Launch Tokens */}
          <NumberInput
            label="Payment Amount"
            placeholder="Enter the number of Tokens to be paid upon satisfactory completion of the Milestone"
            value={launchTokenAmount}
            onChange={handleLaunchTokenChange}
            min={0}
            max={project.launchTokenBalance}
            error={launchTokenError}
            description={`Available balance: ${project.launchTokenBalance} tokens`}
            required
          />

          {/* Start Date */}
          <DatesProvider settings={{ firstDayOfWeek: 0}}>
            <DateTimePicker
              label="Start Date & Time"
              placeholder="Select start date and time"
              value={startDate}
              onChange={handleStartDateChange}
              error={startDateError}
              minDate={new Date()}
              maxDate={dueDate ? dueDate : new Date()}
              required
            />
          </DatesProvider>

          {/* Due Date */}
          <DatesProvider settings={{ firstDayOfWeek: 0}}>
            <DateTimePicker
              label="Due Date & Time"
              placeholder="Select due date and time"
              value={dueDate}
              onChange={handleDueDateChange}
              error={dueDateError}
              minDate={startDate ? startDate : new Date()}
              required
            />
          </DatesProvider>

          {/* Success Message */}
          {successMessage && (
            <Text c="green" size="sm">
              {successMessage}
            </Text>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="md">
            <Button
              onClick={handleAddMilestone}
              disabled={!isFormValid}
            >
              Add Milestone
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setStartDateError(null);
                setDueDateError(null);
                setLaunchTokenError(null);
              }}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Milestone Detail Modal */}
      <Modal
        opened={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        title={selectedMilestone?.name || "Milestone Details"}
        size="xl"
      >
        {detailLoading ? (
          <Center p="xl">
            <Loader size="lg" />
          </Center>
        ) : selectedMilestone ? (
          <Stack gap="lg">
            <div>
              <Group gap="md" mb="md">
                <Badge
                  color={selectedMilestone.approvalStatus === 'Active' ? 'green' : 
                          selectedMilestone.approvalStatus === 'Submitted' ? 'yellow' : 'pink'}
                  variant="light"
                >
                  {selectedMilestone.approvalStatus}
                </Badge>
                {selectedMilestone.isComplete && (
                  <Badge color="green" variant="filled">
                    Completed
                  </Badge>
                )}
              </Group>
            </div>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                <Text fw={600} size="sm" c="dimmed" mb={4}>Description</Text>
                <Text mb="lg">{selectedMilestone.description}</Text>

                <Text fw={600} size="sm" c="dimmed" mb={4}>Definition of Done</Text>
                <Text mb="lg">{selectedMilestone.definitionOfDone}</Text>

                <Text fw={600} size="sm" c="dimmed" mb={4}>Deliverables</Text>
                <Text>{selectedMilestone.deliverables}</Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                <Text fw={600} size="sm" c="dimmed" mb={4}>Assignee</Text>
                <Text mb="lg">{selectedMilestone.assigneeName || 'Not assigned'}</Text>

                <Text fw={600} size="sm" c="dimmed" mb={4}>Start Date</Text>
                <Text mb="lg">
                  {selectedMilestone.startDate 
                    ? new Date(selectedMilestone.startDate).toLocaleDateString()
                    : 'No start date set'
                  }
                </Text>

                <Text fw={600} size="sm" c="dimmed" mb={4}>Due Date</Text>
                <Text>
                  {selectedMilestone.dueDate 
                    ? new Date(selectedMilestone.dueDate).toLocaleDateString()
                    : 'No due date set'
                  }
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                <Text fw={600} size="sm" c="dimmed" mb={4}>Launch Tokens</Text>
                <Text mb="lg">{Number(selectedMilestone.allocatedLaunchTokens).toFixed(2)}</Text>

                <Text fw={600} size="sm" c="dimmed" mb={4}>Cash Equivalent</Text>

                {selectedMilestone.cashEquivalent > 0 ? (
                  <Text mb="lg">${(selectedMilestone.cashEquivalent).toFixed(2)}</Text>
                ) : (
                  <Text mb="lg">N/A</Text>
                )}

                <Text fw={600} size="sm" c="dimmed" mb={4}>Assignee Status</Text>
                <Badge
                  color={inviteStatusColors[selectedMilestone.inviteStatus] || 'gray'}
                  variant="light"
                  mb="lg"
                >
                  {selectedMilestone.inviteStatus}
                </Badge>

              </Grid.Col>
            </Grid>

            {selectedMilestone.approvalStatus === 'Declined' && (
              <>
                <Text fw={600} size="sm" c="dimmed" mb={4}>Feedback</Text>
                <Text c="red">{selectedMilestone.feedback}</Text>
              </>
            )}

            {/* Completion Section - Only for assignees */}
            {isAssigneeAndAccepted && selectedMilestone.approvalStatus !== 'Archived' && (
              <>
                <Divider />
                <div>
                  <Title order={4} mb="md">Completion Management</Title>
                  
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

                      <div>
                        <FileUpload
                          onSuccess={(url) => {
                            setArtifactUrl(url);
                            setSuccessMessage("Artifact uploaded successfully.");
                            setTimeout(() => setSuccessMessage(''), 3000);
                          }}
                        />
                      </div>

                      {selectedMilestone?.artifactUrl && (
                        <Paper withBorder style={{ overflow: 'hidden', maxWidth: '100%' }}>
                          <CSADocumentViewer 
                            documentUrl={selectedMilestone.artifactUrl}
                            allPagesRead={handleAgreementComplete}
                          />
                        </Paper>
                      )}

                      <Group gap="sm">
                        <Button onClick={handleUpdateCompletion}>Save Changes</Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsCompletionEditing(false);
                            setCompletionSummary(selectedMilestone.completionSummary || '');
                            setIsComplete(selectedMilestone.isComplete || false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Stack gap="md">
                      <Text fw={600} size="sm">
                        Status: {selectedMilestone.isComplete ? 'Completed' : 'In Progress'}
                      </Text>
                      {selectedMilestone.completionSummary && (
                        <div>
                          <Text fw={600} size="sm" c="dimmed" mb={4}>Completion Summary</Text>
                          <Text>{selectedMilestone.completionSummary}</Text>
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
            {isProjectAdmin && selectedMilestone.isComplete && selectedMilestone.approvalStatus !== 'Archived' && (
              <>
                <Divider />
                <div>
                  <Title order={4} mb="md">Milestone Approval</Title>
                  
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
        ) : (
          <Text c="red">Milestone not found.</Text>
        )}
      </Modal>
    </Container>
  );
}