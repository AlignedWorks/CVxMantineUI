import React, { useState }  from 'react';
import { Container, Title, SimpleGrid, Paper, Text, Button, Group, Avatar, Modal, TextInput, Textarea, MultiSelect } from '@mantine/core';
import { IconMapSearch } from '@tabler/icons-react';

const skills = [
  'Design & Creative',
  'Development & IT',
  'Engineering & Architecture',
  'Marketing & Sales',
  'Finance & Accounting',
  'Human Resources',
  'Operations & Management',
  'Customer Service',
  'Legal',
  'Education',
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Transportation',
  'Energy',
  'Entertainment',
];

const users = [
  {
    id: 1,
    name: 'Gary Hartis',
    email: 'gerry@aligned.works',
    description: '',
    avatar_url: './src/assets/Avatars/profile-pic-Gerry-Hartis.jpeg',
    role: 'Founder',
    location: 'Somewhere, PA soon to be SC',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/garyhartis/',
    skills: ['Design & Creative'],
    industry: ['Educaation', 'Non-Profit', 'Retail'],
  },
  {
    id: 2,
    name: 'AlignedWorks',
    email: '',
    description: '',
    avatar_url: './src/assets/Avatars/alignedWorksLogoCompact.png',
    role: 'Venture Talent Network',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    skills: ['string'],
    industry: ['string'],
  },
  {
    id: 3,
    name: 'David Vader',
    email: 'david@aligned.works',
    description: '',
    avatar_url: './src/assets/Avatars/David_profile_pic.JPG',
    role: 'Founder',
    location: 'Mechanicsburg, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/davidtvader/',
    skills: ['Design & Creative', 'Development & IT'],
    industry: ['Education', 'Non-Profit'],
  },
  {
    id: 4,
    name: 'Leif Uptegrove',
    email: 'focalshine@gmail.com',
    description: '',
    avatar_url: './src/assets/Avatars/Profile-pic-Leif-Uptegrove.jpg',
    role: 'Tech Entrenpreneur',
    location: 'Somewhere, PA',
    member_since: '01-01-2023',
    linkedin: 'https://www.linkedin.com/in/leifuptegrove/',
    skills: ['Development & IT'],
    industry: ['string'],
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
    industry: ['Telecoms'],
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
    industry: ['Education'],
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
    industry: ['Non-Profit'],
  },
  // Add more user data as needed
];

export function MemberDirectory() {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formValues, setFormValues] = useState({
    id: '',
    name: '',
    email: '',
    description: '',
    avatar_url: '',
    role: '',
    location: '',
    member_since: '',
    linkedin: '',
    skills: [],
    industry: [],
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormValues(user);
    setModalOpened(true);
  };

  const handleFormChange = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleFormSubmit = () => {
    // Update the user data here
    setModalOpened(false);
  };

  return (
    <Container size="lg" py="xl">
      <Title order={1} align="left" mb="md" pt="xl" pb="xl">
        Member Directory
      </Title>
      <SimpleGrid cols={3} spacing="xl" breakpoints={[
        { maxWidth: 'md', cols: 2, spacing: 'md' },
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}>
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
              {user.email} • {user.role}
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
              data={skills}
              value={formValues.skills}
              onChange={(value) => handleFormChange('skills', value)}
            />
            <MultiSelect
              label="Industry"
              data={industries}
              value={formValues.industry}
              onChange={(value) => handleFormChange('industry', value)}
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