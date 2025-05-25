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
  Select,
  Table,
  ActionIcon,
  TextInput,
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { CollaborativeDataTreasury, PayoutFrequency } from '../../data.ts';

export function EditCollaborativeTreasury() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataTreasury | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form values
  const [formValues, setFormValues] = useState<{
    revenueShare: number;
    payoutFrequency: PayoutFrequency;
    indirectCosts: number;
    collabLeaderCompensation: number;
    stakingTiers: { tier: string; exchangeRate: number; }[];
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
          revenueShare: data.revenueShare,
          payoutFrequency: data.payoutFrequency,
          indirectCosts: data.indirectCosts,
          collabLeaderCompensation: data.collabLeaderCompensation,
          stakingTiers: [...data.stakingTiers], // Create a new array to avoid mutations
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

  const handleAddStakingTier = () => {
    setFormValues({
      ...formValues,
      stakingTiers: [
        ...formValues.stakingTiers,
        { tier: '1 Month', exchangeRate: 0.01 }
      ]
    });
  };

  const handleRemoveStakingTier = (index: number) => {
    const newStakingTiers = [...formValues.stakingTiers];
    newStakingTiers.splice(index, 1);
    setFormValues({
      ...formValues,
      stakingTiers: newStakingTiers
    });
  };

  const updateStakingTier = (index: number, field: 'tier' | 'exchangeRate', value: string | number) => {
    const newStakingTiers = [...formValues.stakingTiers];
    newStakingTiers[index] = {
      ...newStakingTiers[index],
      [field]: value
    };
    setFormValues({
      ...formValues,
      stakingTiers: newStakingTiers
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        new URL(`collaboratives/${id}/treasury`, import.meta.env.VITE_API_BASE),
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
        &larr; Back to Treasury
      </Link>
      
      <Paper p="lg" withBorder mt="md">
        <Title order={2} mb="xl">
          Edit Treasury Settings
        </Title>
        <Title order={4} mb="md">
          Revenue Sharing Pool
        </Title>
        
        <SimpleGrid cols={2} mb="md">
          <div>
            {/* Revenue Share */}
            <Text fz="md" fw={500} mb="xs">
              Revenue Share
            </Text>
            <NumberInput
              value={formValues.revenueShare}
              onChange={(value) => setFormValues({
                ...formValues,
                revenueShare: typeof value === 'number' ? value : formValues.revenueShare
              })}
              min={0}
              max={100}
              mb="lg"
              rightSection="%"
            />

            {/* Payout Frequency */}
            <Text fz="md" fw={500} mb="xs">
              Payout Frequency
            </Text>
            <Select
              value={formValues.payoutFrequency}
              onChange={(value) => setFormValues({
                ...formValues,
                payoutFrequency: value as PayoutFrequency
              })}
              data={[
                { value: PayoutFrequency.Monthly, label: 'Monthly' },
                { value: PayoutFrequency.Quarterly, label: 'Quarterly' },
                { value: PayoutFrequency.Yearly, label: 'Yearly' },
              ]}
              mb="lg"
            />

            {/* Indirect Costs */}
            <Text fz="md" fw={500} mb="xs">
              Indirect Costs
            </Text>
            <NumberInput
              value={formValues.indirectCosts}
              onChange={(value) => setFormValues({
                ...formValues,
                indirectCosts: typeof value === 'number' ? value : formValues.indirectCosts
              })}
              min={0}
              max={100}
              mb="lg"
              rightSection="%"
            />

            {/* Collaborative Leader Compensation */}
            <Text fz="md" fw={500} mb="xs">
              Collaborative Leader Compensation
            </Text>
            <NumberInput
              value={formValues.collabLeaderCompensation}
              onChange={(value) => setFormValues({
                ...formValues,
                collabLeaderCompensation: typeof value === 'number' ? value : formValues.collabLeaderCompensation
              })}
              min={0}
              max={100}
              mb="lg"
              rightSection="%"
            />
          </div>
          
          <div>
            <Group justify="space-between" mb="xs">
              <Text fz="md" fw={500}>
                Staking Tiers
              </Text>
              <Button 
                leftSection={<IconPlus size={16} />} 
                variant="light" 
                onClick={handleAddStakingTier}
                size="xs"
              >
                Add Tier
              </Button>
            </Group>
            
            <Table variant="vertical" layout="fixed" withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Duration</Table.Th>
                  <Table.Th>Exchange Rate</Table.Th>
                  <Table.Th style={{ width: '80px' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {formValues.stakingTiers.map((tier, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <TextInput
                        value={tier.tier}
                        onChange={(e) => updateStakingTier(index, 'tier', e.target.value)}
                        size="xs"
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        value={tier.exchangeRate * 100} // Convert to percentage for display
                        onChange={(value) => {
                          const numValue = typeof value === 'number' ? value : 0;
                          updateStakingTier(index, 'exchangeRate', numValue / 100); // Convert back to decimal
                        }}
                        rightSection="%"
                        size="xs"
                        min={0}
                        max={100}
                      />
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon 
                        color="red" 
                        onClick={() => handleRemoveStakingTier(index)}
                        variant="subtle"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </SimpleGrid>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
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