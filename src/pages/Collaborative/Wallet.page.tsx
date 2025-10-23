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
  Tooltip,
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
        console.error(error.errorMessage);
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

  // Generate table rows for launch token transactions if user is collab member
  const transactionRows = collaborative.userIsCollabMember ? collaborative.launchTokenTransactions.map((transaction) => {

    const projectDisplay = transaction.project || '—';
    const milestoneDisplay = transaction.milestone || '—';

    return (
      <Table.Tr key={transaction.id}>
        <Table.Td>{new Date(transaction.date).toLocaleDateString()}</Table.Td>
        <Table.Td>
          <Badge size="sm" variant="light" color={
            transaction.type === 'Milestone' ? 'blue' : 
            transaction.type === 'Project Admin' ? 'teal' : 'pink'
          }>
            {transaction.type}
          </Badge>
        </Table.Td>
        <Table.Td>{projectDisplay}</Table.Td>
        <Table.Td>{milestoneDisplay}</Table.Td>
        <Table.Td>
          <Text>
            {transaction.amount.toFixed(2)}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
   }) : [];

  // Calculate total number of user earned tokens from the collaborative of all transaction amounts if user is collab member
  const userEarnedTokensFromCollabTotal = collaborative.userIsCollabMember ? collaborative.launchTokenTransactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0) : 0;


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
              <Title order={1} visibleFrom="sm" mt="xs" mb="xl">
                {collaborative.name} Collaborative
              </Title>

              {collaborative.userIsCollabMember ? (
                <>
                <SimpleGrid cols={{ base: 1, sm: 1, md: 3 }} mb="md">
                  <div>
                    <Stack>
                      <Tooltip
                        color="gray"
                        label="Tokens permanently assigned to you for work or other contributions satisfactorily completed"
                        multiline
                        w={220}
                      >
                        <Text fz="md" fw={500} c="#999">My Earned Tokens</Text>
                      </Tooltip>
                      <Text fz="xl" fw={700} c="#444">{(userEarnedTokensFromCollabTotal).toFixed(2)}</Text>

                      <Tooltip
                        color="gray"
                        label="Tokens tentatively assigned to you for work or other contributions that are in process"
                        multiline
                        w={220}
                      >
                        <Text fz="md" fw={500} c="#999">My Pending Tokens</Text>
                      </Tooltip>
                      <Text fz="xl" fw={700} c="#444">+ {(collaborative.userAssignedLaunchTokens - userEarnedTokensFromCollabTotal).toFixed(2)}</Text>

                      <Tooltip color="gray" label="My Earned Tokens + My Pending Tokens">
                        <Text fz="md" fw={500} c="#999">My Assigned Tokens</Text>
                      </Tooltip>
                      <Text fz="xl" fw={700} c="#444">= {(collaborative.userAssignedLaunchTokens).toFixed(2)}</Text>
                    </Stack>
                  </div>
                  <div>
                    <Stack>
                      <Tooltip color="gray" label="All Earned Tokens + All Pending Tokens">
                        <Text fz="md" fw={500} c="#999">All Assigned Tokens</Text>
                      </Tooltip>
                      <Text fz="xl" fw={700} c="#444">{collaborative.allAssignedLaunchTokens.toLocaleString()}</Text>

                      <Text fz="md" fw={500} c="#999">All Launch Tokens</Text>
                      <Text fz="xl" fw={700} c="#444">{collaborative.launchTokensCreated.toLocaleString()}</Text>
                    </Stack>
                  </div>
                  <div>
                    <Stack>
                      <Tooltip
                        color="gray"
                        label="Your percent share of the payout to Token holders if the Tokens were retired today. This is calculated as [(My Assigned Tokens)/(All Assigned Tokens + Reserved Launch Tokens)] * 100"
                        multiline
                        w={220}
                      >
                        <Text fz="md" fw={500} c="#999">My Current Share</Text>
                      </Tooltip>
                      <Text fz="xl" fw={700} c="#444">{collaborative.userAssignedLaunchTokens ? Math.round(collaborative.userAssignedLaunchTokens / (collaborative.allAssignedLaunchTokens + collaborative.tokensPriorWork) * 100) : 0}%</Text>
                      
                      <Tooltip
                        color="gray"
                        label="Your percent share of the payout to Token holders if you earn no additional Tokens beyond those assigned to you today, and all available Tokens are eventually earned by someone. This is calculated as [(My Assigned Tokens)/(All Tokens)] * 100"
                        multiline
                        w={220}
                      >
                        <Text fz="md" fw={500} c="#999">My Minimum Share</Text>
                      </Tooltip>
                      <Text fz="xl" fw={700} c="#444">{(collaborative.userAssignedLaunchTokens / collaborative.launchTokensCreated * 100).toFixed(2)}%</Text>
                    </Stack>
                  </div>
                </SimpleGrid>
                
                <Title order={3} mt="lg" mb="md">
                  Token Transaction Ledger
                </Title>
                
                {collaborative.launchTokenTransactions.length > 0 ? (
                  <Table.ScrollContainer minWidth={500}>
                    <Table verticalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Type</Table.Th>
                          <Table.Th>Project</Table.Th>
                          <Table.Th>Milestone</Table.Th>
                          <Table.Th>Amount</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {transactionRows}
                        {/* Total row */}
                        <Table.Tr>
                          <Table.Td colSpan={4} style={{ textAlign: 'right'}}>
                            <Text fw={500} c="dimmed">Total:</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500}>  
                              {userEarnedTokensFromCollabTotal.toFixed(2)}
                            </Text>
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
                </>

              ) : (
                <Text size="lg" mt="xl">
                  You must be a member of this collaborative to have a wallet.
                </Text>
              )}

            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

    </Container>
  );
}