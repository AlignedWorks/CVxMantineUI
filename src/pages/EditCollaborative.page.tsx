import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { ImageField } from '../ImageField';
import {
  us_states,
} from '../data';

export function EditCollaborative() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [skills, setSkills] = useState<{ id: number; value: string }[]>([]);
  const [experience, setExperience] = useState<{ id: number; value: string }[]>([]);

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
        setFormValues({
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl || '',
          city: data.city || '',
          state: data.state || '',
          skills: data.skills || [],
          experience: data.experience || [],
          logoUrl: data.logoUrl || '',
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
  };

  const handleSubmit = async () => {
    if (!formValues) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formValues),
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
        <Text>Back to Collaborative</Text>
      </Link>

      <Paper p="lg" withBorder>
        <Title order={2} mb="xl">Edit Collaborative</Title>

        <Stack>
          <ImageField
            label="Collaborative Logo"
            initialImageUrl={formValues?.logoUrl}
            onImageSelected={(url) => handleFormChange('logoUrl', url)}
            mb="lg"
          />

          <TextInput
            label="Collaborative Name"
            placeholder="Enter name"
            value={formValues?.name || ''}
            onChange={(e) => handleFormChange('name', e.target.value)}
            required
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

          <TextInput
            label="Website URL"
            placeholder="https://example.com"
            value={formValues?.websiteUrl || ''}
            onChange={(e) => handleFormChange('websiteUrl', e.target.value)}
            mb="md"
          />

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="City"
                placeholder="Enter city"
                value={formValues?.city || ''}
                onChange={(e) => handleFormChange('city', e.target.value)}
                mb="md"
              />
            </Grid.Col>
            <Grid.Col span={6}>
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
          </Grid>

          <MultiSelect
            label="Skills"
            placeholder="Select skills"
            data={skills.map((skill) => ({ value: skill.id.toString(), label: skill.value }))}
            value={formValues?.skills?.map((skill: any) => skill.id) || []}
            onChange={(value) => {
              const selectedSkills = skills.filter((skill) => value.includes(skill.id.toString()));
              handleFormChange('skills', selectedSkills);
            }}
            searchable
            mb="md"
          />

          <MultiSelect
            label="Experience Levels"
            placeholder="Select experience levels"
            data={experience.map((exp) => ({ value: exp.id.toString(), label: exp.value }))}
            value={formValues?.experience?.map((exp: any) => exp.id) || []}
            onChange={(value) => {
              const selectedExperience = experience.filter((exp) => value.includes(exp.id.toString()));
              handleFormChange('experience', selectedExperience);
            }}
            searchable
            mb="md"
          />

          <Group justify="flex-start" gap="md" mt="xl">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/collaboratives/${id}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
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