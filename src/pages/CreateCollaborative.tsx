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
    payoutFrequency: PayoutFrequency.Monthly,
    percentRevenueShare: 0,
    stakingTiers: [],
    skills: [],
    experience: [],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    percentRevenueShare?: string;
    payoutFrequency?: string;
    stakingTiers?: string;
    skills?: string;
    experience?: string;
  }>({});

  const handleInputChange = (field: keyof Collaborative, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
      ...(field === 'payoutFrequency' && { stakingTiers: [] }), // Reset stakingTiers if payoutFrequency changes
    }));

    // Clear errors when the user starts typing
    if (field === 'percentRevenueShare') {
      setErrors((currentErrors) => ({ ...currentErrors, percentRevenueShare: undefined }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: {
        name?: string;
        description?: string;
        percentRevenueShare?: string;
        payoutFrequency?: string;
        stakingTiers?: string;
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

    // Validate percentRevenueShare
    if (formValues.percentRevenueShare === undefined || formValues.percentRevenueShare === null || isNaN(formValues.percentRevenueShare)) {
        newErrors.percentRevenueShare = 'Percent Revenue Share is required.';
    } else if (formValues.percentRevenueShare < 0.25 || formValues.percentRevenueShare > 100) {
        newErrors.percentRevenueShare = 'Percent Revenue Share must be between 0 and 100.';
    }

    // Validate payoutFrequency
    if (!formValues.payoutFrequency) {
        newErrors.payoutFrequency = 'Payout Frequency is required.';
    }

    // Validate stakingTiers
    if (formValues.stakingTiers.length === 0) {
        newErrors.stakingTiers = 'At least one staking tier must be selected.';
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
        value={formValues.percentRevenueShare}
        onChange={(event) =>
            handleInputChange('percentRevenueShare', parseFloat(event.currentTarget.value))
        }
        error={errors.percentRevenueShare} // Display validation error
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
        value={formValues.payoutFrequency}
        onChange={(value) => handleInputChange('payoutFrequency', value as PayoutFrequency)}
        error={errors.payoutFrequency} // Display validation error
        required
        mb="md"
        />

        <MultiSelect
        label="Staking Tiers"
        placeholder="Select staking tiers"
        data={
            formValues.payoutFrequency === PayoutFrequency.Monthly
            ? monthlyStakingTiers
            : formValues.payoutFrequency === PayoutFrequency.Quarterly
            ? quarterlyStakingTiers
            : annualStakingTiers
        }
        value={formValues.stakingTiers}
        onChange={(value) => handleInputChange('stakingTiers', value)}
        error={errors.stakingTiers} // Display validation error
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
        <Button onClick={handleSubmit}>Propose Collaborative</Button>
      </Group>
    </Container>
  );
}