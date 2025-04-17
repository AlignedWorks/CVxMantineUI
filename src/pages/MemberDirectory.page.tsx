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

export function MemberDirectory() {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState<User>({
    id: 0,
    name: '',
    email: '',
    description: '',
    avatar_url: '',
    role: '',
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

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md" pt="sm" pb="xl">
        Member Directory
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
        {users.map((user) => (
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
              {user.role}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {user.location}
            </Text>
            <Group justify="center" mt="md">
              <Button variant="light" color="gray" size="xs" onClick={() => handleEditClick(user)}>
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
              label="Role"
              value={formValues.role}
              onChange={(event) => handleFormChange('role', event.currentTarget.value)}
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
              value={formValues.skills}
              onChange={(value) => handleFormChange('skills', value)}
              searchable
              clearable
            />
            <MultiSelect
              label="experience"
              data={experience}
              value={formValues.experience}
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