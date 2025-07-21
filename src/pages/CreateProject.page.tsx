import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Text, TextInput, NumberInput, Select, Textarea, Button, Group, Title, SimpleGrid } from '@mantine/core';
import { Project, CollaborativeDataWithMembers } from '../data';

export function CreateProject() {
  const { collabId } = useParams<{ collabId: string }>();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWithMembers | null>(null);
  const [tokenData, setTokenData] = useState<{
    launchTokensCreated: number;
    launchTokensBalance: number;
} | null>(null);

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

  fetchCollaborativeMembers();
  }, [collabId]);

  useEffect(() => {
    const fetchTokenData = async () => {
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
          throw new Error('Failed to fetch token data');
        }

        const data = await response.json();
        setTokenData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTokenData();
  }, [collabId]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProjectFormValues, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formValues.name) newErrors.name = 'Project name is required.';
    if (!formValues.description) newErrors.description = 'Description is required.';
    if (formValues.launchTokenBudget <= 0) newErrors.launchTokenBudget = 'Launch token budget must be greater than 0.';
    if (formValues.projectAdminCompensation < 0 || formValues.projectAdminCompensation > 100) {
      newErrors.projectAdminCompensation = 'Admin compensation must be between 0 and 100.';
    }

    setErrors(newErrors);

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
          const data = await response.json(); // Parse the JSON response
          console.log(data.message); // Log the message from the backend
          alert(data.message); // Optionally display the message to the user
        } else {
          console.error('Failed to create collaborative:', response.statusText);
          alert('Failed to create collaborative. Please try again.');
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
                value: member.id, // Save the member ID
                label: `${member.firstName} ${member.lastName}`, // Display full name
                }))
            }
            value={formValues.projectAdminId || ''} // Bind to form state
            onChange={(value) => handleInputChange('projectAdminId', value)} // Update form state
            error={errors.projectAdminId} // Display validation error if any
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
          <TextInput
            label="Launch Tokens Created"
            placeholder="Enter the number of launch tokens created"
            value={tokenData?.launchTokensCreated || ''}
            readOnly
          />
          <TextInput
            label="Launch Tokens Balance"
            placeholder="Enter the launch tokens balance"
            value={tokenData?.launchTokensBalance || ''}
            readOnly
          />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="lg" mt="lg">
          <NumberInput
            label="Launch Token Budget (%)"
            placeholder="Enter the token budget for the project"
            value={formValues.launchTokenBudget}
            onChange={(value) => handleInputChange('launchTokenBudget', value)}
            error={errors.launchTokenBudget}
            required
            min={0}
            max={100}
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
          <Button variant="default" type="submit">Create Project</Button>
        </Group>
      </form>
    </Container>
  );
}