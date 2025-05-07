import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import {
  Container,
  Text,
  Badge,
  Button,
  Loader,
  Space,
  Group,
  Grid,
  Tooltip,
 } from '@mantine/core';
import { CollaborativeData } from '../../data.ts';
import {
  IconAt,
  IconMapPin,
} from '@tabler/icons-react'

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
      <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Text fz="40px" c="#222" mb="xl">
        {collaborative.name}
      </Text>
      <Space h="xl" />
      <Space h="lg" />
      <Grid>
        <Grid.Col span={6}>
            <Text size="md" mb="md">
              {collaborative.description}
            </Text>
            <Group wrap="nowrap" gap={10} mt={3}>
                <IconAt stroke={1.5} size={16} />
                <a
                  href={collaborative.websiteUrl}
                  style={{ color: '#0077b5', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer">
                    {collaborative.websiteUrl}
                </a>
            </Group>
            <Group wrap="nowrap" gap={10} mt={5}>
                <IconMapPin stroke={1.5} size={16} />
                <Text>
                  {collaborative.city}, {collaborative.state}
                </Text>
            </Group>
        </Grid.Col>
        <Grid.Col span={4}>
            <Text c="dimmed" mb="md">
                Leader: {collaborative.leaderEmail}
            </Text>
            <Text c="dimmed" mb="md">
                Created: {new Date(collaborative.createdAt).toLocaleDateString()}
            </Text>
            <Text c="dimmed" mb="md">
                Skills<br/>
                {collaborative.skills.map((skill, index) => (
                  <Badge key={index} variant="light" color="blue">
                    {skill}
                  </Badge>
                ))}
            </Text>
            <Text c="dimmed" mb="md">
                Experience<br/>
                {collaborative.experience.map((exp, index) => (
                  <Badge key={index} variant="light" color="green">
                    {exp}
                  </Badge>
                ))}
            </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Tooltip label="This ability is only allowed for Collab Leaders">
            <Button data-disabled mb="md" onClick={(event) => event.preventDefault()}>
              Edit Collaborative
            </Button>
          </Tooltip>
            <Button variant="default" mb="md">
                Add Collaborative
            </Button>
            <Button variant="default" mb="md">
                Add Project
            </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
}