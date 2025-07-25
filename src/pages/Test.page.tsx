import { useState } from 'react';
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
  Paper,
  Button,
  Space,
  Badge,
  TextInput,
  Modal,
  Loader,
  Divider,
  Stack,
  Center,
  Tooltip,
  Progress,
} from '@mantine/core';
import { mock_collab_data, User, users, inviteStatusColors } from '../data.ts';
import { Link } from 'react-router-dom';
import classes from './Test.module.css';
import {
    IconAt,
    IconMapPin,
  } from '@tabler/icons-react'

const rolesData = ['Network Owner','Network Contributor']

const testCollab = mock_collab_data[0]

export function Test() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users
    const [loadingUsers, setLoadingUsers] = useState(false); // Track loading state
    const [searchQuery, setSearchQuery] = useState(''); // For the search input
    const [selectedUser, setSelectedUser] = useState<User>(); // For the selected user
    const [selectedRole, setSelectedRole] = useState(''); // For the selected role
    const [successMessage, setSuccessMessage] = useState(''); // For the success message
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState(false);
    const [inviteError, setInviteError] = useState('');

    const fetchAllUsers = async () => {
        setLoadingUsers(true);
        try {
          const response = await fetch('https://cvx.jordonbyers.com/members', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            setAllUsers(users);
            throw new Error('Failed to fetch users');

          }
          const data = await response.json();
            setAllUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setAllUsers(users);
        } finally {
            setLoadingUsers(false);
        }
    };

    const filteredUsers = allUsers.filter((user) =>
    `${user.name} ${user.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    const handleAddMember = () => {
    if (!selectedUser || !selectedRole) return;
    
    // Simulate adding the user to the collaborative
    console.log(`Adding user ${selectedUser.id} as ${selectedRole}`);
    
    // Show success message
    setSuccessMessage(
        `${selectedUser.name} has been added as a ${selectedRole}.`
    );
    
    // Reset selections
    setSelectedUser(undefined);
    setSelectedRole('');
    };

    const handleInviteSubmit = () => {
    fetch(new URL('invite', import.meta.env.VITE_API_BASE), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log('Invitation sent successfully:', data);
            setInviteSuccess(true);
            setInviteError('');
            setInviteEmail(''); // Clear the input field
        })
        .catch((err) => {
            console.error('Error sending invitation:', err);
            setInviteSuccess(false);
            setInviteError('Failed to send the invitation. Please try again.');
        });
    };

    const rows = users.map((item) => (
        <Table.Tr key={item.name}>
            <Table.Td style={{ verticalAlign: 'top' }}>
            <Group gap="sm" ml="lg" mt="sm" mb="sm">
                <Avatar size={40} src={item.avatar_url} radius={40} />
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
            <Table.Td >
                {item.name == 'David Vader'
                    ? <Text>Network Contributor</Text>
                    : <Select
                        data={rolesData}
                        defaultValue={'Network Contributor'}
                        variant="unstyled"
                        allowDeselect={false}
                    />
                }
            </Table.Td>
            <Table.Td>
                <Badge
                    color={inviteStatusColors[item.invite_status] || 'gray'} // Default to 'gray' if status is unknown
                    fullWidth variant="light">
                    {item.invite_status}
                </Badge>
            </Table.Td>
        </Table.Tr>
      ));

    return (
        
        <Container size="md">
            <Title order={3} mt="lg" mb="md" pt="sm" pb="lg">
                Invite Someone to the Site
            </Title>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleInviteSubmit();
                }}
                >
                <Stack>
                    <TextInput
                    label="Email Address"
                    placeholder="Enter the email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.currentTarget.value)}
                    required
                    />
                    <Button type="submit" variant="default">
                    Send Invitation
                    </Button>
                    {inviteSuccess && (
                    <Text size="sm" c="green">
                        Invitation sent successfully!
                    </Text>
                    )}
                    {inviteError && (
                    <Text size="sm" c="red">
                        {inviteError}
                    </Text>
                    )}
                </Stack>
                </form>
            </Card>

            
            <Text fz="h5" c="dimmed" mt="lg">HOME  |  MILESTONES  |  MEMBERS  |  BUDGET</Text>
            <h5>HOME  |  MILESTONES  |  MEMBERS  |  BUDGET</h5>

            <Card padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx" pr="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                        <Center>
                        <img src={testCollab.logoUrl} width={80}/>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
                        <Stack>
                        <Title order={2} mt="xs" mb="xl">
                            {testCollab.name} Collaborative
                        </Title>
                        <Group justify="space-between">
                            <Text fz="md" fw={500} c="green">Tokens Released this Cycle: 1000</Text>
                            <Text fz="md" fw={500} c="#333">Total Tokens: 10,000</Text>
                        </Group>
                        <Progress.Root size="xl">
                            <Progress.Section value={3} color="gray" />
                            <Progress.Section value={7} color="green" />
                            <Progress.Section value={90} color="blue" />
                        </Progress.Root>
                        <Group justify="flex-start">
                            <Text fz="md" fw={500} c="grey">Tokens Already Allocated this Cycle: 300</Text>
                        </Group>
                        <Title order={4} lts="1px" mt="xl" c="green">Financial Health Metrics</Title>
                        <Paper p="lg" radius="md" bg="#fafafa">
                            <Group justify="space-between">
                                <div>
                                    <Text fz="md" fw={500} c="#999">Working Token Ratio</Text>
                                    <Text fz="xl" fw={700} c="#444">0.50</Text>
                                </div>
                                <div>
                                    <Text fz="md" fw={500} c="#999">Working Token Capital</Text>
                                    <Text fz="xl" fw={700} c="#444">10,000</Text>
                                </div>
                                <div>
                                    <Text fz="md" fw={500} c="#999">Net Token Assets</Text>
                                    <Text fz="xl" fw={700} c="#444">10,000</Text>
                                </div>
                            </Group>
                        </Paper>
                        <Title order={4} lts="1px" mt="xl" c="green">Launch Token Release</Title>
                        <Paper p="lg" radius="md" bg="#fafafa">
                            <SimpleGrid cols={{ base: 1, xs: 1, sm: 3 }}>
                                <div>
                                    <Text fz="md" fw={500} c="#999">Current Token Release</Text>
                                    <Text fz="xl" fw={500} c="#444">1000 (10% of total)</Text>
                                </div>
                                <div>
                                    <Text fz="md" fw={500} c="#999">Next Token Release</Text>
                                    <Text fz="xl" fw={500} c="#444">900 (9% of total)</Text>
                                </div>
                                <div>
                                    <Text fz="md" fw={500} c="#999">Date of Next Release</Text>
                                    <Text fz="xl" fw={500} c="#444">October 6th, 2025</Text>
                                </div>
                            </SimpleGrid>

                        </Paper>
                        <SimpleGrid cols={{ base: 1, xs: 2 }} mt="xl" mb="md" spacing="xl">
                            <div>
                                <Title order={4} lts="1px" c="blue">Current Token Assets</Title>
                                <Paper p="lg" withBorder radius="md" mb="xl" mt="lg">
                                    <Stack>
                                        <Text fz="md" fw={500} c="#999">Launch Tokens Receivable</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
                                        <Text fz="md" fw={500} c="#999">Launch Tokens Balance</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
                                        <Text fz="md" fw={500} c="red">Total Token Assets</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
                                    </Stack>
                                </Paper>
                            </div>
                            <div>
                                <Title order={4} lts="1px" c="blue">Current Token Liabilities</Title>
                                <Paper p="lg" withBorder radius="md" mb="xl" mt="lg">
                                    <Stack>
                                        <Text fz="md" fw={500} c="#999">Launch Tokens committed to pay the Collaborative Leader</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
                                        <Text fz="md" fw={500} c="#999">Launch Tokens committed for the payment of Project work upon completion</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
                                        <Text fz="md" fw={500} c="#999">Launch Tokens committed to pay for Non-Team Contributions to Projects</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
                                        <Text fz="md" fw={500} c="red">Total Token Liabilities</Text>
                                        <Text fz="xl" fw={500} c="#444">1000</Text>
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

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx" pr="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                        <Center>
                            <img src={testCollab.logoUrl} width={80}/>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
                        <Stack>
                        <Title ta="center" hiddenFrom="sm" order={2} mt="xs" mb="xl">
                            {testCollab.name} Collaborative
                        </Title>
                        <Title order={2} visibleFrom="sm" mt="xs" mb="xl">
                            {testCollab.name} Collaborative
                        </Title>
                        <Title order={3} fw={500} c="green" mt="lg" mb="md">
                            Revenue Sharing Pool
                        </Title>
                        <SimpleGrid cols={{ base: 1, xs: 2 }} mb="md">
                            <div>
                            <Text fz="md" fw={500}>
                                Revenue Share
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                {testCollab.revenueShare}%
                            </Text>
                            <Text fz="md" fw={500}>
                                Payout Frequency
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                {testCollab.payoutFrequency}
                            </Text>
                            <Text fz="md" fw={500}>
                                Indirect Costs
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                {testCollab.indirectCosts}%
                            </Text>
                            <Text fz="md" fw={500}>
                                Collaborative Admin Compensation
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                {testCollab.collabLeaderCompensation}%
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
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td>1 year</Table.Td>
                                        <Table.Td>100%</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>3 years</Table.Td>
                                        <Table.Td>70%</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>5 years</Table.Td>
                                        <Table.Td>50%</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                            </div>
                        </SimpleGrid>
                        <Divider my="lg" />
                        <Title order={3} fw={500} c="green" mt="md" mb="md">
                            Launch Tokens
                        </Title>
                        <SimpleGrid cols={{ base: 1, xs: 2 }} mb="md">
                            <div>
                            <Text fz="md" fw={500}>
                                Next Token Release Date
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                October 6th, 2025
                            </Text>
                            <Text fz="md" fw={500}>
                                Next Token Release
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                900
                            </Text>
                            <Text fz="md" fw={500}>
                                Current Token Release
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                1000
                            </Text>
                            </div>
                            <div>
                            <Text fz="md" fw={500}>
                                Collaborative Admin Compensation (Launch tokens)
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                0
                            </Text>
                            <Text fz="md" fw={500}>
                                Launch Tokens Receivable
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                9000
                            </Text>
                            <Text fz="md" fw={500}>
                                Launch Tokens Balance
                            </Text>
                            <Text fz="xl" c="#222" mb="lg">
                                1000
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

            <Title order={2} lts="4px" c="dimmed">
                COLLABORATIVE VALUE EXCHANGE
            </Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl" mt="lg" ml="lx">
                <Grid>
                    <Grid.Col span={2}>
                        <Center>
                            <img src={testCollab.logoUrl} width={80}/>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={10}>
                    <Stack>
                        <Title order={2} mb="md">{testCollab.name} Collaborative</Title>
                        <SimpleGrid cols={2} mb="md">
                        <div>
                            <Group>
                                {testCollab.approvalStatus === 'Active' ? (
                                    <Badge color="yellow">
                                        {testCollab.approvalStatus}
                                    </Badge>
                                ) : (
                                    <Badge color="pink">
                                        {testCollab.approvalStatus}
                                    </Badge>
                                )}
                            </Group>
                            <Group wrap="nowrap" gap={10} mt={10}>
                                <IconAt stroke={1.5} size={16} />
                                <Text>
                                    {testCollab.websiteUrl}
                                </Text>
                            </Group>
                            <Group wrap="nowrap" gap={10} mt={10}>
                                <IconMapPin stroke={1.5} size={16} />
                                <Text>
                                    {testCollab.city}, {testCollab.state}
                                </Text>
                            </Group>

                        </div>
                        <div>
                            <Group mb="md" align="flex-start">
                                <Text>
                                    Leader:
                                </Text>
                                <div>
                                <Text fz="md">
                                    {testCollab.adminName}
                                </Text>
                                <Text fz="sm" c="dimmed">
                                    {testCollab.adminEmail}
                                </Text>
                                </div>
                            </Group>
                            <Group mb="md">
                                <Text>
                                    Created:
                                </Text>
                                <Text>
                                    {testCollab.createdAt}
                                </Text>
                            </Group>
                        </div>
                        </SimpleGrid> 
                    </Stack>
                    <p>
                        {testCollab.description}<br /><br />
                    </p>
                    
                    </Grid.Col>
                </Grid>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg" mb="lg">
                <Group justify="space-between">
                    <img src={testCollab.logoUrl} alt="Collaborative Logo" width={60} />
                    <Text>
                        You've been invited to join the collaborative<br/><span color="blue"><strong>{testCollab.name}</strong></span> as a <strong>Collaborative Leader</strong>.
                    </Text>
                    <div>
                        <Button variant="default">
                            Accept Invitation
                        </Button>
                        <Button variant="default" ml="md">
                            Decline Invitation
                        </Button>
                    </div>
                </Group>
            </Card>

            {/* Grid to display collaborative data */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
                {mock_collab_data.map((collaborative) => (
                    <Card key={collaborative.id} shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap="0" style={{ height: '100%' }}>
                            <img src={collaborative.logoUrl} alt="Collaborative Logo" height={90}/>
                            <Text ta="center" fz="lg" fw={500} mt="md">
                                {collaborative.name}
                            </Text>
                            <Tooltip label={collaborative.description || 'No description available'} multiline w={300} color="gray">
                                <Text lineClamp={3} ta="center" c="dimmed" size="sm">
                                    {collaborative.description}
                                </Text>
                            </Tooltip>

                            <Badge c="green" variant="light" size="md" mt="sm" mb="lg">
                                Seeking new members
                            </Badge>
                            <Link
                                to={`/collaboratives/${collaborative.id}`}
                                state={{ from: location.pathname }}                           
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex', // Make the Link a flex container
                                    flexDirection: 'column', // Ensure the button aligns properly
                                    marginTop: 'auto', // Push the button to the bottom
                                }}
                            >
                            <Button
                                variant="default"
                                size="sm"
                                fullWidth>
                                    View Collaborative
                            </Button>
                            </Link>
                        </Stack>
                    </Card>
                ))}
            </SimpleGrid>

            <Card shadow="sm" padding="lg" radius="md" mt="xl" mb="xl" withBorder>
                <Title order={4} mb="xl">
                    Revenue Sharing Pool
                </Title>
                <Grid>
                    
                    <Grid.Col span={4}>
                        <Text fz="md" fw={500}>
                            Revenue Share %
                        </Text>
                        <Text fz="xl" c="#222" mb="lg">
                            50%
                        </Text>
                        <Text fz="md" fw={500}>
                            Payout Frequency
                        </Text>
                        <Text fz="xl" c="#222" mb="lg">
                            Annual
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                    <Table variant="vertical" layout="fixed" withTableBorder>
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
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Button variant="default" ml="xl" mb="sm">
                            Edit Revenue Share %
                        </Button>
                        <Button variant="default" ml="xl" mb="sm">
                            Edit Exchange Rates
                        </Button>
                    </Grid.Col>
                </Grid>
            </Card>

            <Group mt="xl">
                <img src={testCollab.logoUrl} alt="Collaborative Logo" width={60} />
                <Text fz="50px" c="#222" mr="xl" mb="xl" mt="xl">
                    {testCollab.name}
                </Text>
            </Group>
            
            <Space h="xl" />
            
            <Grid mt="xl" mb="xl">
                <Grid.Col span={10}>

                        <Grid>
                            <Grid.Col span={10}>
                                <Text fz="h3" fs="italic" mb="xl" c="#222">
                                    {testCollab.description}
                                </Text>
                                
                            </Grid.Col>
                            <Grid.Col span={2}>
                            </Grid.Col>
                        </Grid>
                        <Divider my="sm" variant="dashed" />
                        <Grid mt="lg">
                            <Grid.Col span={6}>
                            <Group wrap="nowrap" gap={10} mt={3}>
                                    <IconAt stroke={1.5} size={16} />
                                    <Text>
                                        {testCollab.websiteUrl}
                                    </Text>
                                </Group>
                                <Group wrap="nowrap" gap={10} mt={25}>
                                    <IconMapPin stroke={1.5} size={16} />
                                    <Text>
                                    {testCollab.city}, {testCollab.state}
                                    </Text>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={6}>
                            <Group mb="md" align="flex-start">
                                    <Text>
                                        Leader:
                                    </Text>
                                    <div>
                                        <Text fz="md">
                                            {testCollab.adminName}
                                        </Text>
                                        <Text fz="sm">
                                            {testCollab.adminEmail}
                                        </Text>
                                    </div>
                                </Group>
                                <Group mb="md">
                                    <Text>
                                        Created:
                                    </Text>
                                    <Text>
                                        {testCollab.createdAt}
                                    </Text>
                                </Group>
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={6}>
                                Skills<br/>
                                <Badge variant="light" color="green">
                                    Design & Creative
                                </Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                Experience<br/>
                                <Badge variant="light" color="blue">
                                Education
                                </Badge>
                                <Badge variant="light" color="blue">
                                Non-Profit
                                </Badge>
                            </Grid.Col>
                        </Grid>

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
                        Add Members
                    </Button>
                </Grid.Col>
            </Grid>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Members"
                size="lg"
                >
                {loadingUsers ? (
                    <Loader size="lg" />
                ) : (
                    <div>
                        {/* Searchable Input */}
                        <TextInput
                            placeholder="Search users"
                            mb="md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {/* User List with Selection */}
                        <div>
                            {filteredUsers.map((user) => (
                            <Group
                                key={user.id}
                                mb="sm"
                                onClick={() => setSelectedUser(user)} // Set the selected user
                                style={{
                                cursor: 'pointer',
                                backgroundColor: selectedUser?.id === user.id ? '#f0f0f0' : 'transparent',
                                padding: '8px',
                                borderRadius: '4px',
                                }}
                            >
                                <Avatar src={user.avatar_url} size={40} radius="xl" />
                                <div>
                                <Text fz="sm" fw={500}>
                                    {user.name}
                                </Text>
                                <Text fz="xs" c="dimmed">
                                    {user.email}
                                </Text>
                                </div>
                            </Group>
                            ))}
                        </div>

                        {/* Select for Roles */}
                        <Select
                            label="Role"
                            data={['Collaborative Leader', 'Collaborative Member']}
                            value={selectedRole}
                            onChange={(value) => setSelectedRole(value || '')}
                            placeholder="Select a role"
                            mb="md"
                        />

                        {/* Submit Button */}
                        <Button
                            variant="default"
                            onClick={handleAddMember}
                            disabled={!selectedUser || !selectedRole} // Disable if no user or role is selected
                            mb="md"
                        >
                            Submit
                        </Button>

                        {/* Success Message */}
                        {successMessage && (
                            <Text color="green" mb="md">
                            {successMessage}
                            </Text>
                        )}

                        {/* Done Button */}
                        <Button
                            variant="default"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Done
                        </Button>
                    </div>
                )}
                </Modal>

            <Grid>
                <Grid.Col span={3}>
                    <Button variant="default" mt="xl" mb="sm">
                        Edit Collaborative
                    </Button>
                    <Button variant="default" mb="sm">
                        Add Collaborative
                    </Button>
                    <Button variant="default" mb="sm">
                        Add Project
                    </Button>
                    <Button
                        mb="sm"
                        variant="default"
                        onClick={() => {
                            setIsModalOpen(true);
                            if (allUsers.length === 0) {
                            fetchAllUsers(); // Fetch users only if not already loaded
                            }
                        }}
                        >
                        Add Members
                    </Button>
                </Grid.Col>
                <Grid.Col span={9}>
                <Table.ScrollContainer minWidth={400}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Members</Table.Th>
                                <Table.Th>Role</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
                </Grid.Col>      
            </Grid>

            <Title order={3} mb="md" pt="sm" pb="lg">
                Approve Collaboratives
            </Title>
            {mock_collab_data.map((collab) => (
                <Card key={collab.id} className={classes.card} shadow="sm" radius="md" withBorder mt="lg" p="xl" bg="var(--mantine-color-body)">
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
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
                                <span style={{ color: "var(--mantine-color-dimmed)" }}>Collab Leader:</span><br/>{collab.adminEmail}
                            </Text>
                            
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", height: "100%" }}>
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
                    <Group justify="flex-start" mt="lg" gap="md">
                        <Button variant="default">Approve</Button>
                        <Button variant="default">Decline</Button>
                    </Group>

                </Card>
            ))}
            
        </Container>
    );
}