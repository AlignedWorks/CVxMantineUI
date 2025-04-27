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
  Grid,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import {
  IconAt,
  IconBrandLinkedin,
  IconPhoneCall,
} from '@tabler/icons-react'

interface User {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
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
    fetch("https://cvx.jordonbyers.com/profile", {
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
                <Avatar src={user.avatarUrl} size={120} radius={120} mb="xl" />
              </Grid.Col>
              <Grid.Col span={9}>
                <Stack>
                  <Title order={2}>{user.firstName + " " + user.lastName}</Title>
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
                </Stack>
              </Grid.Col>
            </Grid>
          
          <p>
            {user.bio}<br /><br />
            Member status: {user.memberStatus}<br /><br />
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <Group wrap="nowrap" gap={10} mt={5}>
            <IconBrandLinkedin stroke={1.5} size={16} />
            <Text>
              {user.linkedIn}
            </Text>
          </Group>
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