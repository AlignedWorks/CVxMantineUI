import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text, Badge, SimpleGrid, Loader } from '@mantine/core';
import { CollaborativeData } from '../../data.ts';

export function CollaborativeHome() {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching collaborative data by ID
    fetch(`https://cvx.jordonbyers.com/collaboratives/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch collaborative data');
        }
        return response.json();
      })
      .then((data: CollaborativeData) => {
        setCollaborative(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  if (!collaborative) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" color="red">
          Collaborative not found.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="md">
        {collaborative.name}
      </Title>
      <Text size="md" mb="md">
        {collaborative.description}
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Leader: {collaborative.leaderEmail}
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Created At: {new Date(collaborative.createdAt).toLocaleDateString()}
      </Text>
      <Title order={3} mt="lg" mb="sm">
        Skills
      </Title>
      <SimpleGrid cols={3} spacing="sm">
        {collaborative.skills.map((skill, index) => (
          <Badge key={index} variant="light" color="blue">
            {skill}
          </Badge>
        ))}
      </SimpleGrid>
      <Title order={3} mt="lg" mb="sm">
        Experience
      </Title>
      <SimpleGrid cols={3} spacing="sm">
        {collaborative.experience.map((exp, index) => (
          <Badge key={index} variant="light" color="green">
            {exp}
          </Badge>
        ))}
      </SimpleGrid>
    </Container>
  );
}