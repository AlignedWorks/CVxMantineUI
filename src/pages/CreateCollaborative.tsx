import { useState } from 'react';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Button,
  Group,
} from '@mantine/core';
import {
  Collaborative,
  PayoutFrequency,
  monthlyStakingTiers,
  quarterlyStakingTiers,
  annualStakingTiers,
  skills,
  experience,
} from '../data.ts';

export function CreateCollaborative() {
  const [formValues, setFormValues] = useState<Collaborative>({
    name: '',
    description: '',
    payout_frequency: PayoutFrequency.Monthly,
    percent_revenue_share: 0,
    staking_tiers: [],
    skills: [],
    experience: [],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    percent_revenue_share?: string;
    payout_frequency?: string;
    staking_tiers?: string;
    skills?: string;
    experience?: string;
  }>({});

  const handleInputChange = (field: keyof Collaborative, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
      ...(field === 'payout_frequency' && { staking_tiers: [] }), // Reset staking_tiers if payout_frequency changes
    }));

    // Clear errors when the user starts typing
    if (field === 'percent_revenue_share') {
      setErrors((currentErrors) => ({ ...currentErrors, percent_revenue_share: undefined }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: {
        name?: string;
        description?: string;
        percent_revenue_share?: string;
        payout_frequency?: string;
        staking_tiers?: string;
        skills?: string;
        experience?: string;
      } = {};

    // Validate name
    if (!formValues.name.trim()) {
        newErrors.name = 'Name is required.';
    }

    // Validate description
    if (!formValues.description.trim()) {
        newErrors.description = 'Description is required.';
    }

    // Validate percent_revenue_share
    if (formValues.percent_revenue_share === undefined || formValues.percent_revenue_share === null || isNaN(formValues.percent_revenue_share)) {
        newErrors.percent_revenue_share = 'Percent Revenue Share is required.';
    } else if (formValues.percent_revenue_share < 0.25 || formValues.percent_revenue_share > 100) {
        newErrors.percent_revenue_share = 'Percent Revenue Share must be between 0 and 100.';
    }

    // Validate payout_frequency
    if (!formValues.payout_frequency) {
        newErrors.payout_frequency = 'Payout Frequency is required.';
    }

    // Validate staking_tiers
    if (formValues.staking_tiers.length === 0) {
        newErrors.staking_tiers = 'At least one staking tier must be selected.';
    }

    // Validate skills
    if (formValues.skills.length === 0) {
        newErrors.skills = 'At least one skill must be selected.';
    }

    // Validate experience
    if (formValues.experience.length === 0) {
        newErrors.experience = 'At least one experience must be selected.';
    }

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formValues);
      
      try {
        const response = await fetch('https://cvx.jordonbyers.com/collaborative', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formValues),
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
    <Container size="lg" py="xl">
      <Title order={1} mb="md" pt="sm" pb="xl">
        Propose a Collaborative
      </Title>

      <TextInput
        label="Name"
        placeholder="Enter the collaborative name"
        value={formValues.name}
        onChange={(event) => handleInputChange('name', event.currentTarget.value)}
        error={errors.name} // Display validation error
        required
        mb="md"
        />

        <Textarea
        label="Description"
        placeholder="Enter a description for the collaborative"
        value={formValues.description}
        onChange={(event) => handleInputChange('description', event.currentTarget.value)}
        error={errors.description} // Display validation error
        required
        mb="md"
        />

        <TextInput
        label="Percent Revenue Share"
        placeholder="Enter the revenue share percentage (e.g. 5.5, 7.75, 10)"
        type="number"
        value={formValues.percent_revenue_share}
        onChange={(event) =>
            handleInputChange('percent_revenue_share', parseFloat(event.currentTarget.value))
        }
        error={errors.percent_revenue_share} // Display validation error
        required
        mb="md"
        />

        <Select
        label="Payout Frequency"
        placeholder="Select payout frequency"
        data={[
            { value: PayoutFrequency.Monthly, label: 'Monthly' },
            { value: PayoutFrequency.Quarterly, label: 'Quarterly' },
            { value: PayoutFrequency.Yearly, label: 'Yearly' },
        ]}
        value={formValues.payout_frequency}
        onChange={(value) => handleInputChange('payout_frequency', value as PayoutFrequency)}
        error={errors.payout_frequency} // Display validation error
        required
        mb="md"
        />

        <MultiSelect
        label="Staking Tiers"
        placeholder="Select staking tiers"
        data={
            formValues.payout_frequency === PayoutFrequency.Monthly
            ? monthlyStakingTiers
            : formValues.payout_frequency === PayoutFrequency.Quarterly
            ? quarterlyStakingTiers
            : annualStakingTiers
        }
        value={formValues.staking_tiers}
        onChange={(value) => handleInputChange('staking_tiers', value)}
        error={errors.staking_tiers} // Display validation error
        searchable
        clearable
        required
        mb="md"
        />

        <MultiSelect
        label="Skills"
        placeholder="Select required skills"
        data={skills}
        value={formValues.skills}
        onChange={(value) => handleInputChange('skills', value)}
        error={errors.skills} // Display validation error
        searchable
        clearable
        required
        mb="md"
        />

        <MultiSelect
        label="Experience"
        placeholder="Select required experience"
        data={experience}
        value={formValues.experience}
        onChange={(value) => handleInputChange('experience', value)}
        error={errors.experience} // Display validation error
        searchable
        clearable
        required
        mb="md"
        />

      <Group mt="xl">
        <Button onClick={handleSubmit}>Create Collaborative</Button>
      </Group>
    </Container>
  );
}