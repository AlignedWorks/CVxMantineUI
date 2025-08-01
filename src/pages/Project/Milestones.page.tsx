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
 } from '@mantine/core';
import { ProjectDataWithMilestones, ProjectMember, ProjectDataWithMembers } from '../../data.ts';

export function ProjectMilestones() {
  // const location = useLocation();
  const { collabId, projectId } = useParams();
  const { setCollaborativeId } = useCollaborativeContext();
  const [project, setProject] = useState<ProjectDataWithMilestones | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [launchTokenError, setLaunchTokenError] = useState<string | null>(null);

  // Milestone form state
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [launchTokenPercentage, setLaunchTokenPercentage] = useState<number | string>('');
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

    // Validate launch token allocation
    const tokenAmount = (Number(launchTokenPercentage) / 100) * project.launchTokenBudget;
    if (tokenAmount > project.launchTokenBalance) {
      setLaunchTokenError(`This allocation (${tokenAmount} tokens) exceeds available balance (${project.launchTokenBalance} tokens)`);
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
            launchTokenPercentage: Number(launchTokenPercentage) || 0,
            dueDate: dueDate ? dueDate.toISOString() : null,
            assigneeId: assigneeId,
          }),
        }
      );

      if (response.ok) {
        const newMilestone = await response.json();
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
        setLaunchTokenPercentage('');
        setDueDate(null);
        setAssigneeId(null);
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
  };

  // Function to handle launch token percentage change with validation
  const handleLaunchTokenChange = (value: number | string) => {
    setLaunchTokenPercentage(value);
    
    // Clear error when user changes value
    if (launchTokenError) {
      setLaunchTokenError(null);
    }
    
    // Validate if value is provided
    if (value && Number(value) > 0) {
      const tokenAmount = (Number(value) / 100) * project.launchTokenBudget;
      if (tokenAmount > project.launchTokenBalance) {
        setLaunchTokenError(`This allocation (${tokenAmount.toFixed(0)} tokens) exceeds available balance (${project.launchTokenBalance} tokens)`);
      }
    }
  };

  // Calculate maximum percentage allowed
  const maxPercentage = project.launchTokenBudget > 0 
    ? Math.floor((project.launchTokenBalance / project.launchTokenBudget) * 100)
    : 0;

  // Check if form is valid
  const isFormValid = milestoneName && 
                     milestoneDescription && 
                     !dueDateError && 
                     !launchTokenError &&
                     (!dueDate || dueDate > new Date());

  // Prepare assignee options for the dropdown
  const assigneeOptions = projectMembers.map(member => ({
    value: member.id,
    label: `${member.firstName} ${member.lastName}`,
  }));

  const milestoneRows = project.milestones.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
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
      <Table.Td>
        <Text>
          {item.description}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text>
          {item.assigneeName}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text>
          {Number(item.launchTokenValue).toFixed(2)}
        </Text>
      </Table.Td>
      <Table.Td>
        {item.approvalStatus}
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
              <img src={project.collabLogoUrl} width={80}/>
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

          {/* Assignee Selection */}
          <Select
            label="Assignee"
            placeholder="Select an assignee"
            value={assigneeId}
            onChange={setAssigneeId}
            data={assigneeOptions}
            searchable
            clearable
            nothingFoundMessage="No project members found"
          />

          {/* Launch Tokens */}
          <NumberInput
            label="Launch Tokens (%)"
            placeholder="Enter percent of project launch token budget to allocate to this milestone"
            value={launchTokenPercentage}
            onChange={handleLaunchTokenChange}
            min={0}
            max={maxPercentage}
            error={launchTokenError}
            description={`Available balance: ${project.launchTokenBalance} tokens (${maxPercentage}% of budget)`}
          />

          {/* Due Date */}
          <DatesProvider settings={{ firstDayOfWeek: 0}}>
            <DateTimePicker
              label="Due Date & Time"
              placeholder="Select due date and time"
              value={dueDate}
              onChange={handleDueDateChange}
              error={dueDateError}
              minDate={new Date()}
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