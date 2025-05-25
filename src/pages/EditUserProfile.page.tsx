import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, TextInput, Textarea, Grid, Select, MultiSelect, 
  Button, Group, Paper, Title, SimpleGrid, Text
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [skills, setSkills] = useState<{ id: number; value: string }[]>([]); // State for skills
  const [experience, setExperience] = useState<{ id: number; value: string }[]>([]); // State for experience
  const navigate = useNavigate();

  const fetchUserData = () => {
    setLoading(true);  // Set loading to true before fetching
    try {
      fetch(
        new URL("profile", import.meta.env.VITE_API_BASE),
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => { 
          setUser(data);
          setLoading(false); // Set loading to false after data is fetched
          console.log("Fetched user data:", data);
        })
        .catch((err) => 
          {
            console.error("Error fetching profile:", err);
            setLoading(false); // Set loading to false even if there's an error
          });
      } catch (err) {
        console.error("Error forming URL:", err);
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
  
  const handleCancel = () => {
    navigate('/user-profile'); // Go back to profile page
  };

  // Update formValues when user data is fetched
    useEffect(() => {
        if (user) {
        setFormValues({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            city: user.city,
            state: user.state,
            phoneNumber: user.phoneNumber,
            linkedIn: user.linkedIn,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            memberStatus: user.memberStatus,
            skills: user.skills,
            experience: user.experience,
        });
        console.log(`avatarUrl: ${formValues?.avatarUrl}`)
        }
    }, [user]); // Run this effect when 'user' changes

    const handleFormSubmit = () => {
        if (!formValues) return;
        const payload = {
            ...formValues,
            skills: formValues.skills.map((skill) => skill.id), // Map skills to their IDs
            experience: formValues.experience.map((exp) => exp.id), // Map experience to their IDs
        }

        setLoading(true); // Set loading to true while updating
        console.log(loading); // add this for now so loading is used and doesn't trigger TS error
        // Update the user profile here (e.g., send a PUT request to the API)
        fetch(
            new URL("profile", import.meta.env.VITE_API_BASE),
            {   
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                return res.json();
            })
            .then(() => {
                // Success! Now navigate back to profile
                navigate('/user-profile');
            })
            .catch((err) => {
                console.error("Error updating profile:", err);
                alert("Failed to update profile. Please try again.");
                setLoading(false);
            });
    };
  
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
                value={formValues?.firstName}
                onChange={(event) => handleFormChange('firstName', event.currentTarget.value)}
                />
            <TextInput
                label="Last Name"
                value={formValues?.lastName}
                onChange={(event) => handleFormChange('lastName', event.currentTarget.value)}
                />
        </SimpleGrid>

        <Textarea
            label="Bio"
            value={formValues?.bio}
            onChange={(event) => handleFormChange('bio', event.currentTarget.value)}
            minRows={3}
            maxRows={5}
            mb="lg"
        />

        <Grid>
            <Grid.Col span={9}>
                <TextInput
                    label="City"
                    value={formValues?.city}
                    onChange={(event) => handleFormChange('city', event.currentTarget.value)}
                    mb="lg"
                />
            </Grid.Col>
            <Grid.Col span={3}>
                <Select
                    label="State"
                    data={us_states}
                    value={formValues?.state}
                    onChange={(value) => handleFormChange('state', value || '')}
                    searchable
                    mb="lg"
                />
            </Grid.Col>
        </Grid>

        <SimpleGrid cols={2} mb="lg">
          <TextInput
            label="Phone Number"
            value={formValues?.phoneNumber}
            onChange={(event) => handleFormChange('phoneNumber', event.currentTarget.value)}
            mb="lg"
          />
          <TextInput
              label="LinkedIn"
              value={formValues?.linkedIn}
              onChange={(event) => handleFormChange('linkedIn', event.currentTarget.value)}
              mb="lg"
          />
        </SimpleGrid>

        <ImageField 
            label="Your profile picture"
            initialImageUrl={formValues?.avatarUrl}
            onImageSelected={(url) => handleFormChange('avatarUrl', url)}
            mb="lg"
        />

        <MultiSelect
            label="Member Skills"
            placeholder="Select the needed skills"
            data={skills.map((skill) => ({ value: skill.id.toString(), label: skill.value }))}
            value={formValues?.skills?.map((skill) => skill.id.toString()) || []} // Map selected skills to their IDs
            onChange={(values) =>
                handleFormChange(
                'skills',
                values.map((id) => skills.find((skill) => skill.id.toString() === id))
                )
            }
            searchable
            clearable
            mb="md"
        />

        <MultiSelect
            label="Sector Experience"
            placeholder="Select the needed experience"
            data={experience.map((exp) => ({ value: exp.id.toString(), label: exp.value }))}
            value={formValues?.experience?.map((exp) => exp.id.toString()) || []} // Map selected experience to their IDs
            onChange={(values) =>
                handleFormChange(
                'experience',
                values.map((id) => experience.find((exp) => exp.id.toString() === id))
                )
            }
            searchable
            clearable
            mb="md"
        />
        <Group justify="flex-end" gap="md">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button variant="outline" onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Group>
    
      </Paper>
    </Container>
  );
}