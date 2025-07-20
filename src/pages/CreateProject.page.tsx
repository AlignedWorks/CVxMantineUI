import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextInput, NumberInput, Select, Textarea, Button, Group, Title, SimpleGrid } from '@mantine/core';
import { Project, CollaborativeDataWithMembers } from '../data';

export function CreateProject() {
  const { collabId } = useParams<{ collabId: string }>();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWithMembers | null>(null);

  type ProjectFormValues = Pick<Project, 'collabId' | 'name' | 'description' | 'launchTokenBudget' | 'projectAdminCompensation'> & {
    projectAdminId?: string; // Optional field for project admin ID
  };
  const [formValues, setFormValues] = useState<ProjectFormValues>({
    collabId: parseInt(collabId || '0', 10), // Link to a collaborative
    name: '',
    description: '',
    launchTokenBudget: 0,
    projectAdminCompensation: 0,
    projectAdminId: '', // Optional field for project admin ID
  });

  useEffect(() => {
      fetch(
        new URL(`collaboratives/${collabId}/members`, import.meta.env.VITE_API_BASE),
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
        .then((data: CollaborativeDataWithMembers) => {
          console.log(data);
          setCollaborative(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [collabId]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProjectFormValues, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
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
      // Add logic to save the project (e.g., API call)
    }
  };

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        Create a New Project
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

        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="lg" mt="lg">
          <NumberInput
            label="Launch Token Budget"
            placeholder="Enter the token budget for the project"
            value={formValues.launchTokenBudget}
            onChange={(value) => handleInputChange('launchTokenBudget', value)}
            error={errors.launchTokenBudget}
            required
            min={0}
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
          <Button type="submit">Create Project</Button>
        </Group>
      </form>
    </Container>
  );
}