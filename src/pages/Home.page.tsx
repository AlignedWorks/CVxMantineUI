import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Link } from 'react-router-dom';
import { Modal, TextInput, Textarea, Button, Group } from '@mantine/core';
import { useEffect, useState } from "react";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  linkedIn: string;
  avatarUrl: string;
  createdAt: string;
}

export function Home() {
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
        linkedIn: user.linkedIn,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
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
      <Welcome />
      <ColorSchemeToggle />
      <Group justify="center" mt="xl">
        <Link to="/login">
          <Button variant="default">Log in</Button>
        </Link>
        <Link to="/register">
          <Button variant="default">Register</Button>
        </Link>
        <Link to="/create-collaborative">
          <Button variant="default">Propose a Collaborative</Button>
        </Link>
        <Button variant="default" onClick={() => setModalOpened(true)}>
          Update Profile
        </Button>
      </Group>
      <Group justify="center" mt="xl">
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
          
          {user ? (
            <>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.username}</p>
              <p>{user.bio}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          ) : (
            <p></p>
          )}
        </div>
      </Group>

      {/* Modal for editing the profile */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Edit Profile"
        centered
      >
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
        <Textarea
          label="Bio"
          value={formValues?.bio}
          onChange={(event) => handleFormChange('bio', event.currentTarget.value)}
        />
        <TextInput
          label="LinkedIn"
          value={formValues?.linkedIn}
          onChange={(event) => handleFormChange('linkedIn', event.currentTarget.value)}
        />
        <TextInput
          label="Avatar URL"
          value={formValues?.avatarUrl}
          onChange={(event) => handleFormChange('avatarUrl', event.currentTarget.value)}
        />
        <Button fullWidth mt="md" onClick={handleFormSubmit}>
          Save Changes
        </Button>
      </Modal>
    </>
  );
}