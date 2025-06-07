import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, TextInput, Textarea, Grid, Select, MultiSelect, 
  Button, Group, Paper, Title, SimpleGrid, Text, Loader
} from '@mantine/core';
import { ImageField } from '../ImageField.tsx';
import { IconArrowLeft } from '@tabler/icons-react';
import { us_states } from '../data.ts';

interface User {
  userName: string;
  firstName: string;
  lastName: string;
  bio: string;
  city: string;
  state: string;
  phoneNumber: string;
  linkedIn: string;
  avatarUrl: string;
  createdAt: string;
  memberStatus: string;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
}

export function EditUserProfile() {
  const [formValues, setFormValues] = useState<User | null>(null);
  const [originalValues, setOriginalValues] = useState<User | null>(null); // Track original values
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState<{ id: number; value: string }[]>([]);
  const [experience, setExperience] = useState<{ id: number; value: string }[]>([]);
  const navigate = useNavigate();

  // Helper function to compare arrays of objects by id
  const arraysEqual = (arr1: { id: number; value: string }[], arr2: { id: number; value: string }[]) => {
    if (arr1.length !== arr2.length) return false;
    const ids1 = arr1.map(item => item.id).sort();
    const ids2 = arr2.map(item => item.id).sort();
    return ids1.every((id, index) => id === ids2[index]);
  };

  // Function to get only changed fields
  const getChangedFields = () => {
    if (!formValues || !originalValues) return {};

    const changes: Partial<User> = {};

    // Check each field for changes
    if (formValues.firstName !== originalValues.firstName) {
      changes.firstName = formValues.firstName;
    }
    if (formValues.lastName !== originalValues.lastName) {
      changes.lastName = formValues.lastName;
    }
    if (formValues.bio !== originalValues.bio) {
      changes.bio = formValues.bio;
    }
    if (formValues.city !== originalValues.city) {
      changes.city = formValues.city;
    }
    if (formValues.state !== originalValues.state) {
      changes.state = formValues.state;
    }
    if (formValues.phoneNumber !== originalValues.phoneNumber) {
      changes.phoneNumber = formValues.phoneNumber;
    }
    if (formValues.linkedIn !== originalValues.linkedIn) {
      changes.linkedIn = formValues.linkedIn;
    }
    if (formValues.avatarUrl !== originalValues.avatarUrl) {
      changes.avatarUrl = formValues.avatarUrl;
    }

    // Check skills array
    if (!arraysEqual(formValues.skills, originalValues.skills)) {
      changes.skills = formValues.skills;
    }

    // Check experience array
    if (!arraysEqual(formValues.experience, originalValues.experience)) {
      changes.experience = formValues.experience;
    }

    return changes;
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        new URL("profile", import.meta.env.VITE_API_BASE),
        {
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch user data");
      
      const data = await response.json();
      
      // Create initial data structure
      const initialData = {
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        city: data.city,
        state: data.state,
        phoneNumber: data.phoneNumber,
        linkedIn: data.linkedIn,
        avatarUrl: data.avatarUrl,
        createdAt: data.createdAt,
        memberStatus: data.memberStatus,
        skills: data.skills || [],
        experience: data.experience || [],
      };
      
      setFormValues(initialData);
      setOriginalValues(JSON.parse(JSON.stringify(initialData))); // Deep copy for comparison
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (field: keyof User, value: any) => {
    setFormValues((current) => ({ ...current!, [field]: value }));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchSkillsAndExperience = async () => {
    try {
      const response = await fetch(
        new URL("skills-and-experience", import.meta.env.VITE_API_BASE),
        {
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch skills and experience");
      
      const data = await response.json();
      setSkills(data.skills);
      setExperience(data.experience);
    } catch (err) {
      console.error("Error fetching skills and experience:", err);
    }
  };

  // Fetch skills and experience from the backend
  useEffect(() => {
    fetchSkillsAndExperience();
  }, []);
  
  const handleCancel = () => {
    navigate('/user-profile');
  };

  const handleFormSubmit = async () => {
    if (!formValues) return;

    // Get only the changed fields
    const changedFields = getChangedFields();
    
    // If no changes, don't submit
    if (Object.keys(changedFields).length === 0) {
      console.log("No changes detected, skipping submission");
      navigate('/user-profile');
      return;
    }

    console.log("Changed fields:", changedFields);

    setSubmitting(true);
    try {
      // Create a modified payload for the API with only changed fields
      const payload: any = {};
      
      // Transform skills and experience to just arrays of IDs if they changed
      Object.keys(changedFields).forEach(key => {
        if (key === 'skills' && changedFields.skills) {
          payload.skills = changedFields.skills.map(skill => skill.id);
        } else if (key === 'experience' && changedFields.experience) {
          payload.experience = changedFields.experience.map(exp => exp.id);
        } else {
          payload[key] = (changedFields as any)[key];
        }
      });

      console.log("Payload being sent:", payload);

      const response = await fetch(
        new URL("profile", import.meta.env.VITE_API_BASE),
        {   
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Success! Now navigate back to profile
      navigate('/user-profile');
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }
  
  return (
    <Container size="md" py="xl">
      <Link 
        to={"/user-profile"}
        style={{ textDecoration: 'none', color: '#0077b5', display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <IconArrowLeft size={16} style={{ marginRight: '5px' }} />
        <Text>Back</Text>
      </Link>
      <Paper p="lg" withBorder>
        <Group justify="flex-start" mb="xl">
          <Title order={2}>Edit Profile</Title>
        </Group>
        
        <SimpleGrid cols={2} mb="lg">
            <TextInput
                label="First Name"
                value={formValues?.firstName || ''}
                onChange={(event) => handleFormChange('firstName', event.currentTarget.value)}
                />
            <TextInput
                label="Last Name"
                value={formValues?.lastName || ''}
                onChange={(event) => handleFormChange('lastName', event.currentTarget.value)}
                />
        </SimpleGrid>

        <Textarea
            label="Bio"
            value={formValues?.bio || ''}
            onChange={(event) => handleFormChange('bio', event.currentTarget.value)}
            autosize
            minRows={3}
            maxRows={5}
            mb="lg"
        />

        <Grid>
            <Grid.Col span={6}>
                <TextInput
                    label="City"
                    value={formValues?.city || ''}
                    onChange={(event) => handleFormChange('city', event.currentTarget.value)}
                    mb="lg"
                />
                <Select
                    label="State"
                    data={us_states}
                    value={formValues?.state || ''}
                    onChange={(value) => handleFormChange('state', value || '')}
                    searchable
                    mb="lg"
                />
                <TextInput
                  label="Phone Number"
                  value={formValues?.phoneNumber || ''}
                  onChange={(event) => handleFormChange('phoneNumber', event.currentTarget.value)}
                  mb="lg"
                />
                <TextInput
                    label="LinkedIn"
                    value={formValues?.linkedIn || ''}
                    onChange={(event) => handleFormChange('linkedIn', event.currentTarget.value)}
                    mb="lg"
                />
            </Grid.Col>
            <Grid.Col span={6}>
                {formValues && (
                  <ImageField 
                      label="Profile Picture"
                      initialImageUrl={formValues?.avatarUrl}
                      onImageSelected={(url) => handleFormChange('avatarUrl', url)}
                      mb="lg"
                  />
                )}
            </Grid.Col>
        </Grid>
        
        <MultiSelect
            label="Member Skills"
            placeholder="Select your skills"
            data={skills.map((skill) => ({ value: skill.id.toString(), label: skill.value }))}
            value={formValues?.skills?.map((skill) => skill.id.toString()) || []}
            onChange={(values) => {
              const selectedSkills = skills.filter((skill) => values.includes(skill.id.toString()));
              handleFormChange('skills', selectedSkills);
            }}
            searchable
            clearable
            mb="md"
        />

        <MultiSelect
            label="Sector Experience"
            placeholder="Select your experience"
            data={experience.map((exp) => ({ value: exp.id.toString(), label: exp.value }))}
            value={formValues?.experience?.map((exp) => exp.id.toString()) || []}
            onChange={(values) => {
              const selectedExperience = experience.filter((exp) => values.includes(exp.id.toString()));
              handleFormChange('experience', selectedExperience);
            }}
            searchable
            clearable
            mb="md"
        />
        
        <Group justify="flex-end" gap="md">
          <Button 
            variant="default" 
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleFormSubmit}
            loading={submitting}
            disabled={submitting}
          >
            Save Changes
          </Button>
        </Group>
    
      </Paper>
    </Container>
  );
}