import { 
  Container,
  Title,
  SimpleGrid,
  Text,
  Grid,
  Table,
  Avatar,
  Select,
  Group,
  Card,
  Button,
  Space,
  Tooltip,
} from '@mantine/core';
import { mock_collab_data, users } from '../data.ts';
import classes from './Test.module.css';

const networkRoles = [
    'Applicant',
    'ApplicantDenied',
    'NetworkOwner',
    'NetworkContributor'
]

const data = [
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
      name: 'Robert Wolfkisser',
      job: 'Engineer',
      email: 'rob_wolf@gmail.com',
      role: 'Collaborative Leader',
      inviteStatus: 'Accepted',
      lastActive: '2 days ago',
      active: true,
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
      name: 'Jill Jailbreaker',
      job: 'Engineer',
      email: 'jj@breaker.com',
      role: 'Collaborative Leader',
      lastActive: '6 days ago',
      inviteStatus: 'Invited',
      active: true,
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
      name: 'Henry Silkeater',
      job: 'Designer',
      email: 'henry@silkeater.io',
      role: 'Collaborative Member',
      lastActive: '2 days ago',
      inviteStatus: 'Accepted',
      active: false,
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
      name: 'Bill Horsefighter',
      job: 'Designer',
      email: 'bhorsefighter@gmail.com',
      role: 'Collaborative Member',
      lastActive: '5 days ago',
      inviteStatus: 'Invited',
      active: true,
    },
    {
      avatar:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
      name: 'Jeremy Footviewer',
      job: 'Manager',
      email: 'jeremy@foot.dev',
      role: 'Collaborative Member',
      lastActive: '3 days ago',
      inviteStatus: 'Accepted',
      active: false,
    },
];
  
const collabRoles = ['Collaborative Leader','Collaborative Member'];
const inviteStatus = ['Invited','Accepted','Declined']
  

