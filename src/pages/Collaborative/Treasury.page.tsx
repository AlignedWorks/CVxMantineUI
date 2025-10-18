import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  Button,
  Loader,
  Grid,
  Card,
  Stack,
  Title,
  SimpleGrid,
  Group,
  Tooltip,
  Center,
  Paper,
  Image,
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

  // avoid NaN when liabilities are zero/invalid
  const workingTokenRatio = (Number.isFinite(totalTokenAssets) && Number.isFinite(totalTokenLiabilities) && totalTokenLiabilities !== 0)
    ? totalTokenAssets / totalTokenLiabilities
    : 0;

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
        setTotalTokenLiabilities(data.tokensCollabAdmin + data.tokensNetworkFee + data.projectWorkPayment);
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
              <Title order={1} visibleFrom="sm" mt="xs" mb="md">
                {collaborative.name} Collaborative
              </Title>

              <Title order={4} mt="md">
                Launch Tokens
              </Title>

              <Title order={4} lts="1px" mt="sm" c="green">Financial Health Metrics</Title>
              <Paper p="lg" radius="md" bg="#fafafa">
                <SimpleGrid cols={{ base: 1, xs: 1, sm: 3 }}>
                  <div>
                    <Tooltip color="gray" label="(Total Token Assets) / (Total Token Liabilities)">
                      <Text fz="md" fw={500} c="#999">Working Token Ratio</Text>
                    </Tooltip>
                          <Text fz="xl" fw={700} c="#444">{Math.round(workingTokenRatio)}</Text>
                        </div>
                  <div>
                    <Tooltip color="gray" label="(Total Token Assets) - (Total Token Liabilities)">
                      <Text fz="md" fw={500} c="#999">Working Token Capital</Text>
                    </Tooltip>
                    <Text fz="xl" fw={700} c="#444">{Math.round(totalTokenAssets - totalTokenLiabilities)}</Text>
                  </div>
                  <div>
                    <Tooltip color="gray" label="(Current Token Balance) - (Total Token Liabilities)">
                      <Text fz="md" fw={500} c="#999">Net Token Assets</Text>
                    </Tooltip>
                    <Text fz="xl" fw={700} c="#444">{Math.round(collaborative.tokenBalance - totalTokenLiabilities)}</Text>
                  </div>
                </SimpleGrid>
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
                    {collaborative.nextTokenRelease === null ? (
                      <Tooltip
                        color="gray"
                        label="This date isn't set until the Collaborative is approved"
                        multiline
                        w={220}>
                        <Text fz="xl" fw={500} c="#444">N/A</Text>
                      </Tooltip>
                    ) : (
                      <Text fz="xl" fw={500} c="#444">{collaborative.nextTokenReleaseDate}</Text>
                    )}
                  </div>
                </SimpleGrid>
              </Paper>

              <SimpleGrid cols={{ base: 1, xs: 2 }} mt="xl" mb="md" spacing="xl">
                <div>
                  <Title order={4} lts="1px" c="blue">Current Token Assets</Title>
                  <Paper p="lg" withBorder radius="md" mb="xl" mt="lg">
                    <Stack>
                      <Tooltip
                        color="gray"
                          label="The number of Launch Tokens Created but not yet been released for use."
                          multiline
                          w={220}>
                        <Text fz="md" fw={500} c="#999">Tokens Receivable</Text>
                      </Tooltip>

                      <Text fz="xl" fw={500} c="#444">{collaborative.tokensReceivable}</Text>

                      <Tooltip
                        color="gray"
                        label="The number of tokens released for use and not yet paid to a Collaborative member."
                        multiline
                        w={220}>
                        <Text fz="md" fw={500} c="#999">Tokens Balance</Text>
                      </Tooltip>

                      <Text fz="xl" fw={500} c="#444">{(collaborative.tokenBalance).toFixed(2)}</Text>

                      <Tooltip color="gray" label="Tokens Receivable + Token Balance">
                        <Text fz="md" fw={500} c="red">Total Token Assets</Text>
                      </Tooltip>

                      <Text fz="xl" fw={500} c="#444">{totalTokenAssets.toFixed(2)}</Text>
                    </Stack>
                  </Paper>
                  <Text fz="md" fw={500} c="#999">Launch Token Price</Text>
                  <Text fz="xl" fw={700} c="#444">${(collaborative.tokenValue).toFixed(2)}</Text>
                </div>
                <div>
                  <Title order={4} lts="1px" c="blue">Current Token Liabilities</Title>
                  <Paper p="lg" withBorder radius="md" mb="sm" mt="lg">
                    <Stack>

                      <Tooltip
                        color="gray"
                        label={`Tokens budgeted to make future payments to the Collaborative Admin (${collaborative.collabAdminCompensationPercent}%) and Network (${collaborative.networkFeePercent}%).`}
                        multiline
                        w={220}>
                        <Text fz="md" fw={500} c="#999">Collaborative Admin + Network Fee</Text>
                      </Tooltip>
                      <Text fz="xl" fw={500} c="#444">{(collaborative.tokensCollabAdmin * (1 + collaborative.tokensNetworkFee)).toFixed(2)}</Text>

                      <Tooltip
                        color="gray"
                        label="All unpaid Tokens in approved budgets to cover Project management and milestone completion."
                        multiline
                        w={220}>
                        <Text fz="md" fw={500} c="#999">Project Work</Text>
                      </Tooltip>
                      <Text fz="xl" fw={500} c="#444">{collaborative.projectWorkPayment.toFixed(2)}</Text>

                      <Text fz="md" fw={500} c="red">Total Token Liabilities</Text>
                      <Text fz="xl" fw={500} c="#444">{totalTokenLiabilities.toFixed(2)}</Text>
                    </Stack>
                  </Paper>
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