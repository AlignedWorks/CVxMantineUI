import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  Button,
  Loader,
  Paper,
  Title,
  SimpleGrid,
  Group,
  NumberInput,
} from '@mantine/core';
import { CollaborativeDataTreasury } from '../../data.ts';

export function EditCollaborativeTreasury() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataTreasury | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form values
  const [formValues, setFormValues] = useState<{
    collabAdminCompensationPercent: number;
  } | null>(null);

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null);
  }, [id, setCollaborativeId]);

  useEffect(() => {
    fetch(
      new URL(`collaboratives/${id}/treasury`, import.meta.env.VITE_API_BASE),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch collaborative data');
        }
        return response.json();
      })
      .then((data: CollaborativeDataTreasury) => {
        setCollaborative(data);
        setFormValues({
          collabAdminCompensationPercent: data.collabAdminCompensationPercent,
        });
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

  if (!collaborative || !formValues) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" c="red">
          Collaborative not found.
        </Text>
      </Container>
    );
  }

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update treasury data');
      }

      // Navigate back to treasury page on success
      navigate(`/collaboratives/${id}/treasury`);
    } catch (error) {
      console.error('Error updating treasury data:', error);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/collaboratives/${id}/treasury`);
  };

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={`/collaboratives/${id}/treasury`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      
      <Paper p="lg" withBorder mt="md">
        <Title order={2} mb="xl">
          Edit Treasury
        </Title>
        
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
          <div>
            {/* Revenue Share */}
            <Text fz="md" fw={500} mb="xs">
              Revenue Share
            </Text>

            {/* Indirect Costs */}
            <Text fz="md" fw={500} mb="xs">
              Indirect Costs
            </Text>

            {/* Collaborative Leader Compensation */}
            <Text fz="md" fw={500} mb="xs">
              Collaborative Leader Compensation
            </Text>
            <NumberInput
              value={formValues.collabAdminCompensationPercent}
              onChange={(value) => setFormValues({
                ...formValues,
                collabAdminCompensationPercent: typeof value === 'number' ? value : formValues.collabAdminCompensationPercent
              })}
              min={0}
              max={100}
              mb="lg"
              rightSection="%"
            />
          </div>
          
          <div>  
          </div>
        </SimpleGrid>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmit} 
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}