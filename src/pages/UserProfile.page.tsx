import { useEffect, useState } from "react";
import { Container, Avatar, Title, Textarea, TextInput, Modal, Group, Button, SimpleGrid, } from '@mantine/core';

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
      .catch((err) => console.error("Error fetching profile:", err));
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
  }, [user]); // Run this effect when `user` changes

  const handleFormSubmit = () => {
    if (!formValues) return;
    const { createdAt, ...payload } = formValues;

    // Update the user profile here (e.g., send a PUT request to the API)
    fetch("https://cvx.jordonbyers.com/profile", {
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
    <Container size="sm" py="xl">
        <Group>
          <div>
          { user ? (
            <>
              <Avatar src={user.avatarUrl} size={120} radius={120} />
              <Title order={2}>{user.firstName + " " + user.lastName}</Title>
              <p>{user.bio}</p>
              <p>{user.phoneNumber}</p>
              <p>{user.memberStatus}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </>
          ) : (
            <p></p>
          )}
          </div>
        </Group>

        <Group mt="xl">
          <Button variant="default" onClick={() => setModalOpened(true)}>
            Update Profile
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