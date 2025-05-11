import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.tsx';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import {
  Container,
  Text,
  TextInput,
  Badge,
  Button,
  Loader,
  Space,
  Group,
  Grid,
  Table,
  Avatar,
  Select,
  Modal,
  Divider,
 } from '@mantine/core';
import { CollaborativeData, collabRoles, inviteStatusColors } from '../../data.ts';
import {
  IconAt,
  IconMapPin,
  IconCircles,
} from '@tabler/icons-react'

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

export function CollaborativeHome() {
  const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const { user } = useAuth();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users
  const [loadingUsers, setLoadingUsers] = useState(false); // Track loading state
  const [searchQuery, setSearchQuery] = useState(''); // For the search input
  const [selectedUser, setSelectedUser] = useState<User>(); // For the selected user
  const [selectedRole, setSelectedRole] = useState(''); // For the selected role
  const [successMessage, setSuccessMessage] = useState(''); // For the success message

  // Get the "from" state or default to a fallback
  const from = location.state?.from || '/collaborative-directory';

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
      new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
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
      .then((data: CollaborativeData) => {
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

  const rows = collaborative.members.map((item) => (
    <Table.Tr key={item.id}>
        <Table.Td style={{ verticalAlign: 'top' }}>
        <Group gap="sm" ml="lg" mt="sm" mb="sm">
            <Avatar size={40} src={item.avatarUrl} radius={40} />
            <div>
                <Text fz="sm" fw={500}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text fz="xs" c="dimmed">
                    {item.userName}
                </Text>
            </div>
        </Group>
        </Table.Td>
        <Table.Td >
          <Text>
            {item.role ? (
              <Select
                data={collabRoles}
                value={item.role}
                variant="unstyled"
                allowDeselect={false}
              />
            ) : (
              <Loader size="sm" /> // Show a loader or placeholder while waiting for the value
            )}
          </Text>
        </Table.Td>
        <Table.Td>
            <Badge
                color={inviteStatusColors[item.inviteStatus] || 'gray'} // Default to 'gray' if status is unknown
                fullWidth variant="light">
                {item.inviteStatus}
            </Badge>
        </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      <Group mt="xl">
                <IconCircles size={55} stroke={1.5} color="#222" />
                <Text fz="50px" c="#222" mr="xl" mb="xl" mt="xl">
                    ByteSecure Collective
                </Text>
            </Group>
            
            <Space h="xl" />
            
            <Grid mt="xl" mb="xl">
              <Grid.Col span={10}>
                <Grid>
                    <Grid.Col span={10}>
                        <Text fz="h3" fs="italic" mb="xl" c="#45a6b7">
                            A cybersecurity-focused group tackling modern threats with cutting-edge defense strategies.
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
                              www.bytesecure.net
                          </Text>
                      </Group>
                      <Group wrap="nowrap" gap={10} mt={25}>
                          <IconMapPin stroke={1.5} size={16} />
                          <Text>
                              Plano, TX
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
                                  Jordon Byers
                              </Text>
                              <Text fz="sm">
                                  jordonbyers@gmail.com
                              </Text>
                          </div>
                      </Group>
                      <Group mb="md">
                          <Text>
                              Created:
                          </Text>
                          <Text>
                              March 25, 2025
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
      <Grid>
        <Grid.Col span={9}>
        <Table.ScrollContainer minWidth={400} mt="xl">
            <Table  verticalSpacing="sm">
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
        <Grid.Col span={1}>

        </Grid.Col>
        <Grid.Col span={2}>

        </Grid.Col>
    </Grid>

    <Button
        variant="default"
        onClick={() => {
            setIsModalOpen(true);
            if (allUsers.length === 0) {
            fetchAllUsers(); // Fetch users only if not already loaded
            }
        }}
        >
        Add Member
    </Button>

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

    </Container>
  );
}