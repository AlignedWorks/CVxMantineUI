import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Link } from 'react-router-dom';
import {
  Modal,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Table,
  Avatar,
  Badge,
  Select,
 } from '@mantine/core';
import { useEffect, useState } from "react";

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

const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    role: 'Collaborator',
    lastActive: '2 days ago',
    active: true,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    role: 'Collaborator',
    lastActive: '6 days ago',
    active: true,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    role: 'Contractor',
    lastActive: '2 days ago',
    active: false,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    role: 'Contractor',
    lastActive: '5 days ago',
    active: true,
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    role: 'Manager',
    lastActive: '3 days ago',
    active: false,
  },
];

const rolesData = ['Manager', 'Collaborator', 'Contractor'];

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

  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {item.email}
            </Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>
        <Select
          data={rolesData}
          defaultValue={item.role}
          variant="unstyled"
          allowDeselect={false}
        />
      </Table.Td>
      <Table.Td>{item.lastActive}</Table.Td>
      <Table.Td>
        {item.active ? (
          <Badge fullWidth variant="light">
            Active
          </Badge>
        ) : (
          <Badge color="gray" fullWidth variant="light">
            Disabled
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  
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
      </Group>
      <Group justify="center" mt="xl">
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
          
          {user ? (
            <>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.username}</p>
              <p>{user.bio}</p>
              <p>{user.phoneNumber}</p>
              <p>{user.memberStatus}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          ) : (
            <p></p>
          )}
        </div>
      
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
            <Table.Thead>
            <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Last active</Table.Th>
                <Table.Th>Status</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    </Table.ScrollContainer>

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
          label="Phone Number"
          value={formValues?.phoneNumber}
          onChange={(event) => handleFormChange('phoneNumber', event.currentTarget.value)}
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