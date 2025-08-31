import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, TextInput, NumberInput, Select, Text, Textarea, Button, Group, Title, SimpleGrid } from '@mantine/core';
import { Project, CollaborativeDataWithMembers } from '../data';

// Add interface for token distribution data
interface TokenDistribution {
  currentTokenRelease: number;
  launchTokensBalance: number;
}

export function CreateProject() {
  const navigate = useNavigate();
  const { collabId } = useParams<{ collabId: string }>();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWithMembers | null>(null);
  const [tokenDistribution, setTokenDistribution] = useState<TokenDistribution | null>(null);
  // display helpers for Project Budget preview
  const [remainingCollaborativeBalance, setRemainingCollaborativeBalance] = useState<number | null>(null);
  const [percentOfAvailableBalance, setPercentOfAvailableBalance] = useState<number | null>(null);
  // project-level derived values
  const [remainingProjectBalance, setRemainingProjectBalance] = useState<number | null>(null);
  const [percentOfProjectBudget, setPercentOfProjectBudget] = useState<number | null>(null);
  
  type ProjectFormValues = Pick<Project, 'collabId' | 'name' | 'description' | 'launchTokenBudget' | 'projectAdminCompensation'> & {
    projectAdminId?: string;
  };
  
  const [formValues, setFormValues] = useState<ProjectFormValues>({
    collabId: parseInt(collabId || '0', 10),
    name: '',
    description: '',
    launchTokenBudget: 0,
    projectAdminCompensation: 0,
    projectAdminId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [launchTokenError, setLaunchTokenError] = useState<string | null>(null);

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

    const fetchTokenDistribution = async () => {
      try {
        const response = await fetch(
          new URL(`collaboratives/${collabId}/token-distribution`, import.meta.env.VITE_API_BASE),
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch token distribution');
        }

        const data: TokenDistribution = await response.json();
        setTokenDistribution(data);
      } catch (error) {
        console.error('Error fetching token distribution:', error);
      }
    };

    fetchCollaborativeMembers();
    fetchTokenDistribution();
  }, [collabId]);

  const handleInputChange = (field: keyof ProjectFormValues, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // Function to handle launch token budget change with validation
  const handleLaunchTokenBudgetChange = (value: number | string) => {
    handleInputChange('launchTokenBudget', value);
    
    // Clear error when user changes value
    if (launchTokenError) {
      setLaunchTokenError(null);
    }
    
    // Reset previews if no valid token distribution or no value
    if (!tokenDistribution || !value || Number(value) <= 0) {
      setRemainingCollaborativeBalance(null);
      setPercentOfAvailableBalance(null);
      setRemainingProjectBalance(null);
      setPercentOfProjectBudget(null);
      return;
    }
    
    // Validate if value is provided and token distribution is available
    if (value && Number(value) > 0 && tokenDistribution) {
      const projectPercent = Number(value);
      const tokenAmount = (projectPercent / 100) * tokenDistribution.currentTokenRelease;
      if (tokenAmount > tokenDistribution.launchTokensBalance) {
        setLaunchTokenError(`This allocation (${Math.round(tokenAmount).toLocaleString()} tokens) exceeds available balance (${Math.round(tokenDistribution.launchTokensBalance).toLocaleString()} tokens)`);
        // still update previews to show negative/zero remaining if desired
        setRemainingCollaborativeBalance(Math.round(tokenDistribution.launchTokensBalance - tokenAmount));
        setPercentOfAvailableBalance(tokenDistribution.launchTokensBalance > 0 ? (tokenAmount / tokenDistribution.launchTokensBalance) * 100 : 0);
        // update project-level previews using current admin compensation value
        const adminComp = Number(formValues.projectAdminCompensation || 0);
        setRemainingProjectBalance(Math.round(Math.max(0, tokenAmount - adminComp)));
        setPercentOfProjectBudget(tokenAmount > 0 ? (adminComp / tokenAmount) * 100 : 0);
        return;
      }
      // compute and store preview values
      const remaining = tokenDistribution.launchTokensBalance - tokenAmount;
      const percentOfAvailable = tokenDistribution.launchTokensBalance > 0
        ? (tokenAmount / tokenDistribution.launchTokensBalance) * 100
        : 0;
      setRemainingCollaborativeBalance(Math.round(remaining));
      setPercentOfAvailableBalance(percentOfAvailable);
      // update project-level previews using current admin compensation value
      const adminComp = Number(formValues.projectAdminCompensation || 0);
      setRemainingProjectBalance(Math.round(Math.max(0, tokenAmount - adminComp)));
      setPercentOfProjectBudget(tokenAmount > 0 ? (adminComp / tokenAmount) * 100 : 0);
    }
  };

  // When admin compensation changes, recompute project-level previews
  const handleProjectAdminCompChange = (value: number | string) => {
    handleInputChange('projectAdminCompensation', value);
    const adminComp = Number(value || 0);

    // derive tokenAmount from current launchTokenBudget & tokenDistribution (same calc as above)
    if (!tokenDistribution || !formValues.launchTokenBudget || Number(formValues.launchTokenBudget) <= 0) {
      setRemainingProjectBalance(null);
      setPercentOfProjectBudget(null);
      return;
    }

    const tokenAmount = (Number(formValues.launchTokenBudget) / 100) * tokenDistribution.currentTokenRelease;
    setRemainingProjectBalance(Math.round(Math.max(0, tokenAmount - adminComp)));
    setPercentOfProjectBudget(tokenAmount > 0 ? (adminComp / tokenAmount) * 100 : 0);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formValues.name) newErrors.name = 'Project name is required.';
    if (!formValues.description) newErrors.description = 'Description is required.';
    if (!formValues.projectAdminId) newErrors.projectAdminId = 'Project Admin is required.';
    if (formValues.launchTokenBudget <= 0) newErrors.launchTokenBudget = 'Launch token budget must be greater than 0.';
    if (formValues.projectAdminCompensation < 0 || formValues.projectAdminCompensation > 100) {
      newErrors.projectAdminCompensation = 'Admin compensation must be between 0 and 100.';
    }

    // Validate launch token allocation
    if (tokenDistribution && formValues.launchTokenBudget > 0) {
      const tokenAmount = (Number(formValues.launchTokenBudget) / 100) * tokenDistribution.currentTokenRelease;
      if (tokenAmount > tokenDistribution.launchTokensBalance) {
        setLaunchTokenError(`This allocation (${tokenAmount.toFixed(0)} tokens) exceeds available balance (${tokenDistribution.launchTokensBalance} tokens)`);
        return;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && !launchTokenError) {
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

  // Check if form is valid
  const isFormValid = formValues.name && 
                     formValues.description && 
                     formValues.projectAdminId &&
                     formValues.launchTokenBudget > 0 &&
                     formValues.projectAdminCompensation >= 0 &&
                     formValues.projectAdminCompensation <= 100 &&
                     !launchTokenError;

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={`/collaboratives/${collabId}/projects`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>

      <Title order={2} mb="lg">
        Propose a Project
      </Title>
      <form onSubmit={handleSubmit}>
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
            value={formValues.projectAdminId || ''}
            onChange={(value) => handleInputChange('projectAdminId', value)}
            error={errors.projectAdminId}
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
            <NumberInput
              label="Project Budget"
              placeholder="Enter a Project Budget as a number of Launch Tokens"
              value={formValues.launchTokenBudget}
              onChange={handleLaunchTokenBudgetChange}
              error={launchTokenError || errors.launchTokenBudget}
              required
              min={0}

            />
            <Text size="sm" c="dimmed">
              Remaining Collaborative Balance: {remainingCollaborativeBalance !== null ? `${remainingCollaborativeBalance.toLocaleString()} Tokens` : '—'}
            </Text>
            <Text size="sm" c="dimmed" mb="md">
              {percentOfAvailableBalance !== null ? `${percentOfAvailableBalance.toFixed(0)}% of available balance` : '—'}
            </Text>
          </div>
          <div>
          <NumberInput
            label="Project Admin Pay"
            placeholder="Enter the Project Admin compensation as a # of Tokens"
            value={formValues.projectAdminCompensation}
            onChange={handleProjectAdminCompChange}
            error={errors.projectAdminCompensation}
            required
            step={1}
          />
          <Text size="sm" c="dimmed">
              Remaining Project Balance: {remainingProjectBalance !== null ? `${remainingProjectBalance.toLocaleString()} Tokens` : '—'}
            </Text>
            <Text size="sm" c="dimmed">
              {percentOfProjectBudget !== null ? `${percentOfProjectBudget.toFixed(0)}% of Project Budget` : '—'}
            </Text>
          </div>
        </SimpleGrid>

        <Group justify="flex-end" mt="xl">
          <Button 
            variant="default" 
            type="submit"
            disabled={!isFormValid}
          >
            Submit Project Proposal
          </Button>
        </Group>
      </form>
    </Container>
  );
}