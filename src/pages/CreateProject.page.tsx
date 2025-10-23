import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, TextInput, NumberInput, Select, Text, Textarea, Button, Group, Title, SimpleGrid, Tooltip } from '@mantine/core';
import { Project, CollaborativeDataWithMembers } from '../data';

export function CreateProject() {
  const navigate = useNavigate();
  const { collabId } = useParams<{ collabId: string }>();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWithMembers | null>(null);
  const [collabTokenBalance, setCollabTokenBalance] = useState<number | null>(null);
  // display helpers for Project Budget preview
  const [remainingCollaborativeBalance, setRemainingCollaborativeBalance] = useState<number | null>(null);
  const [percentOfAvailableBalance, setPercentOfAvailableBalance] = useState<number | null>(null);
  // project-level derived values
  const [remainingProjectBalance, setRemainingProjectBalance] = useState<number | null>(null);
  const [percentOfProjectBudget, setPercentOfProjectBudget] = useState<number | null>(null);
  
  type ProjectFormValues = Pick<Project, 'collabId' | 'name' | 'description' | 'budget' | 'adminPay'> & {
    adminId?: string;
  };
  
  const [formValues, setFormValues] = useState<ProjectFormValues>({
    collabId: parseInt(collabId || '0', 10),
    name: '',
    description: '',
    budget: 0,
    adminPay: 0,
    adminId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCollaborativeMembers = async () => {
      try {
        const response = await fetch(
          new URL(`collaboratives/${collabId}/members`, import.meta.env.VITE_API_BASE),
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch collaborative members');
        }

        const data = await response.json();
        setCollaborative(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCollabTokenBalance = async () => {
      try {
        const response = await fetch(
          new URL(`collaboratives/${collabId}/token-balance`, import.meta.env.VITE_API_BASE),
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch collab token balance');
        }

        const data = await response.json();
        setCollabTokenBalance(data.launchTokensBalance);

      } catch (error) {
        console.error('Error fetching collab token balance:', error);
        setCollabTokenBalance(1000);
      }
    };

    fetchCollaborativeMembers();
    fetchCollabTokenBalance();
  }, [collabId]);

  const handleInputChange = (field: keyof ProjectFormValues, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Function to handle budget change with validation
  const handleBudgetChange = (value: number | string) => {

    handleInputChange('budget', value);

    setErrors(prev => {
      const next = { ...prev };
      delete next.budget;
      return next;
    });

    // Reset previews if no valid token distribution or no value
    if (!collabTokenBalance || !value || Number(value) <= 0) {
      setRemainingCollaborativeBalance(null);
      setPercentOfAvailableBalance(null);
      setRemainingProjectBalance(null);
      setPercentOfProjectBudget(null);
      return;
    }
    
    // Validate if value is provided and token distribution is available
    if (value && Number(value) > 0 && collabTokenBalance) {

      const projectBudgetTokens = Number(value);
      const remaining = collabTokenBalance - projectBudgetTokens;
      const percentOfAvailable = collabTokenBalance > 0
        ? (projectBudgetTokens / collabTokenBalance) * 100
        : 0;

      const adminComp = Number(formValues.adminPay || 0);
      const remainingProject = Math.round(Math.max(0, projectBudgetTokens - adminComp));
      const percentProject = projectBudgetTokens > 0 ? (adminComp / projectBudgetTokens) * 100 : 0;

      let error: string | null = null;
      if (projectBudgetTokens < adminComp) {
        error = `This allocation (${Math.round(projectBudgetTokens).toLocaleString()} tokens) is less than the Project Admin Pay (${Math.round(adminComp).toLocaleString()} tokens)`;
      }

      setErrors(prev => {
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

    handleInputChange('adminPay', value);
    const adminCompTokens = Number(value || 0);
    const projectBudgetTokens = Number(formValues.budget || 0);

    // derive tokenAmount from current budget & collabTokenBalance (same calc as above)
    if (!collabTokenBalance || !formValues.budget || Number(formValues.budget) <= 0) {
      setRemainingProjectBalance(null);
      setPercentOfProjectBudget(null);
      return;
    }

    setRemainingProjectBalance(Math.round(Math.max(0, projectBudgetTokens - adminCompTokens)));
    setPercentOfProjectBudget(projectBudgetTokens > 0 ? (adminCompTokens / projectBudgetTokens) * 100 : 0);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formValues.name) newErrors.name = 'Project name is required.';
    if (!formValues.description) newErrors.description = 'Project description is required.';
    if (!formValues.adminId) newErrors.adminId = 'Project admin is required.';
    if (formValues.budget <= 0) newErrors.budget = 'Project budget must be greater than 0.';
    if (Number(formValues.adminPay) >= Number(formValues.budget)) newErrors.adminPay = 'Project admin pay must be less than the project budget.';

    // Validate launch token allocation
    if (collabTokenBalance && formValues.budget > 0) {
      if (Number(formValues.budget) > collabTokenBalance) {
        newErrors.budget = `This allocation (${Number(formValues.budget).toFixed(0)} tokens) exceeds available balance (${collabTokenBalance} tokens)`;
      }
    }

    setErrors(newErrors);
    console.log(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formValues);

      try {
        const response = await fetch(
          new URL("projects", import.meta.env.VITE_API_BASE),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',   
            body: JSON.stringify(formValues)
          });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          
          navigate(`/collaboratives/${collabId}/projects`);
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          console.error('Failed to create project:', errorMessage);
          alert(errorMessage || 'Failed to create project. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form. Please try again.');
      }
    }
  };

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={`/collaboratives/${collabId}/projects`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>

      <Title order={2} mb="lg">
        Initiate a Project
      </Title>
      <form onSubmit={handleSubmit} noValidate>
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="lg">
          <TextInput
            label="Project Name"
            placeholder="Enter the project name"
            value={formValues.name}
            onChange={(event) => handleInputChange('name', event.currentTarget.value)}
            error={errors.name}
            required
          />
          <Select
            label="Assign Project Admin"
            placeholder="Select a member"
            data={
                collaborative?.members
                  .filter(member => member.inviteStatus === 'Accepted')
                  .map((member) => ({
                    value: member.id,
                    label: `${member.firstName} ${member.lastName}`,
                }))
            }
            value={formValues.adminId || ''}
            onChange={(value) => handleInputChange('adminId', value)}
            error={errors.adminId}
            required
            />
        </SimpleGrid>

        <Textarea
          label="Description"
          placeholder="Provide a brief description of the project"
          value={formValues.description}
          onChange={(event) => handleInputChange('description', event.currentTarget.value)}
          error={errors.description}
          required
          mt="md"
        />

        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="lg" mt="lg">
          <div>
            <Tooltip
              color="gray"
              label="Enter a Project Budget as a number of Launch Tokens"
              multiline
              w={220}
            >
            <NumberInput
              label="Project Budget"
              placeholder="Enter a Project Budget as a number of Launch Tokens"
              value={formValues.budget}
              onChange={handleBudgetChange}
              error={errors.budget}
              allowNegative={false}
              required
              min={0}
              max={collabTokenBalance ? collabTokenBalance - formValues.adminPay : undefined}
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
                Remaining Collaborative Balance: {remainingCollaborativeBalance !== null ? `${remainingCollaborativeBalance.toLocaleString()} Tokens` : `${collabTokenBalance} tokens`}
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
          </div>
          <div>
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
                error={errors.adminPay}
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
          </div>
        </SimpleGrid>

        <Group justify="flex-end" mt="xl">
          <Button 
            variant="default" 
            type="submit"
          >
            Launch Project
          </Button>
        </Group>
      </form>
    </Container>
  );
}