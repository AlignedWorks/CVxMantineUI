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
  Paper,
 } from '@mantine/core';
import { CollaborativeDataTreasury } from '../../data.ts';

export function CollaborativeTreasury() {
  // const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataTreasury | null>(null);
  const [totalTokenAssets, setTotalTokenAssets] = useState<number>(0);
  const [totalTokenLiabilities, setTotalTokenLiabilities] = useState<number>(0);
  // const [from, setFrom] = useState<string | null>(null);
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
        setTotalTokenAssets(data.tokensReceivable + data.tokenBalance);
        setTotalTokenLiabilities(data.collabLeaderCompensation + data.projectWorkPayment + data.nonTeamContributions);
        // setFrom(location.state?.from || '/collaborative-directory');
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

              <Title order={4} mt="md">
                Launch Tokens
              </Title>

              <Title order={4} lts="1px" mt="sm" c="green">Financial Health Metrics</Title>
              <Paper p="lg" radius="md" bg="#fafafa">
                  <Group justify="space-between">
                      <div>
                          <Text fz="md" fw={500} c="#999">Working Token Ratio</Text>
                          <Text fz="xl" fw={700} c="#444">{(totalTokenAssets / totalTokenLiabilities).toFixed(2)}</Text>
                      </div>
                      <div>
                          <Text fz="md" fw={500} c="#999">Working Token Capital</Text>
                          <Text fz="xl" fw={700} c="#444">{totalTokenAssets - totalTokenLiabilities}</Text>
                      </div>
                      <div>
                          <Text fz="md" fw={500} c="#999">Net Token Assets</Text>
                          <Text fz="xl" fw={700} c="#444">{collaborative.tokenBalance - totalTokenLiabilities}</Text>
                      </div>
                  </Group>
              </Paper>
              <Title order={4} lts="1px" mt="xl" c="green">Launch Token Release</Title>
              <Paper p="lg" radius="md" bg="#fafafa">
                  <SimpleGrid cols={{ base: 1, xs: 1, sm: 3 }}>
                      <div>
                          <Text fz="md" fw={500} c="#999">Current Token Release</Text>
                          <Text fz="xl" fw={500} c="#444">{collaborative.currentTokenRelease}</Text>
                      </div>
                      <div>
                          <Text fz="md" fw={500} c="#999">Next Token Release</Text>
                          <Text fz="xl" fw={500} c="#444">{collaborative.nextTokenRelease}</Text>
                      </div>
                      <div>
                          <Text fz="md" fw={500} c="#999">Date of Next Release</Text>
                          <Text fz="xl" fw={500} c="#444">{collaborative.nextTokenReleaseDate}</Text>
                      </div>
                  </SimpleGrid>

              </Paper>
              <SimpleGrid cols={{ base: 1, xs: 2 }} mt="xl" mb="md" spacing="xl">
                  <div>
                      <Title order={4} lts="1px" c="blue">Current Token Assets</Title>
                      <Paper p="lg" withBorder radius="md" mb="xl" mt="lg">
                          <Stack>
                              <Text fz="md" fw={500} c="#999">Launch Tokens Receivable</Text>
                              <Text fz="xl" fw={500} c="#444">{collaborative.tokensReceivable}</Text>
                              <Text fz="md" fw={500} c="#999">Launch Tokens Balance</Text>
                              <Text fz="xl" fw={500} c="#444">{collaborative.tokenBalance}</Text>
                              <Text fz="md" fw={500} c="red">Total Token Assets</Text>
                              <Text fz="xl" fw={500} c="#444">{totalTokenAssets}</Text>
                          </Stack>
                      </Paper>
                  </div>
                  <div>
                      <Title order={4} lts="1px" c="blue">Current Token Liabilities</Title>
                      <Paper p="lg" withBorder radius="md" mb="sm" mt="lg">
                          <Stack>
                              <Text fz="md" fw={500} c="#999">Launch Tokens committed to pay the Collaborative Leader</Text>
                              <Text fz="xl" fw={500} c="#444">{collaborative.collabLeaderCompensation}</Text>
                              <Text fz="md" fw={500} c="#999">Launch Tokens committed for the payment of Project work upon completion</Text>
                              <Text fz="xl" fw={500} c="#444">{collaborative.projectWorkPayment}</Text>
                              <Text fz="md" fw={500} c="#999">Launch Tokens committed to pay for Non-Team Contributions to Projects</Text>
                              <Text fz="xl" fw={500} c="#444">{collaborative.nonTeamContributions}</Text>
                              <Text fz="md" fw={500} c="red">Total Token Liabilities</Text>
                              <Text fz="xl" fw={500} c="#444">{totalTokenLiabilities}</Text>
                          </Stack>
                      </Paper>
                  </div>
                  <div>
                  </div>
              </SimpleGrid>

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