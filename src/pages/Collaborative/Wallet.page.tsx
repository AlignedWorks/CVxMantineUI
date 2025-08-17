import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import {
  Container,
  Text,
  Loader,
  Grid,
  Card,
  Stack,
  Title,
  Center,
  Table,
  Badge,
  SimpleGrid,
  Image,
 } from '@mantine/core';
import { CollaborativeDataWallet } from '../../data.ts';


export function CollaborativeMemberWallet() {
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWallet | null>(null);
  const [loading, setLoading] = useState(true);

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [id, setCollaborativeId]);

  useEffect(() => {
    fetch(
      new URL(`collaboratives/${id}/wallet`, import.meta.env.VITE_API_BASE),
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
      .then((data: CollaborativeDataWallet) => {
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

  // Generate table rows for launch token transactions
  const transactionRows = collaborative.launchTokenTransactions.map((transaction) => (
    <Table.Tr key={transaction.id}>
      <Table.Td>{new Date(transaction.date).toLocaleDateString()}</Table.Td>
      <Table.Td>{transaction.project}</Table.Td>
      <Table.Td>{transaction.milestone}</Table.Td>
      <Table.Td>
        <Badge color={transaction.amount > 0 ? 'green' : 'red'} variant="light">
          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  // Calculate total of all transaction amounts
  const totalAmount = collaborative.launchTokenTransactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);

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
              <Image
                w="80"
                src={collaborative.logoUrl}
                mt="xs"
                />
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
            <Stack>
                <Title order={2} ta="center" hiddenFrom="sm" mt="xs" mb="xl">
                {collaborative.name} Collaborative
              </Title>
              <Title order={2} visibleFrom="sm" mt="xs" mb="xl">
                {collaborative.name} Collaborative
              </Title>

              <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} mb="md">
                <div>
                    <Text fz="md" fw={500} c="#999">My Launch Tokens</Text>
                    <Text fz="xl" fw={700} c="#444">{(collaborative.userAssignedLaunchTokens).toFixed(2)}</Text>
                </div>
                <div>
                  <Text fz="md" fw={500} c="#999">All Assigned Launch Tokens</Text>
                  <Text fz="xl" fw={700} c="#444">{collaborative.allAssignedLaunchTokens.toLocaleString()}</Text>
                </div>
                <div>
                    <Text fz="md" fw={500} c="#999"> My Current Share</Text>
                    <Text fz="xl" fw={700} c="#444">{(collaborative.userAssignedLaunchTokens / collaborative.allAssignedLaunchTokens * 100).toFixed(2)}%</Text>
                </div>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} mb="md">
                <div>
                </div>
                <div>
                  <Text fz="md" fw={500} c="#999">All Launch Tokens</Text>
                  <Text fz="xl" fw={700} c="#444">{collaborative.launchTokensCreated.toLocaleString()}</Text>
                </div>
                <div>
                  <Text fz="md" fw={500} c="#999">My Minimum Share</Text>
                  <Text fz="xl" fw={700} c="#444">{(collaborative.userAssignedLaunchTokens / collaborative.launchTokensCreated * 100).toFixed(2)}%</Text>
                </div>
              </SimpleGrid>
              
              <Title order={3} mt="lg" mb="md">
                Launch Tokens Earned
              </Title>
              
              {collaborative.launchTokenTransactions.length > 0 ? (
                <Table.ScrollContainer minWidth={500}>
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Project</Table.Th>
                        <Table.Th>Milestone</Table.Th>
                        <Table.Th>Amount</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {transactionRows}
                      {/* Total row */}
                      <Table.Tr style={{ borderTop: '2px solid #dee2e6', fontWeight: 'bold' }}>
                        <Table.Td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                          Total:
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={totalAmount > 0 ? 'green' : totalAmount < 0 ? 'red' : 'gray'} 
                            variant="filled"
                            size="lg"
                          >
                            {totalAmount > 0 ? '+' : ''}{totalAmount}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              ) : (
                <Text c="dimmed" ta="center" mt="xl">
                  No launch token transactions found.
                </Text>
              )}

            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

    </Container>
  );
}