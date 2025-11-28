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
  Stack,
  Badge,
  Modal,
  TextInput,
  Textarea,
  Center,
  Tabs,
  Table,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { 
  CollabDataCompact,
  CollabInvite,
  CollabApprovalRequest,
  CollabNeedingApproval,
  ProjectSlim,
  ProjectNeedingApproval,
  ProjectInvite,
  MilestoneSlim,
  MilestoneAssignment,
  MilestoneCompletion,
  approvalStatusColors,
  approvalStatusSortOrder,
  milestoneApprovalStatusSortOrder,
} from '../data.ts';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  memberStatus: string;
  bio: string;
  linkedIn: string;
  avatarUrl: string;
}

export function Dashboard() {
  const [denialReasons, setDenialReasons] = useState<{ [userId: string]: string }>({});
  const [userApprovals, setUserApprovals] = useState<User[] | null>([]);
  const [rolesData, setRolesData] = useState<string[]>([]);
  const [collabs, setCollabs] = useState<CollabDataCompact[]>([]);
  const [collabsNeedingApproval, setCollabsNeedingApproval] = useState<CollabNeedingApproval[]>([]);
  const [decliningCollabId, setDecliningCollabId] = useState<number | null>(null);
  const [collabDeclineReasons, setCollabDeclineReasons] = useState<Record<number, string>>({});
  const [collabInvites, setCollabInvites] = useState<CollabInvite[]>([]);
  const [csaApprovalRequests, setCsaApprovalRequests] = useState<CollabApprovalRequest[]>([]);
  const [projects, setProjects] = useState<ProjectSlim[]>([]);
  const [projectsNeedingApproval, setProjectsNeedingApproval] = useState<ProjectNeedingApproval[]>([]);
  const [decliningProjectId, setDecliningProjectId] = useState<number | null>(null);
  const [projectDeclineReasons, setProjectDeclineReasons] = useState<Record<number, string>>({});
  const [projectInvites, setProjectInvites] = useState<ProjectInvite[]>([]);
  const [milestones, setMilestones] = useState<MilestoneSlim[]>([]);
  const [milestoneAssignments, setMilestoneAssignments] = useState<MilestoneAssignment[]>([]);
  const [decliningMilestoneId, setDecliningMilestoneId] = useState<number | null>(null);
  const [milestoneDeclineReasons, setMilestoneDeclineReasons] = useState<Record<number, string>>({});
  const [milestoneCompletions, setMilestoneCompletions] = useState<MilestoneCompletion[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({}); // Temporary state for selected roles
  const [submittedUsers, setSubmittedUsers] = useState<{ [userId: string]: boolean }>({});
  const [inviteModalOpen, setInviteModalOpen] = useState(false); // State to control modal visibility
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>('first');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
      fetch(
        "/api/dashboard",
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const {
            currentUser,
            usersNeedingApproval,
            roles,
            collabs,
            collabsNeedingApproval,
            collabInvites,
            csaApprovalRequests,
            projects,
            projectsNeedingApproval,
            projectInvites,
            milestoneAssignments,
            milestoneCompletions,
            milestones,
          } = data;

          console.log(collabsNeedingApproval);
          console.log(collabInvites);
          console.log(csaApprovalRequests);
          console.log(collabs);
          setCurrentUser(currentUser);
          console.log(currentUser);
          setCollabs(collabs); // Set the collabs data
          setCollabsNeedingApproval(collabsNeedingApproval); // Set the collabs needing approval data
          setCollabInvites(collabInvites); // Set the collab invites data
          setCsaApprovalRequests(csaApprovalRequests); // Set the CSA approval requests data
          setUserApprovals(usersNeedingApproval);
          setProjects(projects);
          setProjectsNeedingApproval(projectsNeedingApproval);
          setProjectInvites(projectInvites);
          setMilestones(milestones);
          setMilestoneAssignments(milestoneAssignments);
          setMilestoneCompletions(milestoneCompletions);

          // Set the roles data
          setRolesData(roles);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    };
    
  useEffect(() => {
    fetchDashboardData();

    // Poll every 30 seconds (30000ms)
    const pollInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, []);

  // Sort projects by approval status before mapping
  const sortedProjects = [...projects].sort((a, b) => {
    const aOrder = approvalStatusSortOrder[a.approvalStatus as keyof typeof approvalStatusSortOrder] || 999;
    const bOrder = approvalStatusSortOrder[b.approvalStatus as keyof typeof approvalStatusSortOrder] || 999;
    return aOrder - bOrder;
  });

  // Sort milestones by approval status before mapping
  const sortedMilestones = [...milestones].sort((a, b) => {
    const aOrder = milestoneApprovalStatusSortOrder[a.approvalStatus as keyof typeof milestoneApprovalStatusSortOrder] || 999;
    const bOrder = milestoneApprovalStatusSortOrder[b.approvalStatus as keyof typeof milestoneApprovalStatusSortOrder] || 999;
    return aOrder - bOrder;
  });

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
    // Clear denial reason if role is no longer "Denied Applicant"
    if (newRole !== 'Denied Applicant') {
      setDenialReasons(prev => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    }
  };

  const handleDenialReasonChange = (userId: string, value: string) => {
    setDenialReasons((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSubmitRoleChange = (userId: string ) => {
    const newRole = selectedRoles[userId];
    console.log(`User ID: ${userId}, New Role: ${newRole}`);
 
    fetch(
       `/api/members/${userId}`,
     {
       method: "PATCH",
       credentials: "include",
       headers: { "Content-Type": "application/json" },
        // include denial reason when denying an applicant
        body: JSON.stringify({
          role: newRole,
          reasonForDenial: denialReasons[userId] ?? '',
          networkAdmin: currentUser }),
     })
      .then((res) => res.json())
      .then((updatedUser) => {
        console.log("Role updated successfully:", updatedUser);
        
        setSubmittedUsers((prev) => ({ ...prev, [userId]: true })); // Mark as submitted

        // Remove user from userApprovals list
        setUserApprovals(prevUserApprovals => 
        prevUserApprovals?.filter(user => user.id !== userId) || null
        );

        setTimeout(() => {
          setSubmittedUsers((prev) => ({ ...prev, [userId]: false })); // Reset after 3 seconds
        }, 3000);
      })
      .catch((err) => console.error("Error updating role:", err));
  };

  const handleCollabApproval = (collabId: number, status: 'approve' | 'decline') => {
    const reason = collabDeclineReasons[collabId] ?? '';

    fetch(
      `/api/collaboratives/${collabId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reasonForDecline: reason }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((message) => {
      console.log(message);

      // Remove the approved/declined collaborative from state
      setCollabsNeedingApproval(prev =>
        prev ? prev.filter(collab => collab.id !== collabId) : prev
      );

      // Optionally clear decline reason and decliningCollabId
      setDecliningCollabId(null);
      setCollabDeclineReasons(prev => {
        const copy = { ...prev };
        delete copy[collabId];
        return copy;
      });
    })
    .catch((err) => {
      console.error(`Error approving/declining collaborative:`, err);
      // Optionally show an error message to the user
    });
  }

  const handleInitiateDecline = (id: number, declineEntityType: string) => {
    if (declineEntityType === 'collab') {
      setDecliningCollabId(id);
    } else if (declineEntityType === 'project') {
      setDecliningProjectId(id);
    } else if (declineEntityType === 'milestone') {
      setDecliningMilestoneId(id);
    }
  };

  const handleDeclineReasonChange = (id: number, declineEntityType: string, value: string) => {
    if (declineEntityType === 'collab') {
      setCollabDeclineReasons((prev) => ({ ...prev, [id]: value }));
    } else if (declineEntityType === 'project') {
      setProjectDeclineReasons((prev) => ({ ...prev, [id]: value }));
    } else if (declineEntityType === 'milestone') {
      setMilestoneDeclineReasons((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleCollabInvite = (collabId: number, userId: string, action: 'accept' | 'decline') => {
    // Determine the new status based on the action
    const newStatus = action === 'accept' ? 'Accepted' : 'Declined';
    
    fetch(
      `/api/collaboratives/${collabId}/members/${userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          inviteStatus: newStatus,
          reasonForDecline: collabDeclineReasons[collabId] ?? ''
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

  const handleProjectApproval = (projectId: number, userId: string,status: 'approve' | 'decline') => {
    const reason = projectDeclineReasons[projectId] ?? '';

    fetch(
      `/api/projects/${projectId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        userId: userId,
        reasonForDecline: reason
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((message) => {
      console.log(message);

      // Remove the approved/declined project from state
      setProjectsNeedingApproval(prev =>
        prev ? prev.filter(project => project.id !== projectId) : prev
      );

      // Optionally clear decline reason and decliningProjectId
      setDecliningProjectId(null);
      setProjectDeclineReasons(prev => {
        const copy = { ...prev };
        delete copy[projectId];
        return copy;
      });
    })
    .catch((err) => {
      console.error(`Error approving/declining collaborative:`, err);
      // Optionally show an error message to the user
    });
  }

  const handleProjectInvite = (projectId: number, userId: string, action: 'accept' | 'decline') => {
    // Determine the new status based on the action
    const newStatus = action === 'accept' ? 'Accepted' : 'Declined';
    
    fetch(
      `/api/projects/${projectId}/members/${userId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          inviteStatus: newStatus,
          reasonForDecline: projectDeclineReasons[projectId] ?? ''
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

  const handleInviteSubmit = async () => {
    try {
      const response = await fetch("api/invite", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Invitation sent successfully:', data);
      setInviteError('');
      setInviteEmail('');
      setInviteModalOpen(false);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setInviteError(
        err instanceof Error
          ? err.message
          : 'Failed to send the invitation. Please try again.'
      );
    }
  };

  const handleMilestoneAssignment = (assignmentId: number, action: 'accept' | 'decline') => {
    // Determine the new status based on the action
    const newStatus = action === 'accept' ? 'Accepted' : 'Declined';
    
    fetch(
      `/api/milestones/${assignmentId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          acceptanceStatus: newStatus,
          reasonForDecline: milestoneDeclineReasons[assignmentId] ?? ''
        }),
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Milestone assignment ${action}ed successfully:`, data);
        
        // Refresh the page so 1) collab invite is removed and 2) the collab's CSA acceptance notification can populate
        fetchDashboardData();
      })
      .catch((err) => {
        console.error(`Error ${action}ing milestone assignment:`, err);
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
            {currentUser ? currentUser.firstName + "'s " : ""}Dashboard
        </Title>

        {['Network Admin', 'Network Contributor'].includes(currentUser?.memberStatus || '') ? (
        <Group justify="flex-start" mt="xl">
          <Link to="/create-collaborative">
            <Button variant="default">
                Propose a Collaborative
            </Button>
          </Link>

          <Button variant="default" onClick={() => setInviteModalOpen(true)}>
              Invite a new user to the network
          </Button>
        </Group>
        ) : (
          <Group justify="flex-start" mt="xl">
            <Tooltip label="You must be accepted to the network as a contributor in order to propose a collaborative" multiline w={300} position="bottom" color="gray">
              <Button disabled>
                Propose a Collaborative
              </Button>
            </Tooltip>
            <Tooltip label="You must be accepted to the network as a contributor in order to invite a new user" multiline w={300} position="bottom" color="gray">
              <Button disabled>
                Invite a new user to the network
              </Button>
            </Tooltip>
          </Group>
        )}

        <Tabs value={activeTab} onChange={setActiveTab} mt="xl">
          <Tabs.List>
            <Tabs.Tab value="first" fz='lg' fw={500}>My Notifications</Tabs.Tab>
            <Tabs.Tab value="second" fz='lg' fw={500}>My Collaboratives</Tabs.Tab>
            <Tabs.Tab value="third" fz='lg' fw={500}>My Projects</Tabs.Tab>
            <Tabs.Tab value="fourth" fz='lg' fw={500}>My Milestones</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="first" pt="xl">
            {collabsNeedingApproval?.map((collab) => (
              <Card 
                key={`${collab.id}`}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mt="lg"
                mb="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={collab.logoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7 }}>
                      <Text>
                        The <strong><Link to={`/collaboratives/${collab.id}`} state={{ from: location.pathname }} style={{ textDecoration: 'none', color: '#0077b5' }}>{collab.name}</Link></strong> collaborative is ready for your approval.
                      </Text>

                      {/* If this collab is being declined, show the reason textarea here (second column) */}
                      {decliningCollabId === collab.id && (
                        <Textarea
                          mt="sm"
                          label="Reason for decline"
                          placeholder="Provide a brief reason for declining this collaborative"
                          value={collabDeclineReasons[collab.id] ?? ''}
                          onChange={(e) => handleDeclineReasonChange(collab.id, 'collab', e.currentTarget.value)}
                        />
                      )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                      <Button
                        variant="outline"
                        onClick={() => handleCollabApproval(collab.id,'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="default"
                        ml="md"
                        onClick={() => handleInitiateDecline(collab.id, 'collab')}
                      >
                        Decline
                      </Button>

                      {decliningCollabId === collab.id ? (
                        <Button
                          color="red"
                          variant="outline"
                          mt="lg"
                          onClick={() => handleCollabApproval(collab.id,'decline')}
                        >
                          Submit Decline
                        </Button>
                      ) : null}
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
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={invite.collabLogoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7 }}>
                      <Text>
                        You've been invited to join the collaborative<br/><strong><Link to={`/collaboratives/${invite.collabId}`} state={{ from: location.pathname }} style={{ textDecoration: 'none', color: '#0077b5' }}>{invite.collabName}</Link></strong> as a <strong>{invite.userRole}</strong>.
                      </Text>

                      {/* If this collab is being declined, show the reason textarea here (second column) */}
                      {decliningCollabId === invite.collabId && (
                        <Textarea
                          mt="sm"
                          label="Reason for decline"
                          placeholder="Provide a brief reason for declining this collaborative"
                          value={collabDeclineReasons[invite.collabId] ?? ''}
                          onChange={(e) => handleDeclineReasonChange(invite.collabId, 'collab', e.currentTarget.value)}
                        />
                      )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                      <Button
                        variant="outline"
                        onClick={() => handleCollabInvite(invite.collabId, invite.userId, 'accept')}>
                          Accept
                      </Button>
                      <Button
                        variant="default"
                        ml="md"
                        onClick={() => handleInitiateDecline(invite.collabId, 'collab')}
                      >
                        Decline
                      </Button>

                      {decliningCollabId === invite.collabId ? (
                        <Button
                          color="red"
                          variant="outline"
                          mt="lg"
                          onClick={() => handleCollabInvite(invite.collabId, invite.userId, 'decline')}
                        >
                          Submit Decline
                        </Button>
                      ) : null}
                    </Grid.Col>
                  </Grid>
              </Card>
            ))}

            {projectsNeedingApproval?.map((project) => (
              <Card 
                key={`${project.id}`}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mt="lg"
                mb="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={project.collabLogoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7 }}>
                      <Text>
                        The <strong><Link to={`/collaboratives/${project.collabId}/projects/${project.id}`} state={{ from: location.pathname }} style={{ textDecoration: 'none', color: '#0077b5' }}>{project.name}</Link></strong> project of the <strong>{project.collabName}</strong> collaborative is ready for your approval.
                        <br/><br/>
                        This means looking through the project's member list and milestones to make sure you agree with the project's people, work assigned and launch token allocation.
                      </Text>

                      {/* If this project is being declined, show the reason textarea here (second column) */}
                      {decliningProjectId === project.id && (
                        <Textarea
                          mt="sm"
                          label="Reason for decline"
                          placeholder="Provide a brief reason for declining this project"
                          value={projectDeclineReasons[project.id] ?? ''}
                          onChange={(e) => handleDeclineReasonChange(project.id, 'project', e.currentTarget.value)}
                        />
                      )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                      <Button
                        variant="outline"
                        onClick={() => handleProjectApproval(project.id, project.userId, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="default"
                        ml="md"
                        onClick={() => handleInitiateDecline(project.id, 'project')}
                      >
                        Decline
                      </Button>

                      {decliningProjectId === project.id ? (
                        <Button
                          color="red"
                          variant="outline"
                          mt="lg"
                          onClick={() => handleProjectApproval(project.id, project.userId, 'decline')}
                        >
                          Submit Decline
                        </Button>
                      ) : null}
                    </Grid.Col>
                  </Grid>
              </Card>
            ))}

            {projectInvites?.map((invite) => (
              <Card 
                key={`${invite.userId}-${invite.projectId}`}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mt="lg"
                mb="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={invite.collabLogoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7 }}>
                      <Text>
                        You've been invited to join the project<br/><strong><Link to={`/collaboratives/${invite.collabId}/projects/${invite.projectId}`} state={{ from: location.pathname }} style={{ textDecoration: 'none', color: '#0077b5' }}>{invite.projectName}</Link></strong> as a <strong>{invite.userRole}</strong>.
                      </Text>

                      {/* If this project is being declined, show the reason textarea here (second column) */}
                        {decliningProjectId === invite.projectId && (
                          <Textarea
                            mt="sm"
                            label="Reason for decline"
                            placeholder="Provide a brief reason for declining this project"
                            value={projectDeclineReasons[invite.projectId] ?? ''}
                            onChange={(e) => handleDeclineReasonChange(invite.projectId, 'project', e.currentTarget.value)}
                          />
                        )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                      <Button
                        variant="outline"
                        onClick={() => handleProjectInvite(invite.projectId, invite.userId, 'accept')}>
                          Accept
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleInitiateDecline(invite.projectId, 'project')}
                        ml="md">
                          Decline
                      </Button>

                      {decliningProjectId === invite.projectId     ? (
                        <Button
                          color="red"
                          variant="outline"
                          mt="lg"
                          onClick={() => handleProjectInvite(invite.projectId, invite.userId, 'decline')}
                        >
                          Submit Decline
                        </Button>
                      ) : null}
                    </Grid.Col>
                  </Grid>
              </Card>
            ))}

            {milestoneAssignments?.map((assignment) => (
              <Card 
                key={`${assignment.id}`}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mt="lg"
                mb="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={assignment.collabLogoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7 }}>
                      <Stack gap="xs">
                        <Text size="lg" fw={500}>
                          Milestone: <Text component="span" fw={400}>{assignment.name}</Text>
                        </Text>
                        <Text size="sm" c="dimmed">
                          Project: {assignment.projectName} • Collaborative: {assignment.collabName}
                        </Text>
                        <Text size="sm" mt="sm">
                          <strong>Task:</strong> {assignment.description || 'No description provided'}
                        </Text>
                        <Group gap="lg" mt="xs">
                          <Text size="sm">
                            <strong>Launch Tokens:</strong> {assignment.launchTokens}
                          </Text>
                          <Text size="sm">
                            <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                          </Text>
                        </Group>

                        {/* If this milestone is being declined, show the reason textarea here (second column) */}
                        {decliningMilestoneId === assignment.id && (
                          <Textarea
                            mt="sm"
                            label="Reason for decline"
                            placeholder="Provide a brief reason for declining this milestone"
                            value={milestoneDeclineReasons[assignment.id] ?? ''}
                            onChange={(e) => handleDeclineReasonChange(assignment.id, 'milestone', e.currentTarget.value)}
                          />
                        )}
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                      <Button
                        variant="outline"
                        onClick={() => handleMilestoneAssignment(assignment.id, 'accept')}>
                          Accept
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleInitiateDecline(assignment.id, 'milestone')}
                        ml="md">
                          Decline
                      </Button>

                      {decliningMilestoneId === assignment.id ? (
                        <Button
                          color="red"
                          variant="outline"
                          mt="lg"
                          onClick={() => handleMilestoneAssignment(assignment.id, 'decline')}
                        >
                          Submit Decline
                        </Button>
                      ) : null}

                    </Grid.Col>
                  </Grid>
              </Card>
            ))}

            {milestoneCompletions?.map((completion) => (
              <Card 
                key={`${completion.id}`}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mt="lg"
                mb="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={completion.collabLogoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 10 }}>
                      <Stack gap="xs" align="flex-start">
                        <Text size="lg" fw={500}>
                          Milestone: <Text component="span" fw={400}>{completion.name}</Text>
                        </Text>
                        <Text size="sm" c="dimmed">
                          Project: {completion.projectName} • Collaborative: {completion.collabName}
                        </Text>
                        <Text size="sm" mt="sm">
                          This milestone has been marked complete and is awaiting your approval.
                        </Text>
                        <Button
                          component={Link}
                          to={`/collaboratives/${completion.collabId}/projects/${completion.projectId}/milestones`}
                          state={{ openMilestoneId: completion.id, from: location.pathname }}
                          variant="outline">
                            Review Milestone
                        </Button>
                      </Stack>
                    </Grid.Col>
                  </Grid>
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
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 12, md: 2, lg: 2 }}>
                      <Center>
                        <img src={csaAR.collabLogoUrl} alt="Collaborative Logo" width={60} />
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7 }}>
                      <Text>
                        To become an active member of the <strong>{csaAR.collabName}</strong><br/>collaborative please click the button on the right.
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 3, lg: 3 }}>
                      <Button 
                          component={Link} 
                          to={`/collaboratives/${csaAR.collabId}/csa-agreement?userId=${csaAR.userId}`}
                          state={{ from: location.pathname }}
                          variant="default"
                          mb="sm"
                        >
                          Read and Accept CSA
                        </Button>
                    </Grid.Col>
                  </Grid>
              </Card>
            ))}

            {currentUser?.memberStatus === 'Network Admin' && Array.isArray(userApprovals) && userApprovals.length > 0 && (
              <Title order={3} mt="lg" mb="md" pt="sm" pb="lg">
                  Approve users
              </Title>
            )}

            {userApprovals?.map((user) => (
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
                          {user.linkedIn && user.linkedIn.trim() !== '' ? (
                            <a
                              href={user.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#0077b5", textDecoration: "none" }}
                            >
                              LinkedIn
                            </a>
                          ) : (
                            "No LinkedIn provided"
                          )}
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

                  {selectedRoles[user.id] === 'Denied Applicant' && (
                    <Textarea
                      label="Reason for denial"
                      placeholder="Provide a brief reason for denying this applicant"
                      mt="sm"
                      value={denialReasons[user.id] || ''}
                      onChange={(e) => handleDenialReasonChange(user.id, e.currentTarget.value)}
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
          </Tabs.Panel>

          <Tabs.Panel value="second" pt="xl">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing="xl">
              {collabs?.map((collab) => (
                <Card key={collab.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack align="center" gap="0" style={{ height: '100%' }}>

                      <img src={collab.logoUrl} alt="Collaborative Logo" height={90} />
                      <Text ta="center" fz="lg" fw={500} mt="md">
                          {collab.name}
                      </Text>
                      <Tooltip label={collab.description || 'No description available'} multiline w={300} color="gray">
                        <Text lineClamp={3} ta="center" c="dimmed" size="sm">
                            {collab.description}
                        </Text>
                      </Tooltip>
                      <Badge
                        color={approvalStatusColors[collab.status] ?? 'gray'}
                        variant="light"
                        mt="sm"
                        mb="lg"
                      >
                        {collab.status}
                      </Badge>
                    
                    <Link
                      to={`/collaboratives/${collab.id}`}
                      state={{ from: location.pathname }}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex', // Make the Link a flex container
                        flexDirection: 'column', // Ensure the button aligns properly
                        marginTop: 'auto', // Push the button to the bottom
                      }}
                    >
                      <Button variant="outline" size="sm">View Collaborative</Button>
                    </Link>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="third" pt="xl">
            
            {/* Projects list */}
            {projects && projects.length > 0 ? (
              <Card padding="lg" withBorder shadow="xs" mt="md">
                <Table.ScrollContainer minWidth={400}>
                  <Table verticalSpacing="sm" highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ verticalAlign: 'top' }}>Project</Table.Th>
                        <Table.Th style={{ verticalAlign: 'top' }}>Collaborative</Table.Th>
                        <Table.Th w={110} style={{ verticalAlign: 'top' }}>Status</Table.Th>
                        <Table.Th w={100} style={{ textAlign: 'right', verticalAlign: 'top' }}>Budget (tokens)</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {sortedProjects.map((p) => (
                        <Table.Tr key={p.id}>
                          <Table.Td style={{ verticalAlign: 'top' }}>
                            <Text
                              component={Link}
                              to={`/collaboratives/${p.collabId}/projects/${p.id}`}
                              state={{ from: location.pathname }}
                              style={{ textDecoration: 'none', color: '#0077b5' }}
                            >
                              {p.name}
                            </Text>
                          </Table.Td>
                          <Table.Td style={{ verticalAlign: 'top' }}>{p.collabName ?? '—'}</Table.Td>
                          <Table.Td style={{ verticalAlign: 'top' }}>
                            <Badge
                              color={approvalStatusColors[p.approvalStatus] ?? 'gray'}
                              variant="light"
                            >
                              {p.approvalStatus}
                            </Badge>
                          </Table.Td>
                          <Table.Td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                            {typeof p.budget === 'number' ? p.budget.toLocaleString() : (p.budget ?? '—')}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Card>
            ) : (
              <Text c="dimmed" mt="md">No projects available.</Text>
            )}
           </Tabs.Panel>

            <Tabs.Panel value="fourth" pt="xl">
              
              {/* Milestones list */}
              {sortedMilestones && sortedMilestones.length > 0 ? (
                <Card padding="lg" withBorder shadow="xs" mt="md">
                  <Table.ScrollContainer minWidth={400}>
                    <Table verticalSpacing="sm" highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th style={{ verticalAlign: 'top' }}>Milestone</Table.Th>
                          <Table.Th style={{ verticalAlign: 'top' }}>Project</Table.Th>
                          <Table.Th style={{ verticalAlign: 'top' }}>Collaborative</Table.Th>
                          <Table.Th style={{ verticalAlign: 'top' }}>Due Date</Table.Th>
                          <Table.Th w={110} style={{ verticalAlign: 'top' }}>Status</Table.Th>
                          <Table.Th w={100} style={{ textAlign: 'right', verticalAlign: 'top' }}>Payout (tokens)</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {milestones.map((m) => (
                          <Table.Tr key={m.id}>
                            <Table.Td style={{ verticalAlign: 'top' }}>
                              <Text
                                component={Link}
                                to={`/collaboratives/${m.collabId}/projects/${m.projectId}/milestones`}
                                state={{ openMilestoneId: m.id, from: location.pathname }}
                                style={{ textDecoration: 'none', color: '#0077b5' }}
                              >
                                {m.name}
                              </Text>
                            </Table.Td>
                            <Table.Td style={{ verticalAlign: 'top' }}>{m.projectName}</Table.Td>
                            <Table.Td style={{ verticalAlign: 'top' }}>{m.collabName}</Table.Td>
                            <Table.Td style={{ verticalAlign: 'top' }}>{m.dueDate ?? '—'}</Table.Td>
                            <Table.Td style={{ verticalAlign: 'top' }}>
                              <Badge
                                color={approvalStatusColors[m.approvalStatus] ?? 'gray'}
                                variant="light"
                              >
                                {m.approvalStatus}
                              </Badge>
                            </Table.Td>
                            <Table.Td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                              {typeof m.allocatedLaunchTokens === 'number' ? m.allocatedLaunchTokens.toLocaleString() : (m.allocatedLaunchTokens ?? '—')}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Card>
              ) : (
                <Text c="dimmed" mt="md">No milestones available.</Text>
              )}
            </Tabs.Panel>
        </Tabs>


        {/* Invite Member Modal */}
        <Modal
          opened={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title="Invite a new user to the network"
        >
          <Stack>
            <TextInput
              label="Email Address"
              placeholder="Enter the email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.currentTarget.value)}
              required
            />
            {inviteError && (
              <Text size="sm" c="red">
                {inviteError}
              </Text>
            )}
            <Button onClick={handleInviteSubmit} variant="default">
              Send Invitation
            </Button>
          </Stack>
        </Modal>

      </Container>
    </>
  );
}