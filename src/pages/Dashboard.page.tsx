import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.tsx";
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
  Table,
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

interface CollabInvite {
  userId: string;
  userRole: string;
  collabId: number;
  collabName: string;
  collabLogoUrl: string;
  inviteStatus: string;
}

interface CollabApprovalRequest {
  userId: string;
  collabId: number;
  collabName: string;
  collabLogoUrl: string;
  currentCSA: string;
  currentCSAUrl: string;
}

interface CollabsNeedingApproval {
  id: number,
  name: string,
  description: string,
  websiteUrl: string,
  revenueShare: number,
  indirectCosts: number,
  collabLeaderCompensation: number,
  payoutFrequency: string,
  createdAt: string,
  stakingTiers: { tier: string, exchangeRate: number }[],
}

export function Dashboard() {
  const [dashboard, setDashboard] = useState<User[] | null>([]);
  const [rolesData, setRolesData] = useState<string[]>([]);
  const [collabsNeedingApproval, setCollabsNeedingApproval] = useState<CollabsNeedingApproval[]>([]);
  const [collabInvites, setCollabInvites] = useState<CollabInvite[]>([]);
  const [csaApprovalRequests, setCsaApprovalRequests] = useState<CollabApprovalRequest[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({}); // Temporary state for selected roles
  const [submittedUsers, setSubmittedUsers] = useState<{ [userId: string]: boolean }>({});
  const { user } = useAuth();
  // const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
      fetch(
        new URL("dashboard", import.meta.env.VITE_API_BASE),
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const { users, roles, collabsNeedingApproval, collabInvites, csaApprovalRequests } = data;

          console.log(collabsNeedingApproval);
          console.log(collabInvites);
          console.log(csaApprovalRequests);
          setCollabsNeedingApproval(collabsNeedingApproval); // Set the collabs needing approval data
          setCollabInvites(collabInvites); // Set the collab invites data
          setCsaApprovalRequests(csaApprovalRequests); // Set the CSA approval requests data
          setDashboard(users);

          // Set the roles data
          setRolesData(roles);
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

        // If the role is changed to Network Admin or Network Contributor, refresh the dashboard data
        if (newRole === "Network Admin" || newRole === "Network Contributor") {
          // Update the user in the dashboard array with the new role
          setDashboard(prevDashboard => 
            prevDashboard?.map(user => 
              user.id === userId ? { ...user, memberStatus: newRole } : user
            ) || null
          );
        }

        setTimeout(() => {
          setSubmittedUsers((prev) => ({ ...prev, [userId]: false })); // Reset after 3 seconds
        }, 3000);
      })
      .catch((err) => console.error("Error updating role:", err));
  };

  const handleCollabInvite = (collabId: number, userId: string, action: 'accept' | 'decline') => {
    // Determine the new status based on the action
    const newStatus = action === 'accept' ? 'Accepted' : 'Declined';
    
    fetch(
      new URL(`collaboratives/${collabId}`, import.meta.env.VITE_API_BASE),
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: userId,
          inviteStatus: newStatus 
        }),
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Invitation ${action}ed successfully:`, data);
        
        // Refresh the page so 1) collab invite is removed and 2) the collab's CSA acceptance notification can populate
        fetchDashboardData();
      })
      .catch((err) => {
        console.error(`Error ${action}ing invitation:`, err);
        // Optionally show an error message to the user
      });
  };

  const handleCollabApproval = (collabId: number, status: 'approve' | 'decline') => {
    fetch(
      new URL(`collaboratives/${collabId}`, import.meta.env.VITE_API_BASE),
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((message) => {
        console.log(message);

        // Refresh the dashboard data after successful approval/decline
        fetchDashboardData();
      })
      .catch((err) => {
        console.error(`Error approving/declining collaborative:`, err);
        // Optionally show an error message to the user
      });
    }

  return (
    <>
      <Container size="md" py="xl">
        <Title order={2} lts="4px" c="dimmed">
            COLLABORATIVE VALUE EXCHANGE
        </Title>
        <Title order={1} mb="md" pt="sm" pb="lg">
            {user ? user.firstName + "'s " : ""}Dashboard
        </Title>
        <Group justify="flex-start" mt="xl">
          <Link to="/create-collaborative">
            <Button variant="default">
                Propose a Collaborative
            </Button>
          </Link>
        </Group>

        <Title order={3} mt="lg" mb="md" pt="sm" pb="lg">
            Approve collaboratives
        </Title>

        {collabsNeedingApproval?.map((collab) => (
          <Card key={collab.id} shadow="sm" radius="md" withBorder mt="lg" p="xl" bg="var(--mantine-color-body)">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                <div>
                    <Text ta="left" fz="lg" fw={500}
                      mb="lg"
                      style={{ 
                        color: '#0077b5', 
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                      component={Link}
                      to={`/collaboratives/${collab.id}`}
                      state={{ from: location.pathname }}>
                        {collab.name}
                    </Text>
                    <Text ta="left" c="dimmed" fz="sm">
                        {collab.description}
                    </Text>
                    <Text ta="left" fz="sm" mt="sm">
                        <span style={{ color: "var(--mantine-color-dimmed)" }}>Website:</span><br/>{collab.websiteUrl}
                    </Text>
                    <Text ta="left" fz="sm" mt="sm">
                        <span style={{ color: "var(--mantine-color-dimmed)" }}>Collab Leader:</span><br/>tommy.bob@gmail.com
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
                        <Button
                          variant="outline"
                          onClick={() => handleCollabApproval(collab.id,'approve')}>
                            Approve
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleCollabApproval(collab.id,'decline')}>
                            Decline
                        </Button>
                    </SimpleGrid>
                </Grid.Col>
                <Grid.Col span={8} mt="lg">
                </Grid.Col>
            </Grid>

        </Card>
        ))}

        {collabInvites?.map((invite) => (
          <Card 
            key={`${invite.userId}-${invite.collabId}`}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mt="lg"
            mb="lg">
              <Group justify="space-between">
                <img src={invite.collabLogoUrl} alt="Collaborative Logo" width={60} />
                <Text>
                    You've been invited to join the collaborative<br/><strong><Link to={`/collaboratives/${invite.collabId}`} state={{ from: location.pathname }} style={{ textDecoration: 'none', color: '#0077b5' }}>{invite.collabName}</Link></strong> as a <strong>{invite.userRole}</strong>.
                </Text>
                <div>
                  <Button
                    variant="default"
                    onClick={() => handleCollabInvite(invite.collabId, invite.userId, 'accept')}>
                      Accept Invitation
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleCollabInvite(invite.collabId, invite.userId, 'decline')}
                    ml="md">
                      Decline Invitation
                  </Button>
                </div>
              </Group>
          </Card>
        ))}

        {csaApprovalRequests?.map((csaAR) => (
          <Card 
            key={`${csaAR.userId}-${csaAR.collabId}`}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mt="lg"
            mb="lg">
              <Group justify="space-between">
                  <img src={csaAR.collabLogoUrl} alt="Collaborative Logo" width={60} />
                  <Text>
                      To become an active member of the <strong>{csaAR.collabName}</strong><br/>collaborative please click the button on the right.
                  </Text>
                  <div>
                    <Button 
                      component={Link} 
                      to={`/collaboratives/${csaAR.collabId}/csa-agreement?userId=${csaAR.userId}`}
                      state={{ from: location.pathname }}
                      variant="default"
                      mb="sm"
                    >
                      Read and Accept CSA
                    </Button>
                  </div>
              </Group>
          </Card>
        ))}

        <Title order={3} mt="lg" mb="md" pt="sm" pb="lg">
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
                    <Text fz="lg" fw={500} 
                      style={{ 
                        color: '#0077b5', 
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                      component={Link}
                      to={`/members/${user.id}`}
                      state={{ from: location.pathname }}
                      >
                      {user.firstName} {user.lastName}
                    </Text>
                    <br/>
                    <Text 
                      fz="sm" 
                      c="dimmed"
                      component="a"
                      href={`mailto:${user.username}`}
                      style={{
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {user.username}
                    </Text>
                    <br/>
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
                  allowDeselect={false}
                  onChange={(value) => handleRoleChange(user.id, value)}
                />
              )}

              <Button
                variant="outline"
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