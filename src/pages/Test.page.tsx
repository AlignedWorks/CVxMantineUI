import React, { useState } from 'react';
import { 
  Container,
  Title,
  SimpleGrid,
  Paper,
  Text,
  TextInput,
  Textarea,
  Button,
  Card,
  Grid,
  Table,
  Flex,
  Avatar,
  Select,
  Group,
} from '@mantine/core';
import {
  IconBrandLinkedin,
} from '@tabler/icons-react';
import { mock_collab_data, users } from '../data.ts';
import classes from './Test.module.css';

const networkRoles = [
    'Applicant',
    'ApplicantDenied',
    'NetworkOwner',
    'NetworkContributor'
]

export function Test() {
    const [textareaVisible, setTextareaVisible] = useState(false); // State to toggle TextArea visibility

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
                            <Grid.Col span={4} mt="md" mb="lg">
                                <Avatar src={user.avatar_url} size={60} radius="xl" mx="auto"/>
                            </Grid.Col>
                            <Grid.Col span={8} mt="md">
                                <Text size="lg" fw={500}>
                                    {user.name}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {user.email.split('@')[0].length >= 16
                                        ? `${user.email.split('@')[0]}<br/>${user.email.split('@')[1]}`
                                        : user.email}
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
                                <Group wrap="nowrap" gap={10} mt={5}>
                                    <IconBrandLinkedin stroke={1.5} size={18}/>
                                    <Text fz="xs" c="dimmed">
                                    +11 (876) 890 56 23
                                    </Text>
                                </Group>
                            </Grid.Col>
                        </Grid>
                        <Text size="sm" c="dimmed">
                            {user.description}
                        </Text>
                    <Select
                        mt="md"
                        label="User Status"
                        comboboxProps={{ withinPortal: true }}
                        data={['Applicant', 'Applicant Denied', 'Network Owner', 'Network Contributor']}
                        defaultValue="Applicant"
                        classNames={classes}
                    />
                    <Button variant="outline" color="gray" size="xs" mt="sm">
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
        </Container>
    );
}