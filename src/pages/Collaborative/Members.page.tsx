import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.tsx';
import { useParams, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  TextInput,
  Badge,
  Button,
  Loader,
  Group,
  Grid,
  Table,
  Avatar,
  Select,
  Modal,
  Card,
  Stack,
  Title,
  ThemeIcon,
  Tooltip,
  Center,
 } from '@mantine/core';
import { CollaborativeDataWithMembers, inviteStatusColors } from '../../data.ts';
import { IconCheck, IconX } from '@tabler/icons-react'; // Add these imports

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio: string;
  city: string;
  state: string;
  phoneNumber: string;
  linkedIn: string;
  avatarUrl: string;
  createdAt: string;
  skills: string[];
  experience: string[];
  memberStatus: string;
}

export function CollaborativeMembers() {
  // const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users
  const [loadingUsers, setLoadingUsers] = useState(false); // Track loading state
  const [searchQuery, setSearchQuery] = useState(''); // For the search input
  const [selectedUser, setSelectedUser] = useState<User>(); // For the selected user
  const [selectedRole, setSelectedRole] = useState(''); // For the selected role
  const [successMessage, setSuccessMessage] = useState(''); // For the success message

  // Get the "from" state or default to a fallback
  // const from = location.state?.from || '/collaborative-directory';

  if (user) {
    console.log(user.username);
  } else {
    console.log('User is null');
  }

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null); // Clear the ID when leaving the page
  }, [id, setCollaborativeId]);

  useEffect(() => {
    fetch(
      new URL(`collaboratives/${id}/members`, import.meta.env.VITE_API_BASE),
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
      .then((data: CollaborativeDataWithMembers) => {
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

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    await fetch(
      new URL("members", import.meta.env.VITE_API_BASE),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        return response.json();
      })
      .then((data: User[]) => {
        // Filter out users who are already members of the collaborative
        const filteredUsers = data.filter(user => 
          !collaborative.members.some(member => member.id === user.id)
        );
  
        setAllUsers(filteredUsers); // Set the filtered data
      })
      .catch((error) => {
        console.error('Error fetching member data:', error);
      })
      .finally(() => setLoadingUsers(false));
  };

  const filteredUsers = allUsers.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.userName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    if (!selectedUser || !selectedRole) return;

    fetch(
      new URL(`collaboratives/${collaborative.id}`, import.meta.env.VITE_API_BASE),
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser.id, userRole: selectedRole }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        console.log("Role updated successfully:", updatedUser);
      })
      .catch((err) => console.error("Error updating role:", err));
  
    // Simulate adding the user to the collaborative
    console.log(`Adding user ${selectedUser.id} as ${selectedRole}`);
  
    // Show success message
    setSuccessMessage(
      `${selectedUser.firstName} ${selectedUser.lastName} has been added as a ${selectedRole}.`
    );
  
    // Reset selections
    setSelectedUser(undefined);
    setSelectedRole('');
  };

  const memberRows = collaborative.members.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td style={{ verticalAlign: 'top' }}>
        <Group gap="sm" ml="lg" mt="sm" mb="sm">
            <Avatar size={40} src={item.avatarUrl} radius={40} />
            <div>
              <Text fz="sm" fw={500} 
                style={{ 
                  color: '#0077b5', 
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                component={Link}
                to={`/members/${item.id}`}
                state={{ from: location.pathname }}
                >
                {item.firstName} {item.lastName}
              </Text>
              <br/>
              <Text 
                fz="xs" 
                c="dimmed"
                component="a"
                href={`mailto:${item.userName}`}
                style={{
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.userName}
              </Text>
            </div>
        </Group>
        </Table.Td>
        <Table.Td >
          <Text>
            {item.role}
          </Text>
        </Table.Td>
        <Table.Td>
            <Badge
                color={inviteStatusColors[item.inviteStatus] || 'gray'} // Default to 'gray' if status is unknown
                fullWidth variant="light">
                {item.inviteStatus}
            </Badge>
        </Table.Td>
        <Table.Td>
        <Group justify="center">
          <ThemeIcon
            size="sm"
            variant="light"
            color={item.isActive ? 'green' : 'red'}
            radius="xl"
          >
            {item.isActive ? (
              <IconCheck size={14} />
            ) : (
              <IconX size={14} />
            )}
          </ThemeIcon>
        </Group>
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
              <Title order={2} visibleFrom="sm" mt="xs" mb="xl">
                {collaborative.name} Collaborative
              </Title>
              <Table.ScrollContainer minWidth={400} mt="xl">
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Members</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Active</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{memberRows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Stack>
          </Grid.Col>
          <Grid.Col span={1}>
          </Grid.Col>
        </Grid>
      </Card>

      {collaborative.userIsCollabAdmin ? (
        <Group justify="right">
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
        </Group>
      ) : (
        <Group justify="right">
          <Tooltip label="Only collaborative admins can add members">
            <Button disabled mb="sm">
              Add Members
            </Button>
          </Tooltip>
        </Group>
      )}

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
                      <Avatar src={user.avatarUrl} size={40} radius="xl" />
                      <div>
                      <Text fz="sm" fw={500}>
                          {user.firstName} {user.lastName}
                      </Text>
                      <Text fz="xs" c="dimmed">
                          {user.userName}
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
                  mb="lg"
              />

              <Group gap="lg">
              {/* Submit Button */}
                <Button
                    variant="outline"
                    onClick={handleAddMember}
                    disabled={!selectedUser || !selectedRole} // Disable if no user or role is selected
                >
                    Submit
                </Button>

                {/* Done Button */}
                <Button
                    variant="default"
                    onClick={() => setIsModalOpen(false)}
                >
                    Done
                </Button>
              </Group>

              {/* Success Message */}
              {successMessage && (
                  <Text c="green" mb="md">
                  {successMessage}
                  </Text>
              )}
          </div>
      )}
      </Modal>

    </Container>
  );
}