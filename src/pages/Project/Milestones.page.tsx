import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
 } from '@mantine/core';
import { ProjectDataWithMilestones, ProjectMember, ProjectDataWithMembers, Milestone } from '../../data.ts';

export function ProjectMilestones() {
  // const location = useLocation();
  const { collabId, projectId } = useParams();
  const { setCollaborativeId } = useCollaborativeContext();
  const [project, setProject] = useState<ProjectDataWithMilestones | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [launchTokenError, setLaunchTokenError] = useState<string | null>(null);

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

        // Show success message
        setSuccessMessage(`Milestone "${milestoneName}" has been added successfully.`);

        // Reset form
        setMilestoneName('');
        setMilestoneDescription('');
        setLaunchTokenAmount('');
        setDueDate(null);
        setAssigneeId(null);
        setStartDateError(null);
        setDueDateError(null);
        setLaunchTokenError(null);
        
        // Clear success message after 3 seconds
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
        <Link 
          to={`/collaboratives/${collabId}/projects/${projectId}/milestones/${item.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Text 
            fz="sm" 
            fw={500} 
            style={{ 
              color: '#0077b5', 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            {item.name}
          </Text>
        </Link>
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
            <Button
              onClick={handleAddMilestone}
              disabled={!isFormValid}
            >
              Add Milestone
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}