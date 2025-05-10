import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  Container,
  Avatar,
  Title,
  Card,
  Text,
  Textarea,
  TextInput,
  Modal,
  Group,
  Button,
  Badge,
  Grid,
  SimpleGrid,
  Stack,
  Select,
  MultiSelect,
  Loader,
} from '@mantine/core';
import {
  IconAt,
  IconBrandLinkedin,
  IconPhoneCall,
  IconMapPin,
} from '@tabler/icons-react'
import {
  us_states,
} from '../data.ts';

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

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [formValues, setFormValues] = useState<User | null>(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Add a loading state
  const [skills, setSkills] = useState<{ id: number; value: string }[]>([]); // State for skills
  const [experience, setExperience] = useState<{ id: number; value: string }[]>([]); // State for experience

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
          console.log(data);
          setLoading(false); // Set loading to false after data is fetched
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
        console.log(data);
        setSkills(data.skills); // Assuming the JSON has a `skills` key
        setExperience(data.experience); // Assuming the JSON has an `experience` key
    })
    .catch((err) => console.error("Error fetching profile:", err));
  };

  // Fetch skills and experience from the backend
  useEffect(() => {
      fetchSkillsAndExperience();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

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
    // Update the user profile here (e.g., send a PUT request to the API)
    fetch(
      new URL("profile", import.meta.env.VITE_API_BASE),
      {   
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((updatedUser) => {
          setUser(updatedUser); // Update the user state with the new data
          setFormValues(updatedUser)
          setModalOpened(false); // Close the modal
          setLoading(false); // Set loading to false after update
      })
      .catch((err) => {
        console.error("Error updating profile:", err)
        setLoading(false); // Set loading to false even if there's an error);
      });
  };

  useEffect(() => {
    // When modal closes, refresh user data
    if (!modalOpened) {
      fetchUserData();
    }
  }, [modalOpened]);

  return (
    <>
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      {loading ? ( // Show a loader while loading
        <Loader size="lg" />
      ) : user ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder mt="lg" ml="lx">
          <Grid>
            <Grid.Col span={3}>
              <Avatar src={user.avatarUrl} size={120} radius={120} mb="xl" ml="lg" />
            </Grid.Col>
            <Grid.Col span={9}>
              <Stack>
                <Title order={2}>{user.firstName + " " + user.lastName}</Title>
                <SimpleGrid cols={2} mb="lg">
                  <div>
                    <Group wrap="nowrap" gap={10} mt={3}>
                      <IconAt stroke={1.5} size={16} />
                      <Text>
                        {user.userName}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconPhoneCall stroke={1.5} size={16} />
                      <Text>
                        {user.phoneNumber}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconMapPin stroke={1.5} size={16} />
                      <Text>
                        {user.city}, {user.state}
                      </Text>
                    </Group>
                  </div>
                  <div>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconBrandLinkedin stroke={1.5} size={18} />
                      <Text>
                      {user?.linkedIn ? (
                        <a
                          href={user.linkedIn}
                          style={{ color: '#0077b5', textDecoration: 'none' }}
                          target="_blank"
                          rel="noopener noreferrer">
                          {user.linkedIn.split('linkedin.com/in/')[1]}
                        </a>
                      ) : (
                        'N/A'
                      )}
                      </Text>
                    </Group>
                    <span style={{ color: 'grey'}}>Member since:</span>  {user.createdAt}
                    <br/>
                    <span style={{ color: 'grey'}}>Member status:</span>  {user.memberStatus}
                  </div>
                </SimpleGrid>
              </Stack>
              <p>
                {user.bio}<br /><br />
              </p>
              <SimpleGrid cols={2} mb="lg">
                  <div>
                    Skills<br/>
                    {user.skills && user.skills.length > 0 ? (
                      <Group gap="xs" mt="xs">
                        {user.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="light"
                            color="blue"
                          >
                            {skill.value}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No skills listed</Text>
                    )}
                  </div>
                  <div>
                    Experience<br/>
                    {user.experience && user.experience.length > 0 ? (
                      <Group gap="xs" mt="xs">
                        {user.experience.map((exp) => (
                          <Badge
                            key={exp.id}
                            variant="light"
                            color="green"
                          >
                            {exp.value}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No experience listed</Text>
                    )}
                  </div>
                </SimpleGrid>
            </Grid.Col>
          </Grid>
        </Card>
      ) : (
        <p>No user data available.</p>
      )}

      <Group mt="xl">
        <Button variant="default" onClick={() => setModalOpened(true)}>
          Edit Profile
        </Button>
      </Group>
    </Container>

    {/* Modal for editing the profile */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Edit Profile"
        centered
      >
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
        <TextInput
          label="Avatar URL"
          value={formValues?.avatarUrl}
          onChange={(event) => handleFormChange('avatarUrl', event.currentTarget.value)}
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
        <Button fullWidth mt="lg" onClick={handleFormSubmit}>
          Save Changes
        </Button>
      </Modal>
    </>
  );
}