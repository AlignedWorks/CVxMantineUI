import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Button,
  Group,
  Text,
  Avatar,
  Select,
  SimpleGrid,
  Card,
  Grid,
  Tooltip,
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
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({}); // Temporary state for selected roles
  const [submittedUsers, setSubmittedUsers] = useState<{ [userId: string]: boolean }>({});
  // const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
      fetch(
        new URL("dashboard", import.meta.env.VITE_API_BASE),
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const { users, roles, collabsNeedingApproval } = data;
          console.log(collabsNeedingApproval);

          // Set the user data
          if (users.length === 0) {
              setDashboard(mock_data);
          } else {
              setDashboard(users);
              console.log(users);
              // setLoading(false);
          }

          // Set the roles data
          setRolesData(roles.map((role: Role) => ({ label: role.label, value: role.value })));
        })
        .catch((err) => console.error("Error fetching profile:", err));
    };
    
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /*
  if (loading) {
    return (
      <Container size="md" py="xl">
        <Title order={1} mb="md" pt="sm" pb="lg">
          Loading...
        </Title>
      </Container>
    );
  }
    */

  const handleRoleChange = (userId: string, newRole: string | null) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: newRole || "", // Update the temporary state with the selected role
    }));
  };

  const handleSubmitRoleChange = (userId: string ) => {
    const newRole = selectedRoles[userId];
    console.log(`User ID: ${userId}, New Role: ${newRole}`);

    fetch(
      new URL(`members/${userId}`, import.meta.env.VITE_API_BASE),
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        console.log("Role updated successfully:", updatedUser);
        setSubmittedUsers((prev) => ({ ...prev, [userId]: true })); // Mark as submitted
        setTimeout(() => {
          setSubmittedUsers((prev) => ({ ...prev, [userId]: false })); // Reset after 3 seconds
        }, 3000);
      })
      .catch((err) => console.error("Error updating role:", err));
  };

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

          {dashboard?.map((user) => (
            <Card key={user.id} shadow="sm" radius="md" mt="xl" withBorder>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    <div>
                        <Grid>
                            <Grid.Col span={4}>
                                <Avatar src={user.avatarUrl} size={60} radius="xl" mx="auto"/>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Text size="lg" fw={500}>
                                  {user.firstName + " " + user.lastName}
                                </Text>
                                <Tooltip label={user.username} color="gray">
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {user.username}
                                    </Text>
                                </Tooltip>
                                <Text size="sm" c="dimmed">
                                    <a
                                        href={user.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#0077b5", textDecoration: "none" }}
                                    >
                                        LinkedIn
                                    </a>
                                </Text>
                            </Grid.Col>
                        </Grid>
                    </div>
                    <div>
                        <Text fw={500}>
                            Bio
                        </Text>
                        <Tooltip label={user.bio || 'No bio available'} multiline w={300} position="bottom" color="gray">
                            <Text
                                size="sm"
                                c="dimmed"
                                style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 4, // Limit to 4 lines
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minHeight: '3.6em', // Ensure consistent height for 3 lines of text
                                lineHeight: '1.2em', // Adjust line height to match the text
                                }}
                            >
                                {user.bio || '\u00A0\u00A0\u00A0'} {/* Render empty space if no bio */}
                            </Text>
                        </Tooltip>
                    </div>
                    <div>

                    {user.memberStatus.length > 0 && (
                      <Select
                        label="User Status"
                        data={rolesData}
                        value={selectedRoles[user.id] || user.memberStatus} // Use the temporary state or fallback to the current role
                        defaultValue={user.memberStatus}
                        allowDeselect={false}
                        onChange={(value) => handleRoleChange(user.id, value)}
                      />
                    )}

                    <Button
                      variant="outline"
                      color="gray"
                      size="sm"
                      mt="sm"
                      onClick={() => handleSubmitRoleChange(user.id)} // Submit the role change
                    >
                      Submit
                    </Button>
                      {submittedUsers[user.id] && (
                        <Text size="sm" c="green" mt="xs">
                          Role updated successfully!
                        </Text>
                      )}
                    </div>        
                </SimpleGrid>
            </Card>
        ))}

      </Container>
    </>
  );
}