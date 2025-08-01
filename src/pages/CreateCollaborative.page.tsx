import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { IconInfoCircle } from '@tabler/icons-react';
import { ImageField } from '../ImageField.tsx';
import { Link } from 'react-router-dom';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  Button,
  Group,
  Center,
  Tooltip,
  Text,
  SimpleGrid,
  Grid,
} from '@mantine/core';
import {
  Collaborative,
  PayoutFrequency,
  monthlyStakingTiers,
  quarterlyStakingTiers,
  annualStakingTiers,
  us_states,
} from '../data.ts';

export function CreateCollaborative() {
    const [skills, setSkills] = useState<{ id: number; value: string }[]>([]); // State for skills
    const [experience, setExperience] = useState<{ id: number; value: string }[]>([]); // State for experience
    const [selectedTiers, setSelectedTiers] = useState<{ tier: string; exchangeRate: number }[]>([]);
    const { user } = useAuth();

    useEffect(() => {
      if (!user) {
        // Clear the form when the user logs out
        setFormValues({
          name: '',
          description: '',
          websiteUrl: '',
          city: '',
          state: '',
          skills: [],
          experience: [],
          revenueShare: 0,
          indirectCosts: 0,
          collabLeaderCompensation: 0,
          payoutFrequency: PayoutFrequency.Monthly,
          stakingTiers: [],
          logoUrl: '',
          launchTokensCreated: 10000,
          launchCyclePeriod: 12,
          launchTokenReleaseRate: 10,
          launchTokenInitialReleaseWeeks: 0,
        });
        setErrors({});
        setSelectedTiers([]);
      }
    }, [user]);

    const fetchSkillsAndExperience = async () => {
        fetch(
          new URL("skills-and-experience", import.meta.env.VITE_API_BASE),
        {
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
        // Add new tiers with a default exchange rate of 100 percent
        const updatedTiers = tiers.map((tier) => {
        const existingTier = selectedTiers.find((t) => t.tier === tier);
        return existingTier || { tier, exchangeRate: 100 };
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
    websiteUrl: '',
    logoUrl: "/assets/logos/Default.png",
    city: '',
    state: '',
    skills: [],
    experience: [],
    revenueShare: 0,
    indirectCosts: 0,
    collabLeaderCompensation: 0,
    payoutFrequency: PayoutFrequency.Monthly,
    stakingTiers: [],
    launchTokensCreated: 10000,
    launchCyclePeriod: 12,
    launchTokenReleaseRate: 10,
    launchTokenInitialReleaseWeeks: 0,
  });

  const [errors, setErrors] = useState<{
    name?: string,
    description?: string,
    skills?: string,
    experience?: string,
    revenueShare?: string,
    indirectCosts?: string,
    collabLeaderCompensation?: string,
    payoutFrequency?: string,
    stakingTiers?: string,
    exchangeRate?: { [tier: string]: string },
    launchTokensCreated?: string,
    launchCyclePeriod?: string,
    launchTokenReleaseRate?: string,
    launchTokenInitialReleaseWeeks?: string,
  }>({});


  const handleInputChange = (field: keyof Collaborative, value: any) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
      ...(field === 'payoutFrequency' && { stakingTiers: [] }), // Reset stakingTiers if payoutFrequency changes
    }));

    // Reset selectedTiers when payoutFrequency changes
    if (field === 'payoutFrequency') {
      setSelectedTiers([]); // Clear the selectedTiers state
    }

    // Clear errors when the user starts typing
    if (field === 'revenueShare') {
      setErrors((currentErrors) => ({ ...currentErrors, revenueShare: undefined }));
    } else if (field === 'description') {
      setErrors((currentErrors) => ({ ...currentErrors, description: undefined }));
    } else if (field === 'skills') {
      setErrors((currentErrors) => ({ ...currentErrors, skills: undefined }));
    } else if (field === 'experience') {
      setErrors((currentErrors) => ({ ...currentErrors, experience: undefined }));
    } else if (field === 'stakingTiers') {
      setErrors((currentErrors) => ({ ...currentErrors, stakingTiers: undefined }));
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
        skills?: string;
        experience?: string;
        revenueShare?: string;
        indirectCosts?: string,
        collabLeaderCompensation?: string;
        payoutFrequency?: string;
        stakingTiers?: string;
        exchangeRate?: { [tier: string]: string },
        launchTokensCreated?: string;
        launchCyclePeriod?: string;
        launchTokenReleaseRate?: string;
        launchTokenInitialReleaseWeeks?: string;
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

    if (!formValues.launchTokensCreated || formValues.launchTokensCreated <= 0) {
      newErrors.launchTokensCreated = 'Launch Tokens Created must be greater than 0.';
    }
    if (!formValues.launchCyclePeriod || formValues.launchCyclePeriod <= 0) {
      newErrors.launchCyclePeriod = 'Launch Cycle Period must be greater than 0.';
    }
    if (!formValues.launchTokenReleaseRate || formValues.launchTokenReleaseRate <= 0 || formValues.launchTokenReleaseRate > 100) {
      newErrors.launchTokenReleaseRate = 'Launch Token Release Rate must be between 0 and 100.';
    }
    if (formValues.launchTokenInitialReleaseWeeks === undefined) {
      newErrors.launchTokenInitialReleaseWeeks = 'Initial Token Release Date is required.';
    }

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      const payload = {
        ...formValues,
        skills: formValues.skills.map((skill) => skill.id), // Map skills to their IDs
        experience: formValues.experience.map((exp) => exp.id), // Map experience to their IDs
      }
      console.log('Form submitted:', payload);

      try {
        const response = await fetch(
          new URL("collaboratives", import.meta.env.VITE_API_BASE),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',   
          body: JSON.stringify(payload)
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
    <Container size="md" py="xl">

      {/* Back Link */}
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>

      <Title order={1} mb="md" pt="sm" pb="lg">
          Propose a Collaborative
      </Title>

      <Title order={2} mb="md" pt="sm" pb="xl" ta="center">
          Purpose and People
      </Title>

      <SimpleGrid mt="xl" cols={{ base: 1, md: 2 }}>
        <TextInput
            label="Collaborative Name"
            placeholder="Enter your collaborative's name"
            value={formValues.name}
            onChange={(event) => handleInputChange('name', event.currentTarget.value)}
            error={errors.name} // Display validation error
            required
            mb="md"
        />
        <TextInput
            label="Collaborative Admin"
            disabled={true}
            defaultValue={user ? (user.firstName ? `${user.firstName} ${user.lastName}` : user.userName) : "No user logged in"}
            mb="md"
        />
      </SimpleGrid>

      <Textarea
          label="Description"
          placeholder="Briefly summarize the purpose and activities of your Collab"
          value={formValues.description}
          onChange={(event) => handleInputChange('description', event.currentTarget.value)}
          error={errors.description} // Display validation error
          required
          mt="md"
          mb="md"
      />

      <Grid>
        <Grid.Col span={{ base: 12, sm: 12, md: 5 }}>
          <TextInput
            label="Collaborative Website URL"
            placeholder="If your Collab has a website add its URL here"
            value={formValues.websiteUrl}
            onChange={(event) => handleInputChange('websiteUrl', event.currentTarget.value)}
            mt="md"
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 9, sm: 9, md: 5 }}>
          <TextInput
            label="City"
            placeholder="Your Collab's city"
            value={formValues.city}
            onChange={(event) => handleInputChange('city', event.currentTarget.value)}
            mt="md"
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 3, sm: 3, md: 2 }}>
          <Select
            label="State"
            data={us_states}
            value={formValues.state}
            onChange={(value) => handleInputChange('state', value)}
            searchable
            mt="md"
            mb="md"
          />
        </Grid.Col>
      </Grid>

      <SimpleGrid mt="xl" mb="xl" cols={{ base: 1, sm: 1, md: 2 }}>
        <MultiSelect
            label="Member Skills"
            placeholder="Select the needed skills"
            data={skills.map((skill) => ({ value: skill.id.toString(), label: skill.value }))}
            value={formValues.skills.map((skill) => skill.id.toString())} // Map selected skills to their IDs
            onChange={(values) =>
              handleInputChange(
                'skills',
                values.map((id) => skills.find((skill) => skill.id.toString() === id))
              )
            }
            error={errors.skills} // Display validation error
            searchable
            clearable
            required
            mb="lg"
        />

        <MultiSelect
            label="Sector Experience"
            placeholder="Select the needed experience"
            data={experience.map((exp) => ({ value: exp.id.toString(), label: exp.value }))}
            value={formValues.experience.map((exp) => exp.id.toString())} // Map selected experience to their IDs
            onChange={(values) =>
              handleInputChange(
                'experience',
                values.map((id) => experience.find((exp) => exp.id.toString() === id))
              )
            }
            error={errors.experience} // Display validation error
            searchable
            clearable
            required
            mb="lg"
        />
      </SimpleGrid>

      <ImageField 
        label="Collaborative Logo"
        initialImageUrl="/assets/logos/Default.png"
        onImageSelected={(url) => handleInputChange('logoUrl', url)}
      />

      <Title order={2} mt="xl" mb="md" pt="xl" pb="xl" ta="center">
          Revenue Sharing Pool
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <NumberInput
          rightSection={revenueShare}
          label="% of Revenue to the Collab Pool"
          placeholder="Enter the revenue share % (e.g. 5.5, 7.75, 10)"
          value={formValues.revenueShare}
          onChange={(value) =>
              handleInputChange('revenueShare', value)
          }
          error={errors.revenueShare} // Display validation error
          required
          min={0}
          max={100}
          suffix="%"
          decimalScale={2}
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
      </SimpleGrid>

      <MultiSelect
        label="SharePoint Staking Tiers"
        placeholder="Set the SharePoint Staking Tiers"
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
        mt="lg"
        mb="md"
      />
      <Group grow mt="xl" pt="sm" pb="lg" >
        {selectedTiers.map((tier) => (
          <NumberInput
            rightSection={exchangeRate}
            key={tier.tier}
            label={`${tier.tier} Staking Exchange Rate`}
            placeholder="Set the Exchange Rates for Staking SharePoints"
            value={tier.exchangeRate}
            onChange={(value) =>
              handleExchangeRateChange(tier.tier, typeof value === 'number' ? value : Number(value))
            }
            error={errors.exchangeRate?.[tier.tier]} // Display validation error
            min={0}
            max={100}
            step={1}
            suffix="%"
            allowDecimal={false}
            required
            mb="md"
          />
        ))}
      </Group>

      <Title order={2} mb="md" pt="xl" pb="xl" ta="center">
          Other Financials
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <NumberInput
            rightSection={indirectCosts}
            label="% of Revenue to cover Indirect Costs (Target)"
            placeholder="Enter the indirect costs target % (e.g. 5.5, 7.75, 10)"

            value={formValues.indirectCosts}
            onChange={(value) =>
                handleInputChange('indirectCosts', value)
            }
            error={errors.indirectCosts} // Display validation error
            required
            min={0}
            max={100}
            suffix="%"
            decimalScale={2}
            mb="md"
        />

        <NumberInput
            rightSection={collabLeaderComp}
            label="% of Revenue to Collab Leader Compensation"
            placeholder="Set compensation for the Collab Leader as a % of Collab-wide revenue."
            value={formValues.collabLeaderCompensation}
            onChange={(value) =>
                handleInputChange('collabLeaderCompensation', value)
            }
            error={errors.collabLeaderCompensation} // Display validation error
            required
            min={0}
            max={100}
            suffix="%"
            decimalScale={2}
            mb="md"
        />
      </SimpleGrid>

      <Title order={2} mt="xl" mb="md" pt="xl" pb="xl" ta="center">
        Launch Tokens
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <NumberInput
          label="Launch Tokens Created"
          placeholder="Enter the number of tokens created (default: 10,000)"
          value={formValues.launchTokensCreated}
          onChange={(value) =>
            handleInputChange('launchTokensCreated', value)
          }
          error={errors.launchTokensCreated} // Display validation error
          required
          step={100}
          thousandSeparator=","
          allowNegative={false}
          mb="md"
        />

        <NumberInput
          label="Launch Cycle Period (weeks)"
          placeholder="Enter the cycle period in weeks (default: 12)"
          value={formValues.launchCyclePeriod}
          onChange={(value) =>
            handleInputChange('launchCyclePeriod', value)
          }
          error={errors.launchCyclePeriod} // Display validation error
          required
          allowNegative={false}
          mb="md"
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <NumberInput
          label="Launch Token Release Rate (%)"
          placeholder="Enter the release rate percentage (default: 10%)"
          value={formValues.launchTokenReleaseRate}
          onChange={(value) =>
            handleInputChange('launchTokenReleaseRate', value)
          }
          error={errors.launchTokenReleaseRate} // Display validation error
          required
          min={0}
          max={100}
          decimalScale={2}
          mb="md"
        />

        <NumberInput
          label="Initial Token Release Date (# weeks after collab approval, 0 is default and at time of approval)"
          placeholder="Enter the number of weeks (0 = at approval)"
          value={formValues.launchTokenInitialReleaseWeeks}
          onChange={(value) =>
            handleInputChange('launchTokenInitialReleaseWeeks', value)
          }
          error={errors.launchTokenInitialReleaseWeeks} // Display validation error
          required
          mb="md"
          allowNegative={false}
        />
      </SimpleGrid>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={handleSubmit}>Propose Collaborative</Button>
      </Group>
    </Container>
  );
}