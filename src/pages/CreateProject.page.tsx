import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Text, TextInput, NumberInput, Select, Textarea, Button, Group, Title, SimpleGrid } from '@mantine/core';
import { Project, CollaborativeDataWithMembers } from '../data';

// Add interface for token distribution data
interface TokenDistribution {
  launchTokensCreated: number;
  launchTokensBalance: number;
}

export function CreateProject() {
  const { collabId } = useParams<{ collabId: string }>();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWithMembers | null>(null);
  const [tokenDistribution, setTokenDistribution] = useState<TokenDistribution | null>(null);

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
    
    // Validate if value is provided and token distribution is available
    if (value && Number(value) > 0 && tokenDistribution) {
      const tokenAmount = (Number(value) / 100) * tokenDistribution.launchTokensCreated;
      if (tokenAmount > tokenDistribution.launchTokensBalance) {
        setLaunchTokenError(`This allocation (${tokenAmount.toFixed(0)} tokens) exceeds available balance (${tokenDistribution.launchTokensBalance} tokens)`);
      }
    }
  };

  // Calculate maximum percentage allowed
  const maxPercentage = tokenDistribution && tokenDistribution.launchTokensCreated > 0 
    ? Math.floor((tokenDistribution.launchTokensBalance / tokenDistribution.launchTokensCreated) * 100)
    : 100;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formValues.name) newErrors.name = 'Project name is required.';
    if (!formValues.description) newErrors.description = 'Description is required.';
    if (formValues.launchTokenBudget <= 0) newErrors.launchTokenBudget = 'Launch token budget must be greater than 0.';
    if (formValues.projectAdminCompensation < 0 || formValues.projectAdminCompensation > 100) {
      newErrors.projectAdminCompensation = 'Admin compensation must be between 0 and 100.';
    }

    // Validate launch token allocation
    if (tokenDistribution && formValues.launchTokenBudget > 0) {
      const tokenAmount = (Number(formValues.launchTokenBudget) / 100) * tokenDistribution.launchTokensCreated;
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
          alert(data.message);
        } else {
          console.error('Failed to create project:', response.statusText);
          alert('Failed to create project. Please try again.');
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
        Create a Project
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
                collaborative?.members.map((member) => ({
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

        <Group>
          <Text>Launch Tokens</Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="lg" mt="lg">
          <NumberInput
            label="Launch Token Budget (%)"
            placeholder="Enter the token budget for the project"
            value={formValues.launchTokenBudget}
            onChange={handleLaunchTokenBudgetChange}
            error={launchTokenError || errors.launchTokenBudget}
            required
            min={0}
            max={maxPercentage}
            description={tokenDistribution ? `Available balance: ${tokenDistribution.launchTokensBalance} tokens (${maxPercentage}% of total)` : 'Loading token data...'}
          />
          <NumberInput
            label="Admin Compensation (%)"
            placeholder="Enter the admin compensation percentage"
            value={formValues.projectAdminCompensation}
            onChange={(value) => handleInputChange('projectAdminCompensation', value)}
            error={errors.projectAdminCompensation}
            required
            min={0}
            max={100}
            step={1}
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="xl">
          <Button 
            variant="default" 
            type="submit"
            disabled={!isFormValid}
          >
            Create Project
          </Button>
        </Group>
      </form>
    </Container>
  );
}