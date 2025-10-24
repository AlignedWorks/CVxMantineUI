import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
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
  Paper,
  Stack,
  Title,
  Center,
  Image,
  Tooltip,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Progress,
 } from '@mantine/core';
import { ProjectDataHome, approvalStatusColors } from '../../data.ts';

export function ProjectHome() {
  const location = useLocation();
  const { collabId, projectId } = useParams();
  const { setCollaborativeId } = useCollaborativeContext();
  const [project, setProject] = useState<ProjectDataHome | null>(null);
  const [loading, setLoading] = useState(true);

  // budget values
  const [budgetSubtotal, setBudgetSubtotal] = useState<number | 0>(0);
  const [sumNetworkTransactionFees, setSumNetworkTransactionFees] = useState<number | 0>(0);

  // display helpers for Project Budget preview
  const [remainingCollaborativeBalance, setRemainingCollaborativeBalance] = useState<number | null>(null);
  const [percentOfAvailableBalance, setPercentOfAvailableBalance] = useState<number | null>(null);

  // project-level derived values
  const [remainingProjectBalance, setRemainingProjectBalance] = useState<number | null>(null);
  const [percentOfProjectBudget, setPercentOfProjectBudget] = useState<number | null>(null);

  // Edit modal state + form
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    budget: 0,
    adminPay: 0,
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string,string>>({});

  // Get the "from" state or default to a fallback
  const from = location.state?.from || `/collaboratives/${collabId}/projects`;

  // Format numbers: drop ".00" for whole numbers, otherwise show two decimals
  const formatAmount = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return '-';
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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
          setBudgetSubtotal(data ? (Number(data.adminPay) + Number(data.sumMilestonesAllocatedLaunchTokens)) : 0);
          setSumNetworkTransactionFees(data ? Number(data.networkTransactionFee * (Number(data.adminPay) + Number(data.sumMilestonesAllocatedLaunchTokens))) : 0);
          setRemainingCollaborativeBalance(data ? data.collabLaunchTokenBalance - data?.budget! : null);
          setPercentOfAvailableBalance(data ? (data?.budget! / data.collabLaunchTokenBalance) * 100 : null);
          setRemainingProjectBalance(data ? Math.round(Math.max(0, data.budget - data.adminPay)) : null);
          setPercentOfProjectBudget(data ? (data.adminPay / data.budget) * 100 : null);
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

  // Function to handle budget change with validation
  const handleBudgetChange = (value: number | string) => {

    handleFormChange('budget', value);
    
    setFormErrors(prev => {
      const next = { ...prev };
      delete next.budget;
      return next;
    });
    
    // Reset previews if no valid token distribution or no value
    if (!project?.collabLaunchTokenBalance || !value || Number(value) <= 0) {
      setRemainingCollaborativeBalance(null);
      setPercentOfAvailableBalance(null);
      setRemainingProjectBalance(null);
      setPercentOfProjectBudget(null);
      return;
    }
    
    // Validate if value is provided and token distribution is available
    if (value && Number(value) > 0 && project?.collabLaunchTokenBalance) {

      let error: string | null = null;

      // calculate change in admin pay from form to use for validation below
      const adminPayChange = Number(formValues.adminPay || 0) - (project ? Number(project.adminPay || 0) : 0);

      const projectMilestonesPlusAdminPay = project ? project.budget - project.balance + adminPayChange : 0;
      const projectNetworkTxFee = project ? (project.networkTransactionFee * (projectMilestonesPlusAdminPay)) : 0;

      // Make sure new budget doesn't drop below already allocated tokens for milestones
      if (project && project.budget - Number(value) > project.balance - adminPayChange - projectNetworkTxFee) {
        error = `The budget cannot be reduced below the amount already allocated to milestones + admin pay + network transaction fee (${(projectMilestonesPlusAdminPay + projectNetworkTxFee).toLocaleString()} tokens)`;
      }

      const projectBudgetTokens = Number(value);
      const remaining = project?.collabLaunchTokenBalance - projectBudgetTokens;
      const percentOfAvailable = project?.collabLaunchTokenBalance > 0
        ? (projectBudgetTokens / project?.collabLaunchTokenBalance) * 100
        : 0;

      const adminComp = Number(formValues.adminPay || 0);
      const remainingProject = Math.round(Math.max(0, projectBudgetTokens - adminComp));
      const percentProject = projectBudgetTokens > 0 ? (adminComp / projectBudgetTokens) * 100 : 0;

      if (projectBudgetTokens < adminComp) {
        error = `This allocation (${Math.round(projectBudgetTokens).toLocaleString()} tokens) is less than the Project Admin Pay (${Math.round(adminComp).toLocaleString()} tokens)`;
      }

      setFormErrors(prev => {
        const next = { ...prev };
        if (error) next.budget = error;
        else delete next.budget;
        return next;
      });

      setRemainingCollaborativeBalance(Math.round(remaining));
      setPercentOfAvailableBalance(percentOfAvailable);
      setRemainingProjectBalance(remainingProject);
      setPercentOfProjectBudget(percentProject);
    }
  };

  // When admin pay changes, recompute project-level previews
  const handleAdminPayChange = (value: number | string) => {

    handleFormChange('adminPay', value);
    const adminCompTokens = Number(value || 0);
    const projectBudgetTokens = Number(formValues.budget || 0);

    if (!project?.collabLaunchTokenBalance || !formValues.budget || Number(formValues.budget) <= 0) {
      setRemainingProjectBalance(null);
      setPercentOfProjectBudget(null);
      return;
    }

    setRemainingProjectBalance(Math.round(Math.max(0, projectBudgetTokens - adminCompTokens)));
    setPercentOfProjectBudget(projectBudgetTokens > 0 ? (adminCompTokens / projectBudgetTokens) * 100 : 0);
  };

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

  const handleEdit = () => {
    if (!project) return;
    setFormValues({
      name: project.name,
      budget: Number(project.budget || 0),
      adminPay: Number(project.adminPay || 0),
      description: project.description || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleFormChange = (field: keyof typeof formValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleEditSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const errs: Record<string,string> = {};

    if (!formValues.name || !formValues.name.trim()) errs.name = 'Project name is required.';
    const budget = Number(formValues.budget || 0);
    const adminPay = Number(formValues.adminPay || 0);
    if (!Number.isFinite(budget) || budget <= 0) errs.budget = 'Budget must be greater than 0.';
    if (!Number.isFinite(adminPay) || adminPay < 0) errs.adminPay = 'Admin pay must be 0 or greater.';
    if (adminPay > budget) errs.adminPay = 'Admin pay must be less than or equal to the budget.';

    if (formErrors && formErrors.budget) {  
      errs.budget = formErrors.budget;
    }
    
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    if (!project) return;

    const apiBase = import.meta.env.VITE_API_BASE;

    if (!apiBase) { console.warn('VITE_API_BASE not configured'); return; }
    
    try {
      const apiUrl = new URL(`projects/${project.id}`, apiBase);
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formValues.name,
          budget: budget,
          adminPay: adminPay,
          description: formValues.description,
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Failed to update project:', errData);
        return;
      }
      const updated = await response.json();
      setProject((prev) => prev ? { ...prev, ...updated } : prev);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
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
      <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 12, md: 2 }}>
            <Center>
              <Image
                w="80"
                src={project.collabLogoUrl}
                mt="xs"
              />
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10 }}>
            <Stack>
              <Title order={2} ta="center" hiddenFrom="md" mt="xs">
                {project.name} Project
              </Title>
              <Text lts="2px" ta="center" c="dimmed" hiddenFrom="md" mb="md">
                {project.collabName.toUpperCase()} COLLABORATIVE
              </Text>
              <Title order={1} visibleFrom="md" mt="xs">
                {project.name} Project
              </Title>

              {/* Group status badge with collab name on medium+ screens */}
              <Group visibleFrom="md">
                  {project.approvalStatus === 'Active' ? (
                    <Badge visibleFrom="md" variant="light" color={approvalStatusColors[project.approvalStatus] ?? 'gray'} mb="md">{project.approvalStatus}</Badge>
                  ) : project.approvalStatus === 'Draft' ? (
                      <Tooltip
                      color="gray"
                      label="Pending submission of a completed proposal by the assigned Project Admin"
                      multiline
                      w={220}
                      >
                       <Badge variant="light" color={approvalStatusColors[project.approvalStatus] ?? 'gray'} mb="md">{project.approvalStatus}</Badge>
                      </Tooltip>
                  ) : (
                      <Badge variant="light" color={approvalStatusColors[project.approvalStatus] ?? 'gray'} mb="md">{project.approvalStatus}</Badge>
                  )}
                  <Text lts="2px" c="dimmed" mb="md">
                      {project.collabName.toUpperCase()} COLLABORATIVE
                  </Text>
              </Group>

              {/* Center status badge on small screens */}
              {project.approvalStatus === 'Active' ? (
                <Center>
                  <Badge hiddenFrom="md" variant="light" color="yellow">{project.approvalStatus}</Badge>
                </Center>
              ) : project.approvalStatus === 'Draft' ? (
                <Tooltip
                  color="gray"
                  label="Pending submission of a completed proposal by the assigned Project Admin"
                  multiline
                  w={220}
                >
                  <Center>
                    <Badge hiddenFrom="md" variant="light" color="pink">{project.approvalStatus}</Badge>
                  </Center>
                </Tooltip>
              ) : (
                <Center>
                  <Badge hiddenFrom="md" variant="light" color="pink">{project.approvalStatus}</Badge>
                </Center>
              )}

              <Grid>
                <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                  <Stack>
                    <div>
                      <Text fz="sm" c="dimmed" mt="lg">
                        Description
                      </Text>
                      <Text fz="md">
                        {project.description ? project.description : 'No description available.'}
                      </Text>
                    </div>
                    <div>
                      <Text fz="sm" c="dimmed">
                        Project Admin
                      </Text>
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
                    <div>
                      <Text fz="sm" c="dimmed">
                        Created
                      </Text>
                      <Text fz="md">
                        {project.createdAt}
                      </Text>
                    </div>
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
                <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                  <Paper shadow="xs" p="lg" radius="md" bg="#fafafa" mt="lg">
                    <div>
                      <Text fz="sm" c="dimmed">
                        Milestones
                      </Text>
                      <Text fw={500 } fz="xl" mb="lg">
                        {formatAmount(project.sumMilestonesAllocatedLaunchTokens)}
                      </Text>
                    </div>
                    <div>
                      <Text fz="sm" c="dimmed">
                        Project Admin Pay
                      </Text>
                      <Text fw={500 } fz="xl">
                        {formatAmount(project.adminPay)}
                      </Text>
                      <Text fz="sm" c="teal" mb="lg">
                        Total Budget x {formatAmount((project.adminPay / project.budget) * 100)}%
                      </Text>
                    </div>
                    <div>
                      <Text fz="sm" c="dimmed">
                        Network Transaction Fees
                      </Text>
                      <Text fw={500 } fz="xl">
                        {sumNetworkTransactionFees.toFixed(2)}
                      </Text>
                      <Text fz="sm" c="teal" mb="lg">
                        (Project Admin Pay + Milestones) x {project.networkTransactionFee * 100}%
                      </Text>
                    </div>
                    <Group>
                      <div>
                        <Text fz="sm" c="dimmed">
                          Total Tokens Committed
                        </Text>
                        <Text fw={500 } fz="xl" mb="lg">
                          {formatAmount(sumNetworkTransactionFees + budgetSubtotal)}
                        </Text>
                      </div>
                      <div>
                        <Text fz="sm" c="dimmed">
                          Total Budget
                        </Text>
                        <Text fw={500 } fz="xl" mb="lg">
                          {formatAmount(project.budget)}
                        </Text>
                      </div>
                    </Group>
                    <Group mb="xs">
                      <Text size="sm" c="dimmed">Budget Utilization</Text>
                      <Text size="sm" fw={700}>{Math.round((sumNetworkTransactionFees + budgetSubtotal) / project.budget * 100)}%</Text>
                    </Group>
                    <Progress color="teal" value={(sumNetworkTransactionFees + budgetSubtotal) / project.budget * 100} size="lg" radius="xl" />
                    <Group mt="xs">
                      <Text size="sm" c="dimmed">Remaining</Text>
                      <Text size="sm" fw={700}>{Math.round(project.budget - (sumNetworkTransactionFees + budgetSubtotal))} tokens</Text>
                    </Group>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Group justify="right">
        {/* Submit for approval — visible only to project admins; approvalStatus is Draft or Declined; all users have accepted their project invites */}
        {(project.approvalStatus === 'Draft' || project.approvalStatus === 'Declined') && project.userIsProjectAdmin && project.allUsersAcceptedTheirInvites ? (
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
              <>
                {!project.allUsersAcceptedTheirInvites ? (
                  <Tooltip
                    color="gray"
                    label="All users must accept their invites before submitting for approval"
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
                    label="Project is already submitted"
                    multiline
                    w={220}
                  >
                    <Button disabled mb="sm" ml="xs">
                      Submit for Approval
                    </Button>
                  </Tooltip>
                )}
              </>
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

        {project.userIsProjectAdmin ? (
          <Button variant="default" mb="sm" ml="xs" onClick={handleEdit}>
            Edit Project Profile
          </Button>
        ) : (
          <Tooltip
            color="gray"
            label="Only project admins can edit the profile"
            multiline
            w={220}
          >
            <Button disabled mb="sm" ml="xs">
              Edit Project Profile
            </Button>
          </Tooltip>
        )}
      </Group>

      {/* Edit Project Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project Profile"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} noValidate>
          <Stack>
            <TextInput
              label="Project Name"
              value={formValues.name}
              onChange={(e) => handleFormChange('name', e.currentTarget.value)}
              error={formErrors.name}
              required
            />
            <Textarea
              label="Description"
              value={formValues.description}
              onChange={(e) => handleFormChange('description', e.currentTarget.value)}
              error={formErrors.description}
              minRows={3}
            />
            <Tooltip
              color="gray"
              label="Enter a Project Budget as a number of Launch Tokens"
              multiline
              w={220}
            >
              <NumberInput
                label="Budget"
                placeholder="Enter a Project Budget as a number of Launch Tokens"
                value={formValues.budget}
                onChange={handleBudgetChange}
                error={formErrors.budget}
                allowNegative={false}
                required
                min={0}
                max={project?.collabLaunchTokenBalance - formValues.adminPay || 0}
                suffix=" tokens"
              />
            </Tooltip>
            <Tooltip
              color="gray"
              label="The # of Tokens in the Collaborative released for use and still unassigned after this project is launched"
              multiline
              w={220}
            >
              <Text size="sm" c="dimmed" mt="xs">
                Remaining Collaborative Balance: {remainingCollaborativeBalance !== null ? `${remainingCollaborativeBalance.toLocaleString()} Tokens` : `${project?.collabLaunchTokenBalance} tokens`}
              </Text>
            </Tooltip>
            <Tooltip
              color="gray"
              label="The percent of released and unassigned Tokens in the Collaborative needed to fund this project"
              multiline
              w={220}
            >
              <Text size="sm" c="dimmed" mb="md">
                {percentOfAvailableBalance !== null ? `${percentOfAvailableBalance?.toFixed(0)}% of available balance` : '0% of available balance'}
              </Text>
            </Tooltip>
            <Tooltip
              color="gray"
              label="The percent of released and unassigned Tokens in the Collaborative needed to fund this project"
              multiline
              w={220}
            >
              <NumberInput
                label="Project Admin Pay"
                placeholder="Enter the Project Admin pay as a # of Tokens"
                value={formValues.adminPay}
                onChange={handleAdminPayChange}
                error={formErrors.adminPay}
                allowNegative={false}
                max={formValues.budget || 0}
                required
                suffix=" tokens"
                step={1}
              />
            </Tooltip>
            <Text size="sm" c="dimmed" mt="xs">
              Remaining Project Balance: {remainingProjectBalance !== null ? `${remainingProjectBalance.toLocaleString()} Tokens` : '0 tokens'}
            </Text>
            <Text size="sm" c="dimmed">
              {percentOfProjectBudget !== null ? `${percentOfProjectBudget.toFixed(0)}% of Project Budget` : '0% of Project Budget'}
            </Text>
            <Group justify="right" mt="md">
              <Button variant="outline" type="submit">Save</Button>
              <Button variant="default" type="button" onClick={() => { setIsEditModalOpen(false); setFormErrors({}); }}>
                Cancel
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

    </Container>
  );
}