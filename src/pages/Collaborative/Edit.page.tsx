import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Button,
  Group,
  Text,
  Paper,
  Stack,
  Grid,
  Loader,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { ImageField } from '../../ImageField.tsx';
import {
  us_states,
} from '../../data.ts';
import { FileUpload } from '../../components/uploads/FileUpload.tsx';

interface CollaborativeFormData {
    name: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
    city: string;
    state: string;
    skills: { id: number; value: string }[];
    experience: { id: number; value: string }[];
    csaDocUrl?: string;
}

export function EditCollaborative() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<CollaborativeFormData | null>(null);
  const [originalValues, setOriginalValues] = useState<CollaborativeFormData | null>(null); // Track original values
  const [skills, setSkills] = useState<{ id: number; value: string }[]>([]);
  const [experience, setExperience] = useState<{ id: number; value: string }[]>([]);

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null);
  }, [id, setCollaborativeId]);

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

    const changes: Partial<CollaborativeFormData> = {};

    // Check each field for changes
    if (formValues.name !== originalValues.name) {
      changes.name = formValues.name;
    }
    if (formValues.description !== originalValues.description) {
      changes.description = formValues.description;
    }
    if (formValues.websiteUrl !== originalValues.websiteUrl) {
      changes.websiteUrl = formValues.websiteUrl;
    }
    if (formValues.logoUrl !== originalValues.logoUrl) {
      changes.logoUrl = formValues.logoUrl;
    }
    if (formValues.city !== originalValues.city) {
      changes.city = formValues.city;
    }
    if (formValues.state !== originalValues.state) {
      changes.state = formValues.state;
    }
    if (formValues.csaDocUrl !== originalValues.csaDocUrl) {
      changes.csaDocUrl = formValues.csaDocUrl;
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

  // Fetch collaborative data
  useEffect(() => {
    setLoading(true);
    fetch(
      new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
      { credentials: "include" }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch collaborative data");
        return res.json();
      })
      .then((data) => {
        // Initialize form values with fetched data
        console.log("Fetched collaborative data:", data);
        setFormValues({
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl || '',
          logoUrl: data.logoUrl || '',
          city: data.city || '',
          state: data.state || '',
          skills: data.skills || [],
          experience: data.experience || [],
          csaDocUrl: data.csaDocUrl || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching collaborative data:", error);
        setLoading(false);
      });
  }, [id]);

  const fetchSkillsAndExperience = async () => {
    fetch(
      new URL("skills-and-experience", import.meta.env.VITE_API_BASE),
    {
        credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Fetched skills and experience data:", data);
        setSkills(data.skills);
        setExperience(data.experience);
    })
    .catch((err) => console.error("Error fetching profile:", err));
  };

  // Fetch skills and experience from the backend
  useEffect(() => {
      fetchSkillsAndExperience();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleFormChange = (field: string, value: any) => {
    setFormValues((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    console.log("Form values updated:", formValues?.logoUrl);
  };

  const handleSubmit = async () => {
    if (!formValues) return;

    // Get only the changed fields
    const changedFields = getChangedFields();
    
    // If no changes, don't submit
    if (Object.keys(changedFields).length === 0) {
      console.log("No changes detected, skipping submission");
      navigate(`/collaboratives/${id}`);
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
        new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating collaborative: ${response.status}`);
      }

      // Navigate back to the collaborative page
      navigate(`/collaboratives/${id}`);
    } catch (error) {
      console.error("Error updating collaborative:", error);
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
        to={`/collaboratives/${id}`} 
        style={{ textDecoration: 'none', color: '#0077b5', display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <IconArrowLeft size={16} style={{ marginRight: '5px' }} />
        <Text>Back</Text>
      </Link>

      <Paper p="lg" withBorder>
        <Title order={2} mb="xl">Edit Collaborative</Title>

        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={formValues?.name || ''}
            onChange={(e) => handleFormChange('name', e.target.value)}
            mb="md"
          />

          <Textarea
            label="Description"
            placeholder="Enter description"
            autosize
            minRows={3}
            value={formValues?.description || ''}
            onChange={(e) => handleFormChange('description', e.target.value)}
            mb="md"
          />

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Website URL"
                placeholder="https://example.com"
                value={formValues?.websiteUrl || ''}
                onChange={(e) => handleFormChange('websiteUrl', e.target.value)}
                mb="md"
              />
              <TextInput
                label="City"
                placeholder="Enter city"
                value={formValues?.city || ''}
                onChange={(e) => handleFormChange('city', e.target.value)}
                mb="md"
              />
              <Select
                label="State"
                placeholder="Select state"
                data={us_states}
                value={formValues?.state || ''}
                onChange={(value) => handleFormChange('state', value)}
                searchable
                mb="md"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ImageField
                label="Logo"
                initialImageUrl={formValues?.logoUrl}
                onImageSelected={(url) => handleFormChange('logoUrl', url)}
                mb="md"
              />
            </Grid.Col>
          </Grid>

          <MultiSelect
            label="Member Skills"
            placeholder="Select the needed skills"
            data={skills.map((skill) => ({ value: skill.id.toString(), label: skill.value }))}
            value={formValues?.skills?.map((skill) => skill.id.toString()) || []}
            onChange={(value) => {
              const selectedSkills = skills.filter((skill) => value.includes(skill.id.toString()));
              handleFormChange('skills', selectedSkills);
            }}
            searchable
            mb="md"
          />

          <MultiSelect
            label="Sector Experience"
            placeholder="Select the needed experience"
            data={experience.map((exp) => ({ value: exp.id.toString(), label: exp.value }))}
            value={formValues?.experience?.map((exp) => exp.id.toString()) || []}
            onChange={(value) => {
              const selectedExperience = experience.filter((exp) => value.includes(exp.id.toString()));
              handleFormChange('experience', selectedExperience);
            }}
            searchable
            mb="md"
          />

          <FileUpload
            onSuccess={(url) => handleFormChange('csaDocUrl', url)}
          />

          <Group justify="flex-end" gap="md">
            <Button 
              variant="default" 
              onClick={() => navigate(`/collaboratives/${id}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}