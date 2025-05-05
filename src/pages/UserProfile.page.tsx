import { useEffect, useState } from "react";
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
  username: string;
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
}

const mock_user = [
  {
    username: 'jordonbyers@gmail.com',
    firstName: 'Jordon',
    lastName: 'Byers',
    bio: 'A passionate developer and designer with a love for creating beautiful and functional applications.',
    city: "Mechanicsburg",
    state: "PA",
    phoneNumber: '(717) 206-7137',
    linkedIn: 'https://www.linkedin.com/in/jordonbyers/',
    avatarUrl: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    createdAt: '01-01-2023',
    memberStatus: 'NetworkOwner',
  }
]

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [formValues, setFormValues] = useState<User | null>(null); // Initialize as null

  const fetchUserData = () => {
    try {
      fetch(
        new URL("profile", import.meta.env.VITE_API_BASE),
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => { 
          setUser(data);
        })
        .catch((err) => 
          {
            console.error("Error fetching profile:", err);
            setUser(mock_user[0]);
          });
      } catch (err) {
        console.error("Error forming URL:", err);
        setUser(mock_user[0]); // Fallback to mock data
      }
  };

  const handleFormChange = (field: keyof User, value: string) => {
    setFormValues((current) => ({ ...current!, [field]: value }));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

    // Update formValues when user data is fetched
  useEffect(() => {
    if (user) {
      setFormValues({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        city: user.city,
        state: user.state,
        phoneNumber: user.phoneNumber,
        linkedIn: user.linkedIn,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        memberStatus: user.memberStatus
      });
    }
  }, [user]); // Run this effect when 'user' changes

  const handleFormSubmit = () => {
    if (!formValues) return;
    const { createdAt, ...payload } = formValues;

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
          setModalOpened(false); // Close the modal
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  return (
    <>
    <Container size="md" py="xl">
      { user ? (
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
                          {user.username}
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
                          <a href={user.linkedIn} style={{ color: '#0077b5', textDecoration: 'none' }}>
                            {user.linkedIn.split('linkedin.com/in/')[1]}
                          </a>
                        ) : (
                          'N/A'
                        )}
                        </Text>
                      </Group>
                      <span style={{ color: 'grey'}}>Member since:</span>  {new Date(user.createdAt).toLocaleDateString()}
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
                      <Badge variant="light" color="blue">
                        Design & Creative
                      </Badge>
                      <Badge variant="light" color="blue">
                        Development & IT
                      </Badge>
                    </div>
                    <div>
                      Experience<br/>
                      <Badge variant="light" color="green">
                        Non-Profit
                      </Badge>
                    </div>
                  </SimpleGrid>
              </Grid.Col>

            </Grid>
          </Card>
      ) : (
        <p></p>
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
        <Button fullWidth mt="lg" onClick={handleFormSubmit}>
          Save Changes
        </Button>
      </Modal>
    </>
  );
}