import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import {
  Container,
  Title,
  Text,
  Badge,
  SimpleGrid,
  Loader,
 } from '@mantine/core';
import { CollaborativeData } from '../../data.ts';
import { IconArrowNarrowLeft } from '@tabler/icons-react';

export function CollaborativeHome() {
  const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the "from" state or default to a fallback
  const from = location.state?.from || '/collaborative-directory';

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [id, setCollaborativeId]);

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
        <Text size="lg" c="red">
          Collaborative not found.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <IconArrowNarrowLeft />
      <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
        Back
      </Link>
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