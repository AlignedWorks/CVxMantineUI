import { useState, useEffect } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Button,
  Group,
  Center,
  Tooltip,
  Text,
} from '@mantine/core';
import {
  Collaborative,
  PayoutFrequency,
  monthlyStakingTiers,
  quarterlyStakingTiers,
  annualStakingTiers,
} from '../data.ts';

export function CreateCollaborative() {
    const [skills, setSkills] = useState([]); // State for skills
    const [experience, setExperience] = useState([]); // State for experience
    const [selectedTiers, setSelectedTiers] = useState<{ tier: string; exchangeRate: number }[]>([]);

    const fetchSkillsAndExperience = async () => {
        fetch('https://cvx.jordonbyers.com/skillsExperience', {
                credentials: "include",
            })
            .then((res) => res.json())
            .then((data) => {
                setSkills(data.skills); // Assuming the JSON has a `skills` key
                setExperience(data.experience); // Assuming the JSON has an `experience` key
            })
            .catch((err) => console.error("Error fetching profile:", err));
        };

    // Fetch skills and experience from the backend
    useEffect(() => {
        fetchSkillsAndExperience();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const handleTierChange = (tiers: string[]) => {
        // Add new tiers with a default exchange rate of 1.0
        const updatedTiers = tiers.map((tier) => {
        const existingTier = selectedTiers.find((t) => t.tier === tier);
        return existingTier || { tier, exchangeRate: 1.0 };
        });

        const filteredTiers = updatedTiers.filter((t) => tiers.includes(t.tier));

        setSelectedTiers(filteredTiers);

        // Update formValues using setFormValues
        setFormValues((current) => ({
            ...current,
            stakingTiers: filteredTiers,
        }));

    };

    const handleExchangeRateChange = (tier: string, rate: number) => {
        const updatedTiers = selectedTiers.map((t) =>
            t.tier === tier ? { ...t, exchangeRate: rate } : t
          );
        
          setSelectedTiers(updatedTiers);
        
          // Update formValues using setFormValues
          setFormValues((current) => ({
            ...current,
            stakingTiers: updatedTiers,
          }));
    };

  const [formValues, setFormValues] = useState<Collaborative>({
    name: '',
    description: '',
    revenueShare: 0,
    indirectCosts: 0,
    collabLeaderCompensation: 0,
    payoutFrequency: PayoutFrequency.Monthly,
    stakingTiers: [],
    skills: [],
    experience: [],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    revenueShare?: string;
    indirectCosts?: string;
    collabLeaderCompensation?: string;
    payoutFrequency?: string;
    stakingTiers?: string;
    exchangeRate?: { [tier: string]: string };
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
    if (field === 'revenueShare') {
      setErrors((currentErrors) => ({ ...currentErrors, revenueShare: undefined }));
    } else if (field === 'description') {
      setErrors((currentErrors) => ({ ...currentErrors, description: undefined }));
    } else if (field === 'name') {
      setErrors((currentErrors) => ({ ...currentErrors, name: undefined }));
    } else if (field === 'indirectCosts') {
      setErrors((currentErrors) => ({ ...currentErrors, indirectCosts: undefined }));
    } else if (field === 'collabLeaderCompensation') {
      setErrors((currentErrors) => ({ ...currentErrors, collabLeaderCompensation: undefined }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: {
        name?: string;
        description?: string;
        revenueShare?: string;
        indirectCosts?: string,
        collabLeaderCompensation?: string;
        payoutFrequency?: string;
        stakingTiers?: string;
        exchangeRate?: { [tier: string]: string };
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

    // Validate revenueShare
    if (formValues.revenueShare === undefined || formValues.revenueShare === null || isNaN(formValues.revenueShare)) {
        newErrors.revenueShare = 'Revenue Share is required.';
    } else if (formValues.revenueShare < 0.25 || formValues.revenueShare > 100) {
        newErrors.revenueShare = 'Revenue Share must be between 0 and 100.';
    }

    // Validate indirectCosts
    if (!formValues.indirectCosts) {
        newErrors.indirectCosts = 'An Indirect Costs Target is required.';
    } else if (formValues.indirectCosts < 0.25 || formValues.indirectCosts > 100) {
        newErrors.indirectCosts = 'Revenue Share must be between 0 and 100.';
    }

    // Validate collabLeaderCompensation
    if (!formValues.collabLeaderCompensation) {
        newErrors.collabLeaderCompensation = 'Collaborarative Leader Compensation is required.';
    } else if (formValues.collabLeaderCompensation < 0.25 || formValues.collabLeaderCompensation > 100) {
        newErrors.collabLeaderCompensation = 'Revenue Share must be between 0 and 100.';
    }

    // Validate payoutFrequency
    if (!formValues.payoutFrequency) {
        newErrors.payoutFrequency = 'Payout Frequency is required.';
    }

    // Validate stakingTiers
    if (formValues.stakingTiers.length === 0) {
        newErrors.stakingTiers = 'At least one staking tier must be selected.';
    }

    // Validate exchangeRate for each selected tier
    const exchangeRateErrors: { [tier: string]: string } = {};
    selectedTiers.forEach((tier) => {
        if (tier.exchangeRate === undefined || tier.exchangeRate === null || isNaN(tier.exchangeRate)) {
        exchangeRateErrors[tier.tier] = 'Exchange rate is required.';
        } else if (tier.exchangeRate <= 0 || tier.exchangeRate > 100) {
        exchangeRateErrors[tier.tier] = 'Exchange rate must be between 0 and 100.';
        }
    });

    if (Object.keys(exchangeRateErrors).length > 0) {
        newErrors.exchangeRate = exchangeRateErrors;
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

  const revenueShare = (
    <Tooltip
      label="Set the % of Collab-wide revenue to be allocated to the Pool."
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle size={18} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  const indirectCosts = (
    <Tooltip
      label="Set the Target % of Collab-wide revenue set aside to cover Indirect costs."
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle size={18} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  const collabLeaderComp = (
    <Tooltip
      label="Set compensation for the Collab Leader as a % of revenue OR USD/month."
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle size={18} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  const exchangeRate = (
    <Tooltip
      label="This number should be somewhere between 0 and 100."
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle size={18} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

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
            rightSection={revenueShare}
            label="Revenue Share %"
            placeholder="Enter the revenue share % (e.g. 5.5, 7.75, 10)"
            type="number"
            value={formValues.revenueShare}
            onChange={(event) =>
                handleInputChange('revenueShare', parseFloat(event.currentTarget.value))
            }
            error={errors.revenueShare} // Display validation error
            required
            mb="md"
        />

        <TextInput
            rightSection={indirectCosts}
            label="Indirect Costs Target %"
            placeholder="Enter the indirect costs target % (e.g. 5.5, 7.75, 10)"
            type="number"
            value={formValues.indirectCosts}
            onChange={(event) =>
                handleInputChange('indirectCosts', parseFloat(event.currentTarget.value))
            }
            error={errors.indirectCosts} // Display validation error
            required
            mb="md"
        />

        <TextInput
            rightSection={collabLeaderComp}
            label="Collaborative Leader Compensation %"
            placeholder="Enter the collaborative leader compensation % (e.g. 5.5, 7.75, 10)"
            type="number"
            value={formValues.collabLeaderCompensation}
            onChange={(event) =>
                handleInputChange('collabLeaderCompensation', parseFloat(event.currentTarget.value))
            }
            error={errors.collabLeaderCompensation} // Display validation error
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
            value={selectedTiers.map((t) => t.tier)}
            onChange={handleTierChange}
            error={errors.stakingTiers} // Display validation error
            searchable
            clearable
            required
            mb="md"
        />

        {selectedTiers.map((tier) => (
            <TextInput
                rightSection={exchangeRate}
                key={tier.tier}
                label={`Exchange Rate for ${tier.tier}`}
                placeholder="Enter exchange rate"
                type="number"
                value={tier.exchangeRate}
                onChange={(event) =>
                    handleExchangeRateChange(tier.tier, parseFloat(event.currentTarget.value))
                }
                error={errors.exchangeRate?.[tier.tier]} // Display validation error
                required
                mb="md"
            />
        ))}

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