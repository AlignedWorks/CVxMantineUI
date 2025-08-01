import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  Button,
  Loader,
  Grid,
  Table,
  Card,
  Stack,
  Title,
  SimpleGrid,
  Group,
  Tooltip,
  Center,
 } from '@mantine/core';
import { CollaborativeDataTreasury } from '../../data.ts';

export function CollaborativeTreasury() {
  // const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataTreasury | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the "from" state or default to a fallback
  // const from = location.state?.from || '/collaborative-directory';

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
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
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch collaborative data');
        }
        return response.json();
      })
      .then((data: CollaborativeDataTreasury) => {
        console.log(data);
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

  const stakingTierRows = collaborative.stakingTiers.map((item) => (
    <Table.Tr>
        <Table.Td>
          {item.tier}
        </Table.Td>
        <Table.Td>
          {(Number(item.exchangeRate) * 100).toFixed(0)}%
        </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={`/collaboratives/${id}`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
            <Center>
              <img src={collaborative.logoUrl} width={80}/>
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
              <Title order={2} ta="center" hiddenFrom="sm" mt="xs" mb="xl">
                {collaborative.name} Collaborative
              </Title>
              <Title order={2} visibleFrom="sm" mt="xs" mb="md">
                {collaborative.name} Collaborative
              </Title>
              <Title order={4} mb="xl">
                  Revenue Sharing Pool
              </Title>
              <SimpleGrid cols={{ base: 1, xs: 2 }} mb="md">
                <div>
                  <Text fz="md" fw={500}>
                    Revenue Share
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.revenueShare}%
                  </Text>
                  <Text fz="md" fw={500}>
                      Payout Frequency
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.payoutFrequency}
                  </Text>
                  <Text fz="md" fw={500}>
                      Indirect Costs
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.indirectCosts}%
                  </Text>
                  <Text fz="md" fw={500}>
                      Collaborative Admin Compensation
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.collabLeaderCompensation}%
                  </Text>
                </div>
                <div>
                  <Text fz="md" fw={500} mb="lg">
                      Staking Tiers
                  </Text>
                  <Table variant="vertical" layout="fixed" withTableBorder>
                   <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Duration</Table.Th>
                        <Table.Th>Exchange Rate</Table.Th>
                    </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{stakingTierRows}</Table.Tbody>
                  </Table>
                </div>
              </SimpleGrid>
              <Title order={4} mb="md">
                Launch Tokens
              </Title>
              <SimpleGrid cols={{ base: 1, xs: 2 }} mb="md">
                <div>
                  <Text fz="md" fw={500}>
                      Next Token Release Date
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.nextTokenReleaseDate}
                  </Text>
                  <Text fz="md" fw={500}>
                      Next Token Release
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.nextTokenRelease}
                  </Text>
                  <Text fz="md" fw={500}>
                      Current Token Release
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.currentTokenRelease}
                  </Text>
                </div>
                <div>
                  <Text fz="md" fw={500}>
                      Collaborative Admin Compensation (Launch tokens)
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.tokensCollabAdmin}
                  </Text>
                  <Text fz="md" fw={500}>
                      Launch Tokens Receivable
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.tokensReceivable}
                  </Text>
                  <Text fz="md" fw={500}>
                      Launch Tokens Balance
                  </Text>
                  <Text fz="xl" c="#222" mb="lg">
                    {collaborative.tokenBalance}
                  </Text>
                </div>
                <div>
                </div>
              </SimpleGrid>
            </Stack>
          </Grid.Col>
          <Grid.Col span={1}>
          </Grid.Col>
        </Grid>
      </Card>

      {collaborative.userIsCollabAdmin ? (
        <Group justify="right">
          <Button 
            variant="default" 
            mb="sm"
            onClick={() => navigate(`/collaboratives/${id}/treasury/edit`)}
          >
            Edit Treasury Info
          </Button>
        </Group>
      ) : (
        <Group justify="right">
          <Tooltip label="Only collaborative admins can edit this information">
            <Button disabled mb="sm">
              Edit Treasury Info
            </Button>
          </Tooltip>
        </Group>
      )}

    </Container>
  );
}