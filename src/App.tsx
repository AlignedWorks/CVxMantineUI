import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import { MantineProvider, AppShell } from "@mantine/core";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ImageUpload } from './components/ImageUpload.page.tsx';
import { FileUpload } from './components/FileUpload.page.tsx';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from './AuthContext.tsx';
import { useLocation } from 'react-router-dom';
import { NavbarSimple } from './components/Navbar/Navbar';;
// import { HeaderMegaMenu } from './components/Header/HeaderMegaMenu';
import { HeaderTabs } from './components/Header/HeaderTabs';
import { theme } from "./theme";
import { Home } from './pages/Home.page';
import { AuthenticationTitle } from './components/AuthenticationTitle/AuthenticationTitle';
import { RegistrationTile } from './components/RegistrationTile/RegistrationTile';

import { CollaborativeDirectory } from './pages/CollaborativeDirectory.page';
import { CreateCollaborative } from './pages/CreateCollaborative.page.tsx';
import { EditCollaborative } from './pages/Collaborative/Edit.page.tsx';

import { MemberDirectory } from './pages/MemberDirectory.page';
import { MemberProfile } from "./pages/MemberProfile.page.tsx";
import { UserProfile } from './pages/UserProfile.page';
import { EditUserProfile } from "./pages/EditUserProfile.page.tsx";

import { CollaborativeHome } from './pages/Collaborative/Home.page.tsx';
import { CollaborativeMembers } from './pages/Collaborative/Members.page.tsx';
import { CollaborativeProjects } from './pages/Collaborative/Projects.page.tsx';
import { CollaborativeTreasury } from "./pages/Collaborative/Treasury.page.tsx";
import { EditCollaborativeTreasury } from './pages/Collaborative/EditTreasury.page';
import { CollaborativeMemberWallet } from './pages/Collaborative/Wallet.page.tsx';
import { CSAAgreement } from './pages/Collaborative/CSAAgreement.page.tsx';

import { ProjectHome } from './pages/Project/Home.page.tsx';
import { ProjectMembers } from './pages/Project/Members.page.tsx';
import { ProjectMilestones } from './pages/Project/Milestones.page.tsx';
import { ProjectMilestoneDetail } from './pages/Project/MilestoneDetail.page.tsx';

import { CreateProject } from './pages/CreateProject.page.tsx';

import { Test } from "./pages/Test.page.tsx";
import { NotFound } from './components/404/NotFound.tsx';
import { Dashboard } from "./pages/Dashboard.page.tsx";
import { Invite } from './pages/Invite.page.tsx';

import { Container, Group, Text } from '@mantine/core';

// Create a new component for the main content
function MainContent({ user }: { user: any }) {
  const location = useLocation();
  
  // Check if we're on a project page
  const isProjectPage = location.pathname.match(/^\/collaboratives\/\d+\/projects\/\d+/);
  
  // Get the base project path (without /milestones, /members, or milestone IDs)
  const getBaseProjectPath = () => {
    if (!isProjectPage) return '';
    // Remove /milestones/:id, /milestones, or /members from the end
    return location.pathname.replace(/\/(milestones\/[^\/]+|milestones|members)$/, '');
  };
  
  const baseProjectPath = getBaseProjectPath();

  // Helper function to check if we're on the project home page
  const isProjectHomePage = () => {
    const projectHomePattern = /^\/collaboratives\/\d+\/projects\/\d+$/;
    return projectHomePattern.test(location.pathname);
  };

  // Helper function to check if we're on any milestones page (list or detail)
  const isMilestonesPage = () => {
    return location.pathname.includes('/milestones');
  };

  // Helper function to check if we're on the members page
  const isMembersPage = () => {
    return location.pathname.includes('/members');
  };

  return (
    <>
      {/* Secondary Menu Band for Project Pages */}
      {isProjectPage && (
        <div style={{
          backgroundColor: '#F4F4F4',
          padding: '8px 0',
          borderBottom: '1px solid #dee2e6',
          margin: '-16px -16px 16px -16px' // Negative margins to counteract AppShell padding
        }}>
          <Container size="md">
            <Group justify="center" gap="lg" pt="xs">
              <Text 
                component={Link}
                to={baseProjectPath}
                size="sm" 
                fw={500}
                style={{ 
                  textDecoration: 'none',
                  color:  isProjectHomePage() ? '#0077b5' : '#495057'
                }}
              >
                Home
              </Text>
              <Text 
                component={Link}
                to={`${baseProjectPath}/milestones`}
                size="sm" 
                fw={500}
                style={{ 
                  textDecoration: 'none',
                  color: isMilestonesPage() ? '#0077b5' : '#495057'
                }}
              >
                Milestones
              </Text>
              <Text 
                component={Link}
                to={`${baseProjectPath}/members`}
                size="sm" 
                fw={500}
                style={{ 
                  textDecoration: 'none',
                  color: isMembersPage() ? '#0077b5' : '#495057'
                }}
              >
                Members
              </Text>
            </Group>
          </Container>
        </div>
      )}

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Home />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        <Route path="/login" element={<AuthenticationTitle />} />
        <Route path="/register" element={<RegistrationTile />} />
        <Route path="/collaborative-directory" element={<CollaborativeDirectory />} />
        <Route path="/member-directory" element={<MemberDirectory />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-profile/edit" element={<EditUserProfile />} />
        <Route path="/create-collaborative" element={<CreateCollaborative />} />
        <Route path="/create-project/:collabId" element={<CreateProject />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<Test/>} /> {/* Test route for development */}
        <Route path="/collaboratives/:id" element={<CollaborativeHome/>} />
        <Route path="/collaboratives/:id/edit" element={<EditCollaborative />} />
        <Route path="/collaboratives/:id/members" element={<CollaborativeMembers/>} />
        <Route path="/collaboratives/:id/projects" element={<CollaborativeProjects/>} />
        <Route path="/collaboratives/:id/treasury" element={<CollaborativeTreasury/>} />
        <Route path="/collaboratives/:id/treasury/edit" element={<EditCollaborativeTreasury />} />
        <Route path="/collaboratives/:id/wallet" element={<CollaborativeMemberWallet/>} />
        <Route path="/collaboratives/:id/csa-agreement" element={<CSAAgreement />} />
        <Route path="/collaboratives/:collabId/projects/:projectId" element={<ProjectHome />} />
        <Route path="/collaboratives/:collabId/projects/:projectId/members" element={<ProjectMembers />} />
        <Route path="/collaboratives/:collabId/projects/:projectId/milestones" element={<ProjectMilestones />} />
        <Route path="/collaboratives/:collabId/projects/:projectId/milestones/:milestoneId" element={<ProjectMilestoneDetail />} />
        <Route path="/members/:id" element={<MemberProfile/>} />
        <Route path="/upload-image" element={<ImageUpload />} />
        <Route path="/upload-file" element={<FileUpload />} />
        <Route path="/invite" element={<Invite />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [opened] = useDisclosure();
  const { user } = useAuth(); // Get the user from the AuthContext

  return (
    <MantineProvider theme={theme}>
      <Router>
        <AppShell
          layout="alt"
          header={{ height: 58 }}
          navbar={{
            width: 250,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <HeaderTabs />
          </AppShell.Header>

          <AppShell.Navbar>
            <NavbarSimple />
          </AppShell.Navbar>

          <AppShell.Main bg="#f8f8f8">
            <MainContent user={user} />
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}
