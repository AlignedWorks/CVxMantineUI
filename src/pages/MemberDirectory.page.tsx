import { useState }  from 'react';
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
  MultiSelect
} from '@mantine/core';
import { User, users, skills, experience } from '../data.ts'
import { IconSearch } from '@tabler/icons-react';

export function MemberDirectory() {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const [formValues, setFormValues] = useState<User>({
    id: 0,
    name: '',
    email: '',
    description: '',
    phone_number: '',
    avatar_url: '',
    location: '',
    member_since: '',
    linkedin: '',
    skills: [],
    experience: [],
  });

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
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.location.toLowerCase().includes(query)
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
              src={user.avatar_url}
              size={120}
              radius={120}
              mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
              {user.name}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {user.email}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {user.location}
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
              value={formValues.name}
              onChange={(event) => handleFormChange('name', event.currentTarget.value)}
            />
            <TextInput
              label="Email"
              value={formValues.email}
              onChange={(event) => handleFormChange('email', event.currentTarget.value)}
            />
            <Textarea
              label="Description"
              value={formValues.description}
              onChange={(event) => handleFormChange('description', event.currentTarget.value)}
            />
            <TextInput
              label="Location"
              value={formValues.location}
              onChange={(event) => handleFormChange('location', event.currentTarget.value)}
            />
            <TextInput
              label="Member Since"
              value={formValues.member_since}
              onChange={(event) => handleFormChange('member_since', event.currentTarget.value)}
            />
            <TextInput
              label="LinkedIn"
              value={formValues.linkedin}
              onChange={(event) => handleFormChange('linkedin', event.currentTarget.value)}
            />
            <MultiSelect
              label="Skills"
              data={skills} // Use the transformed grouped skills data
              value={formValues.skills.map((skill) => skill.value)} // Extract the values from the selected skills
              onChange={(value) => handleFormChange('skills', value)}
              searchable
              clearable
            />
            <MultiSelect
              label="experience"
              data={experience}
              value={formValues.experience.map((exp) => exp.value)} // Extract the values from the selected experience
              onChange={(value) => handleFormChange('experience', value)}
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