import "@mantine/core/styles.css";
import { MantineProvider, AppShell } from "@mantine/core";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from './AuthContext.tsx';
import { NavbarSimple } from './components/Navbar/Navbar';;
// import { HeaderMegaMenu } from './components/Header/HeaderMegaMenu';
import { HeaderTabs } from './components/Header/HeaderTabs';
import { theme } from "./theme";
import { Home } from './pages/Home.page';
import { AuthenticationTitle } from './components/AuthenticationTitle/AuthenticationTitle';
import { RegistrationTile } from './components/RegistrationTile/RegistrationTile';
import { CollaborativeDirectory } from './pages/CollaborativeDirectory.page';
import { MemberDirectory } from './pages/MemberDirectory.page';
import { UserProfile } from './pages/UserProfile.page';
import { CreateCollaborative } from './pages/CreateCollaborative.page.tsx';
import { NotFound } from './components/404/NotFound.tsx';
import { Dashboard } from "./pages/Dashboard.page.tsx";
import { CollaborativeHome } from './pages/Collaborative/Home.page.tsx';


export default function App() {
  const [opened] = useDisclosure();
  const { user } = useAuth(); // Get the user from the AuthContext

  return (
    <MantineProvider theme={theme}>
      <Router>
        <AppShell
          layout="alt"
          header={{ height: 49 }}
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

          <AppShell.Navbar><NavbarSimple /></AppShell.Navbar>

          <AppShell.Main>
          <Routes>
              <Route path="/" element={user ? <Dashboard /> : <Home />} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
              <Route path="/login" element={<AuthenticationTitle />} />
              <Route path="/register" element={<RegistrationTile />} />
              <Route path="/collaborative-directory" element={<CollaborativeDirectory />} />
              <Route path="/member-directory" element={<MemberDirectory />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/create-collaborative" element={<CreateCollaborative />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/collaboratives/:id" element={<CollaborativeHome/>} />
            </Routes>
          </AppShell.Main>
          
        </AppShell>
      </Router>
    </MantineProvider>
  );
}
