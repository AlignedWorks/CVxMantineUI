import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Button,
  Group,
  Text,
  Table,
  Avatar,
  Select,
} from '@mantine/core';
import { Link } from 'react-router-dom';

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string;
    phoneNumber: string;
    linkedIn: string;
    avatarUrl: string;
    createdAt: string;
    memberStatus: string;
  }

  interface Role {
    label: string;
    value: string;
  }

const mock_data = [
    {
        id: '1',
      avatarUrl:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
      lastName: 'Wolfkisser',
      firstName: 'Robert',
      username: 'rob_wolf@gmail.com',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      phoneNumber: '123-456-7890',
        createdAt: '2023-01-01',
      linkedIn: 'https://www.linkedin.com/in/robertwolfkisser',
      memberStatus: 'Applicant',
    },
    {
        id: '2',
      avatarUrl:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png',
      firstName: 'Jill',
      lastName: 'Jailbreaker',
      username: 'jj@breaker.com',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      phoneNumber: '123-456-7890',
        createdAt: '2023-01-01',
      linkedIn: 'https://www.linkedin.com/in/jilljailbreaker',
      memberStatus: 'Applicant',
    },
    {
        id: '3',
      avatarUrl:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
        firstName: 'Henry',
        lastName: 'Silkeater',
      username: 'henry@silkeater.io',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      phoneNumber: '123-456-7890',
        createdAt: '2023-01-01',
      linkedIn: 'https://www.linkedin.com/in/henrysilkeater',
      memberStatus: 'Applicant',
    },
    {
        id: '4',
      avatarUrl:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
        firstName: 'Bill',
        lastName: 'Horsefighter',
      username: 'bhorsefighter@gmail.com',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      phoneNumber: '123-456-7890',
        createdAt: '2023-01-01',
      linkedIn: 'https://www.linkedin.com/in/billhorsefighter',
      role: 'Applicant',
      memberStatus: 'Applicant',
    },
    {
        id: '5',
      avatarUrl:
        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
        firstName: 'Jeremy',
        lastName: 'Footviewer',
      username: 'jeremy@foot.dev',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      phoneNumber: '123-456-7890',
        createdAt: '2023-01-01',
      linkedIn: 'https://www.linkedin.com/in/jeremyfootviewer',
      memberStatus: 'Applicant',
    },
  ];


export function Dashboard() {
    const [dashboard, setDashboard] = useState<User[] | null>([]);
    const [rolesData, setRolesData] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = () => {
        fetch(
          `${import.meta.env.VITE_API_BASE}/dashboard`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            const { users, roles } = data;

            // Set the user data
            if (users.length === 0) {
                setDashboard(mock_data);
            } else {
                setDashboard(users);
                setLoading(false);
            }

            // Set the roles data
            setRolesData(roles.map((role: Role) => ({ label: role.label, value: role.value })));
          })
          .catch((err) => console.error("Error fetching profile:", err));
      };
    
      useEffect(() => {
        fetchDashboardData();
      }, []);

      if (loading) {
        return (
          <Container size="md" py="xl">
            <Title order={1} mb="md" pt="sm" pb="lg">
              Loading...
            </Title>
          </Container>
        );
      }

      const handleRoleChange = (userId: string, newRole: string | null) => {
        console.log(`User ID: ${userId}, New Role: ${newRole}`);

        // Convert the role to the backend format (remove spaces)
        // const backendRole = newRole?.replace(/\s+/g, '');
      
        // Example: Send the updated role to the server
        fetch(`https://cvx.jordonbyers.com/members/${userId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        })
          .then((res) => res.json())
          .then((updatedUser) => {
            console.log("Role updated successfully:", updatedUser);
          })
          .catch((err) => console.error("Error updating role:", err));
      };

    const rows = dashboard?.map((item) => (
        <Table.Tr key={item.id}>
          <Table.Td>
            <Group gap="sm">
              <Avatar size={40} src={item.avatarUrl} radius={40} />
              <div>
                <Text fz="sm" fw={500}>
                  {item.firstName + " " + item.lastName}
                </Text>
                <Text fz="xs" c="dimmed">
                  {item.username}
                </Text>
              </div>
            </Group>
          </Table.Td>
    
          <Table.Td>
            {item.memberStatus && (
              <Select
                data={rolesData}
                defaultValue={item.memberStatus}
                variant="unstyled"
                allowDeselect={false}
                onChange={(value) => handleRoleChange(item.id, value)}
              />
            )}
          </Table.Td>
          <Table.Td>{item.linkedIn}</Table.Td>
        </Table.Tr>
      ));

    return (
        <>
        <Container size="md" py="xl">
            <Title order={1} mb="md" pt="sm" pb="lg">
                Dashboard
            </Title>
            <Group justify="center" mt="xl">
                <Link to="/create-collaborative">
                    <Button variant="default">
                        Propose a Collaborative
                    </Button>
                </Link>
            </Group>

            <Title order={3} mb="md" pt="sm" pb="lg">
                Approve users
            </Title>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm">
                    <Table.Thead>
                    <Table.Tr>
                        <Table.Th>User</Table.Th>
                        <Table.Th>User Status</Table.Th>
                        <Table.Th>LinkedIn</Table.Th>
                    </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>        
        </Container>
        </>
    );
}