import { useState, useEffect }  from 'react';
import { 
  Container,
  Title,
  SimpleGrid,
  Paper,
  Text,
  Button,
  Group,
  Avatar,
  Modal,
  TextInput,
  Textarea,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface User {
  id: string;
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
  skills: string[];
  experience: string[];
  memberStatus: string;
}

export function MemberDirectory() {
  const [modalOpened, setModalOpened] = useState(false);
  const [sortedData, setSortedData] = useState<User[]>([]); // State to hold the sorted data
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const [formValues, setFormValues] = useState<User>({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    phoneNumber: '',
    avatarUrl: '',
    city: '',
    state: '',
    createdAt: '',
    linkedIn: '',
    skills: [],
    experience: [],
    memberStatus: '',
  });

  // Fetch collaborative data from the backend
  useEffect(() => {
    fetch('https://cvx.jordonbyers.com/members', {
      method: 'GET',
      credentials: 'include', // Include cookies if needed
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        return response.json();
      })
      .then((data: User[]) => {
        setSortedData(data); // Set the fetched data
      })
      .catch((error) => {
        console.error('Error fetching member data:', error);
      });
  }, []); // Run only once when the component mounts

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormValues(user);
    setModalOpened(true);
  };

  const handleFormChange = (field: keyof User, value: any) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleFormSubmit = () => {
    // Update the user data here
    setModalOpened(false);
  };

  // Filter the users based on the search query
  const filteredUsers = sortedData.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.city.toLowerCase().includes(query) ||
      user.state.toLowerCase().includes(query)
    );
  });

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md" pt="sm" pb="xl">
        Member Directory
      </Title>

      {/* Search Input */}
      <TextInput
        placeholder="Search members"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        mb="xl"
      />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
        {filteredUsers.map((user) => (
          <Paper key={user.id} shadow="sm" radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Avatar
              src={user.avatarUrl}
              size={120}
              radius={120}
              mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
              {user.firstName} {user.lastName}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {user.username}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {user.city}, {user.state}
            </Text>
            <Group justify="center" mt="md">
              <Button variant="outline" size="sm" mt="lg" onClick={() => handleEditClick(user)}>
                View Profile
              </Button>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Edit User"
        size="xl"
      >
        {selectedUser && (
          <div>
            <TextInput
              label="Name"
              value={formValues.firstName}
              onChange={(event) => handleFormChange('firstName', event.currentTarget.value)}
            />
            <TextInput
              label="Name"
              value={formValues.lastName}
              onChange={(event) => handleFormChange('lastName', event.currentTarget.value)}
            />
            <TextInput
              label="Email"
              value={formValues.username}
              onChange={(event) => handleFormChange('username', event.currentTarget.value)}
            />
            <Textarea
              label="Description"
              value={formValues.bio}
              onChange={(event) => handleFormChange('bio', event.currentTarget.value)}
            />
            <TextInput
              label="Location"
              value={formValues.city}
              onChange={(event) => handleFormChange('city', event.currentTarget.value)}
            />
            <TextInput
              label="Location"
              value={formValues.state}
              onChange={(event) => handleFormChange('state', event.currentTarget.value)}
            />
            <TextInput
              label="Member Since"
              value={formValues.createdAt}
              onChange={(event) => handleFormChange('createdAt', event.currentTarget.value)}
            />
            <TextInput
              label="LinkedIn"
              value={formValues.linkedIn}
              onChange={(event) => handleFormChange('linkedIn', event.currentTarget.value)}
            />

            <Button onClick={handleFormSubmit} mt="md">
              Save
            </Button>
          </div>
        )}
      </Modal>

    </Container>
  );
}