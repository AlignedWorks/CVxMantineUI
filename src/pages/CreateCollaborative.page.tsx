import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { ImageField } from '../ImageField.tsx';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  Button,
  Group,
  SimpleGrid,
  Grid,
} from '@mantine/core';
import {
  Collaborative,
  us_states,
} from '../data.ts';

export function CreateCollaborative() {
    const navigate = useNavigate();
    const [skills, setSkills] = useState<{ id: number; value: string }[]>([]); // State for skills
    const [experience, setExperience] = useState<{ id: number; value: string }[]>([]); // State for experience
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
          logoUrl: '',
          launchTokensCreated: 10000,
          launchTokensPriorWorkPercent: 0,
          launchCyclePeriod: 12,
          launchTokenReleaseRate: 10,
          launchTokenSecondReleaseWeeks: 0,
          launchTokenValue: 0,
          collabAdminCompensationPercent: 0,
        });
        setErrors({});
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


  const [formValues, setFormValues] = useState<Collaborative>({
    name: '',
    description: '',
    websiteUrl: '',
    logoUrl: "/assets/logos/Default.png",
    city: '',
    state: '',
    skills: [],
    experience: [],
    launchTokensCreated: 10000,
    launchTokensPriorWorkPercent: 0,
    launchCyclePeriod: 12,
    launchTokenReleaseRate: 10,
    launchTokenValue: 0,
    launchTokenSecondReleaseWeeks: 0,
    collabAdminCompensationPercent: 0,
  });

  const [errors, setErrors] = useState<{
    name?: string,
    description?: string,
    skills?: string,
    experience?: string,
    launchTokensCreated?: string,
    launchCyclePeriod?: string,
    launchTokenReleaseRate?: string,
    launchTokenValue?: string;
    launchTokenSecondReleaseWeeks?: string,
  }>({});


  const handleInputChange = (field: keyof Collaborative, value: any) => {
    setFormValues((current) => ({
      ...current, [field]: value,
    }));

    // Clear errors when the user starts typing
    if (field === 'description') {
      setErrors((currentErrors) => ({ ...currentErrors, description: undefined }));
    } else if (field === 'skills') {
      setErrors((currentErrors) => ({ ...currentErrors, skills: undefined }));
    } else if (field === 'experience') {
      setErrors((currentErrors) => ({ ...currentErrors, experience: undefined }));
    } else if (field === 'name') {
      setErrors((currentErrors) => ({ ...currentErrors, name: undefined }));
    }

  };

  const handleSubmit = async () => {
    const newErrors: {
        name?: string;
        description?: string;
        skills?: string;
        experience?: string;
        launchTokensCreated?: string;
        launchCyclePeriod?: string;
        launchTokenReleaseRate?: string;
        launchTokenValue?: string;
        launchTokenSecondReleaseWeeks?: string;
      } = {};

    // Validate name
    if (!formValues.name.trim()) {
        newErrors.name = 'Name is required.';
    }

    // Validate description
    if (!formValues.description.trim()) {
        newErrors.description = 'Description is required.';
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
    if (formValues.launchTokenSecondReleaseWeeks === undefined) {
      newErrors.launchTokenSecondReleaseWeeks = 'Second Token Release Date is required.';
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

          navigate('/');
          
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          console.error('Failed to create collaborative:', errorMessage);
          alert(errorMessage || 'Failed to create collaborative. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form. Please try again.');
      }
    }
  };

  const formatNumber = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const numTokensSetAsideForPriorWork = Math.round((formValues.launchTokensPriorWorkPercent / 100) * (formValues.launchTokensCreated || 0));

  // compute first three cycle balances (start of each cycle) using decay = (1 - releaseRate)
  const releaseCyclesPreview: React.ReactNode = (() => {
    const created = Math.max(0, Math.round(formValues.launchTokensCreated - numTokensSetAsideForPriorWork || 0));
    const rate = Math.max(0, Math.min(100, formValues.launchTokenReleaseRate || 0)) / 100;

    const first = Math.round(created * rate);
    const second = Math.round(first * (1 - rate));
    const third = Math.round(second * (1 - rate));

    const cycles = [first, second, third];
    const ord = (n: number) => (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');

    return (
      <>
        # tokens&nbsp;
        {cycles.map((v, i) => (
          <span key={i}>
            {i + 1}{ord(i + 1)} cycle:&nbsp;<strong>{formatNumber(v)}</strong>{i < cycles.length - 1 ? ', ' : ''}
          </span>
        ))}
      </>
    );
  })();

  // compute admin payouts for the first three cycles based on collabAdminCompensationPercent
  const adminPaymentsPreview: React.ReactNode = (() => {
    const compPct = Math.max(0, Math.min(100, formValues.collabAdminCompensationPercent || 0)) / 100;
    if (compPct === 0) return '';

    const created = Math.max(0, Math.round(formValues.launchTokensCreated - numTokensSetAsideForPriorWork || 0));
    const rate = Math.max(0, Math.min(100, formValues.launchTokenReleaseRate || 0)) / 100;

    const first = Math.round(created * rate);
    const second = Math.round(first * (1 - rate));
    const third = Math.round(second * (1 - rate));

    const adminFirst = Math.round(first * compPct);
    const adminSecond = Math.round(second * compPct);
    const adminThird = Math.round(third * compPct);

    const ord = (n: number) => (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
    const arr = [adminFirst, adminSecond, adminThird];

    return (
      <>
        # tokens&nbsp;
        {arr.map((v, i) => (
          <span key={i}>
            {i + 1}{ord(i + 1)} cycle:&nbsp;<strong>{formatNumber(v)}</strong>{i < arr.length - 1 ? ', ' : ''}
          </span>
        ))}
      </>
    );
  })();

  return (
    <Container size="md" py="xl">

      {/* Back Link */}
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>

      <Title order={1} mb="md" pt="sm" pb="lg">
          Propose a Collaborative
      </Title>

      <Title order={2} pt="sm" pb="md" ta="center">
          Purpose and People
      </Title>

      <SimpleGrid mt="xl" cols={{ base: 1, md: 2 }}>
        <TextInput
            label="Collaborative Name"
            placeholder="Enter your Collab's name"
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
        initialImageUrl="https://3dfkqr6d6rggxy6x.public.blob.vercel-storage.com/Default.png"
        onImageSelected={(url) => handleInputChange('logoUrl', url)}
      />

      <Title order={2} mt="xl" mb="md" pt="xl" pb="md" ta="center">
        Launch Tokens
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <NumberInput
          label="Tokens Created"
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

        <div>
          <NumberInput
            label="Current Token Price"
            placeholder="Enter the current token price in USD (e.g., 1.00), this is optional"
            value={formValues.launchTokenValue}
            onChange={(value) =>
              handleInputChange('launchTokenValue', value)
            }
            error={errors.launchTokenValue} // Display validation error

            min={0}
            prefix="$"
            decimalScale={2}
            allowNegative={false}
            mb="xs" 
          />
          <Text size="sm" c="dimmed" mb="md">
            {`Token Pool Value: $${(formValues.launchTokenValue * formValues.launchTokensCreated).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}`}
          </Text>
        </div>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <div>
          <NumberInput
            label="Tokens for Prior Work"
            placeholder="Enter the expected token value increase percentage (default: 0%)"
            value={formValues.launchTokensPriorWorkPercent }
            onChange={(value) =>
              handleInputChange('launchTokensPriorWorkPercent', value)
            }
            min={0}
            max={100}
            suffix="%"
            decimalScale={2}
            mb="xs"
          />
          <Text size="sm" c="dimmed" mb="md">
            # tokens: {formValues.launchTokensPriorWorkPercent > 0 ? `${((formValues.launchTokensPriorWorkPercent / 100) * formValues.launchTokensCreated).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}` : 0}
          </Text>
        </div>

        <div>
          <NumberInput
            label="Token Release Rate"
            placeholder="Enter the release rate percentage (default: 10%)"
            value={formValues.launchTokenReleaseRate}
            onChange={(value) =>
              handleInputChange('launchTokenReleaseRate', value)
            }
            error={errors.launchTokenReleaseRate} // Display validation error
            required
            min={0}
            max={100}
            suffix="%"
            decimalScale={2}
            mb="xs"
          />
          <Text size="sm" c="dimmed" mb="md">
            {releaseCyclesPreview}
          </Text>
        </div>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
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

        <div>
          <NumberInput
            label="Second Release (weeks)"
            placeholder="Enter weeks (0 = at approval)"
            value={formValues.launchTokenSecondReleaseWeeks}
            onChange={(value) =>
              handleInputChange('launchTokenSecondReleaseWeeks', value)
            }
            error={errors.launchTokenSecondReleaseWeeks} // Display validation error
            required
            mb="xs"
            allowNegative={false}
          />
          <Text size="sm" c="dimmed" mb="md">
            # weeks after collab approval (0 = at approval)
          </Text>
        </div>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
        <div>
          <NumberInput
            label="Collab Admin Pay"
            placeholder="Percentage of each release cycle allocated to the collaborative admin (default: 0%)"
            value={formValues.collabAdminCompensationPercent}
            onChange={(value) =>
              handleInputChange('collabAdminCompensationPercent', value)
            }
            required
            min={0}
            max={100}
            suffix="%"
            decimalScale={2}
            mb="xs"
          />
          <Text size="sm" c="dimmed" mb="md">
            {adminPaymentsPreview
              ? <>{adminPaymentsPreview}</>
              : 'Percentage of tokens released to the collaborative admin every cycle as compensation'}
          </Text>
        </div>
        <div>
          {/* empty placeholder to reserve the second column so widths match */}
        </div>
      </SimpleGrid>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={handleSubmit}>Submit Collaborative Proposal</Button>
      </Group>
    </Container>
  );
}