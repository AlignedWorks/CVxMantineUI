import { Container, Paper, Avatar, Title, Text, Group, Button, Badge, SimpleGrid } from '@mantine/core';
import { IconBrandLinkedin } from '@tabler/icons-react';

const user = {
  id: 1,
  name: 'Gary Hartis',
  email: 'gerry@aligned.works',
  description: 'Founder and visionary leader with a passion for education and non-profit sectors.',
  avatar_url: './src/assets/Avatars/profile-pic-Gerry-Hartis.jpeg',
  role: 'Founder',
  location: 'Somewhere, PA soon to be SC',
  member_since: '01-01-2023',
  linkedin: 'https://www.linkedin.com/in/garyhartis/',
  skills: ['Design & Creative'],
  industry: ['Education', 'Non-Profit', 'Retail'],
};

export function UserProfile() {
  return (
    <Container size="sm" py="xl">
      <Paper radius="md" withBorder p="xl" shadow="md">
        <Group position="center" direction="column" spacing="xs">
          <Avatar src={user.avatar_url} size={120} radius={120} />
          <Title order={2}>{user.name}</Title>
          <Text color="dimmed">{user.role}</Text>
          <Text color="dimmed">{user.location}</Text>
          <Button
            component="a"
            href={user.linkedin}
            target="_blank"
            leftSection={<IconBrandLinkedin size={18} />}
            variant="outline"
            color="blue"
          >
            LinkedIn
          </Button>
        </Group>

        <Text mt="md" align="center">
          {user.description}
        </Text>

        <SimpleGrid cols={2} spacing="md" mt="xl">
          <div>
            <Title order={4}>Skills</Title>
            <Group spacing="xs" mt="xs">
              {user.skills.map((skill) => (
                <Badge key={skill} color="blue" variant="light">
                  {skill}
                </Badge>
              ))}
            </Group>
          </div>
          <div>
            <Title order={4}>Industry</Title>
            <Group spacing="xs" mt="xs">
              {user.industry.map((industry) => (
                <Badge key={industry} color="green" variant="light">
                  {industry}
                </Badge>
              ))}
            </Group>
          </div>
        </SimpleGrid>

        <Group position="center" mt="xl">
          <Button variant="light" color="gray">
            Edit Profile
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}