export function Test() {

    const rows = data.map((item) => (
        <Table.Tr key={item.name}>
          <Table.Td>
            <Group gap="sm">
              <Avatar size={40} src={item.avatar} radius={40} />
              <div>
                <Text fz="sm" fw={500}>
                  {item.name}
                </Text>
                <Text fz="xs" c="dimmed">
                  {item.email}
                </Text>
              </div>
            </Group>
          </Table.Td>
          <Table.Td>
                <Select
                data={collabRoles}
                defaultValue={item.role}
                variant="unstyled"
                allowDeselect={false}
                />
            </Table.Td>
            <Table.Td>
                <Select
                data={inviteStatus}
                defaultValue={item.inviteStatus}
                variant="unstyled"
                allowDeselect={false}
                />
            </Table.Td>
        </Table.Tr>
      ));

    return (
        <Container size="md" py="xl">
            <Title order={1} mb="sm" pt="sm" pb="xl">
                Dashboard
            </Title>

            <Title order={3} mb="md" pt="sm" pb="lg">
                Approve Collaboratives
            </Title>
            {mock_collab_data.map((collab) => (
                <Card key={collab.id} className={classes.card} shadow="sm" radius="md" withBorder mt="lg" p="lg" bg="var(--mantine-color-body)">
                    <SimpleGrid cols={3} spacing="xl">
                        <div>
                            <Text ta="left" fz="lg" fw={500} mb="lg">
                                {collab.name}
                            </Text>
                            <Text ta="left" c="dimmed" fz="sm">
                                {collab.description}
                            </Text>
                            <Text ta="left" fz="sm" mt="sm">
                                <span style={{ color: "var(--mantine-color-dimmed)" }}>Website:</span><br/>www.website.com
                            </Text>
                            <Text ta="left" fz="sm" mt="sm">
                                <span style={{ color: "var(--mantine-color-dimmed)" }}>Collab Leader:</span><br/>{collab.leaderEmail}
                            </Text>
                            
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                            <Table variant="vertical" layout="fixed" withTableBorder>
                                <Table.Tbody>

                                    <Table.Tr>
                                    <Table.Th>Shared Revenue</Table.Th>
                                    <Table.Td>{collab.revenueShare}%</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>Payout Frequency</Table.Th>
                                    <Table.Td>{collab.payoutFrequency}</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>Indirect Costs</Table.Th>
                                    <Table.Td>{collab.indirectCosts}%</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>Leader Compensation</Table.Th>
                                    <Table.Td>{collab.collabLeaderCompensation}%</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>Proposed On</Table.Th>
                                    <Table.Td>{collab.createdAt}</Table.Td>
                                    </Table.Tr>
                                    
                                </Table.Tbody>
                            </Table>
                        </div>
                        <div>
                            <Title order={6}>
                            Staking Tiers
                            </Title>
                            
                            <Table variant="vertical" layout="fixed" withTableBorder mt="lg">
                                <Table.Tbody>

                                    <Table.Tr>
                                    <Table.Th>Duration</Table.Th>
                                    <Table.Td>Exchange Rate</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>One Month</Table.Th>
                                    <Table.Td>100%</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>Two Months</Table.Th>
                                    <Table.Td>80%</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>One Quarter</Table.Th>
                                    <Table.Td>70%</Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                    <Table.Th>One Year</Table.Th>
                                    <Table.Td>40%</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </div>
                        
                    </SimpleGrid>
                    <Grid>
                        <Grid.Col span={4}>
                            <SimpleGrid cols={2} mt="lg">
                                <Button variant="default">Approve</Button>
                                <Button variant="default">Decline</Button>
                            </SimpleGrid>
                        </Grid.Col>
                        <Grid.Col span={8} mt="lg">
                        </Grid.Col>
                    </Grid>

                </Card>
            ))}

            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
                {users.map((user) => (
                    <Card key={user.id} shadow="sm" radius="md" mt="xl" withBorder>
                        <Grid>
                            <Grid.Col span={4} mt="sm" mb="lg">
                                <Avatar src={user.avatar_url} size={60} radius="xl" mx="auto"/>
                            </Grid.Col>
                            <Grid.Col span={8} mt="sm">
                                <Text size="lg" fw={500}>
                                    {user.name}
                                </Text>
                                <Tooltip label={user.email} color="gray">
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {user.email}
                                    </Text>
                                </Tooltip>
                                <Text size="sm" c="dimmed">
                                    <a
                                        href={user.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#0077b5", textDecoration: "none" }}
                                    >
                                        LinkedIn
                                </a>
                                </Text>
                            </Grid.Col>
                        </Grid>
                        <Text fw={500} mt="md">
                            Bio
                        </Text>
                        <Tooltip label={user.description || 'No bio available'} multiline w={300} position="bottom" color="gray">
                            <Text
                                size="sm"
                                c="dimmed"
                                style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3, // Limit to 3 lines
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minHeight: '3.6em', // Ensure consistent height for 3 lines of text
                                lineHeight: '1.2em', // Adjust line height to match the text
                                }}
                            >
                                {user.description || '\u00A0\u00A0\u00A0'} {/* Render empty space if no bio */}
                            </Text>
                        </Tooltip>
                        
                    <Select
                        mt="md"
                        label="User Status"
                        data={['Applicant', 'Applicant Denied', 'Network Owner', 'Network Contributor']}
                        defaultValue="Applicant"
                    />
                    <Button variant="outline" color="gray" size="sm" mt="md">
                        Submit
                    </Button>
                    </Card>
                ))}
            </SimpleGrid>

            {users.map((user) => (
                <Card key={user.id} shadow="sm" radius="md" mt="xl" withBorder>
                    <SimpleGrid cols={3}>
                        <div>
                            <Grid>
                                <Grid.Col span={4} mt="md" mb="lg">
                                    <Avatar src={user.avatar_url} size={60} radius="xl" mx="auto"/>
                                </Grid.Col>
                                <Grid.Col span={8} mt="md">
                                    <Text size="lg" fw={500}>
                                        {user.name}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {user.email}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                    LinkedIn: {' '}
                                    <a
                                        href={user.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#0077b5', textDecoration: 'none' }}
                                    >
                                        {user.linkedin.split('/').pop()} {/* Extracts the username from the URL */}
                                    </a>
                                </Text>
                                </Grid.Col>
                            </Grid>
                        </div>
                        <div>
                            <Text size="sm" c="dimmed">
                                {user.description}
                            </Text>
                        </div>
                        <div>
                        <Select
                            mt="md"
                            label="User Status"
                            comboboxProps={{ withinPortal: true }}
                            data={networkRoles}
                            defaultValue={networkRoles[0]}
                            classNames={classes}
                        />
                        <Button variant="outline" color="gray" size="xs" mt="sm">
                            Submit
                        </Button>
                        </div>        
                    </SimpleGrid>
                </Card>
            ))}

            <Text fz="40px" c="#222" mb="xl" mt="xl">
                ByteSecure Collective
            </Text>
            <Space h="xl" />
            <Grid>
                <Grid.Col span={6}>
                    <Text size="md" mb="md">
                        A cybersecurity-focused group tackling modern threats with cutting-edge defense strategies.
                    </Text>
                    <Text c="dimmed" mb="md" mt="lg">
                        Website: www.bytesecure.net
                    </Text>
                    <Text c="dimmed" mb="md" mt="lg">
                        Location: Plano, TX
                    </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Text c="dimmed" mb="md">
                        Leader: Jordon Byers
                    </Text>
                    <Text c="dimmed" mb="md">
                        Created: 5/27/25
                    </Text>
                    <Text c="dimmed" mb="md">
                        Skills: Design & Creative
                    </Text>
                    <Text c="dimmed" mb="md">
                        Experience: Education, Non-Profit
                    </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Button variant="default" mb="sm">
                        Edit Collaborative
                    </Button>
                    <Button variant="default" mb="sm">
                        Add Collaborative
                    </Button>
                    <Button variant="default" mb="sm">
                        Add Project
                    </Button>
                    <Button variant="default">
                        Join
                    </Button>
                </Grid.Col>
            </Grid>

            <Title order={4} c="#45a6b7" mb="md">Members</Title>
            <Table.ScrollContainer minWidth={400}>
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Member</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
            
        </Container>
    );
}