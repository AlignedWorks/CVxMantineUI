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
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { put } from "@vercel/blob";
import { IconUpload } from "@tabler/icons-react";

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

export function Dashboard() {
  const [dashboard, setDashboard] = useState<User[] | null>([]);
  const [rolesData, setRolesData] = useState<string[]>([]);
  const [collabInvites, setCollabInvites] = useState<CollabInvite[]>([]);
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
          const { users, roles, collabsNeedingApproval, collabInvites } = data;

          console.log(collabsNeedingApproval);
          console.log(collabInvites);
          setCollabInvites(collabInvites); // Set the collab invites data
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

        // If the role is changed to Network Owner or Network Contributor, refresh the dashboard data
        if (newRole === "Network Owner" || newRole === "Network Contributor") {
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
        
        // Update the local state to remove the invitation
        setCollabInvites(prevInvites => 
          prevInvites.filter(invite => 
            !(invite.collabId === collabId && invite.userId === userId)
          )
        );
      })
      .catch((err) => {
        console.error(`Error ${action}ing invitation:`, err);
        // Optionally show an error message to the user
      });
  };

  return (
    <>
      <Container size="md" py="xl">
        <Title order={2} lts="4px" c="dimmed">
            COLLABORATIVE VALUE EXCHANGE
        </Title>
        <Title order={1} mb="md" pt="sm" pb="lg">
            {user ? user.firstName + "'s " : ""}Dashboard
        </Title>
        <Group justify="center" mt="xl">
          <Link to="/create-collaborative">
            <Button variant="default">
                Propose a Collaborative
            </Button>
          </Link>
          <Link
            to="/upload-image">
            <Button variant="disabled" leftSection={<IconUpload size={16} />}>
              Upload Images
            </Button>
          </Link>
        </Group>

        {collabInvites?.map((invite) => (
          <Card 
            key={`${invite.userId}-${invite.collabId}`}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            mt="lg"
            mb="lg">
              <Group justify="flex-start">
                  <img src={invite.collabLogoUrl} alt="Collaborative Logo" width={60} />
                  <Text>
                      You've been invited to join the collaborative<br/><strong><Link to={`/collaboratives/${invite.collabId}`} state={{ from: location.pathname }} style={{ textDecoration: 'none' }}>{invite.collabName}</Link></strong> as a <strong>{invite.userRole}</strong>.
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