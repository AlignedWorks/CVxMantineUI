import { useState }  from 'react';
import { Container, Title, SimpleGrid, Paper, Text, Button, Group, Avatar, Modal, TextInput, Textarea, MultiSelect } from '@mantine/core';
import { skills, experience } from '../data.ts'

interface User {
  id: number;
  name: string;
  email: string;
  description: string;
  avatar_url: string;
  role: string;
  location: string;
  member_since: string;
  linkedin: string;
  skills: string[];
  experience: string[];
}

const users: User[] = [
  {
    id: 1,
    name: 'Gary Hartis',
    email: 'gerry@aligned.works',
    description: '',
    avatar_url: '/assets/profile-pic-Gerry-Hartis.jpeg',
    role: 'Founder',
    location: 'Somewhere, PA soon to be SC',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/garyhartis/',
    skills: ['Design & Creative'],
    experience: ['Education', 'Non-Profit', 'Retail'],
  },
  {
    id: 2,
    name: 'AlignedWorks',
    email: '',
    description: '',
    avatar_url: 'assets/alignedWorksLogoCompact.png',
    role: 'Venture Talent Network',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/alignedworks/',
    skills: ['string'],
    experience: ['string'],
  },
  {
    id: 3,
    name: 'David Vader',
    email: 'david@aligned.works',
    description: '',
    avatar_url: '/assets/David_profile_pic.JPG',
    role: 'Founder',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/davidtvader/',
    skills: ['Design & Creative', 'Development & IT'],
    experience: ['Education', 'Non-Profit'],
  },
  {
    id: 4,
    name: 'Leif Uptegrove',
    email: 'focalshine@gmail.com',
    description: '',
    avatar_url: '/assets/Profile-pic-Leif-Uptegrove.jpg',
    role: 'Tech Entrenpreneur',
    location: 'Somewhere, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/leifuptegrove/',
    skills: ['Development & IT'],
    experience: ['string'],
  },
  {
    id: 5,
    name: 'Peter Sahajian',
    email: 'peter.sahajian@gmail.com',
    description: '',
    avatar_url: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
    role: 'Software Engineer',
    location: 'Fairfax, VA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/petersahajian/',
    skills: ['Development & IT', 'Engineering & Architecture'],
    experience: ['Telecoms'],
  },
  {
    id: 6,
    name: 'Ben Huang',
    email: 'benjaminwong1985@gmail.com',
    description: '',
    avatar_url: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    role: 'Software Engineer',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/benhuangbmj/',
    skills: ['Design & Creative', 'Development & IT'],
    experience: ['Education'],
  },
  {
    id: 7,
    name: 'Jordon Byers',
    email: 'jordonbyers@gmail.com',
    description: '',
    avatar_url: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    role: 'Software Engineer',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/jordonbyers/',
    skills: ['Design & Creative', 'Development & IT'],
    experience: ['Non-Profit'],
  },
  // Add more user data as needed
];

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
    <Container size="lg" py="xl">
      <Title order={1} mb="md" pt="sm" pb="xl">
        Member Directory
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }} spacing="xl">
        {users.map((user) => (
          <Paper key={user.id} radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
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