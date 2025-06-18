import { useState } from 'react';
import {
  IconUser,
  IconChevronDown,
  IconLogout,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  Tabs,
  Text,
  UnstyledButton,
  Button,
  Stack,
  Drawer,
  NavLink,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../AuthContext.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext';
import classes from './HeaderTabs.module.css';

// Define tab data with paths
const tabsData = [
  { key: 'Home', path: '' },
  { key: 'Projects', path: '/projects' },
  { key: 'Members', path: '/members' },
  { key: 'Treasury', path: '/treasury' },
  { key: 'Wallet', path: '/wallet' },
];

export function HeaderTabs() {
  // const theme = useMantineTheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { collaborativeId } = useCollaborativeContext();
  const isCollaborativeRoute = Boolean(collaborativeId);
  const navigate = useNavigate();
  const logo = '/assets/CVxLogoWhite.png';

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (!collaborativeId) return 'Home';
    
    const currentPath = location.pathname;
    const collaborativeBasePath = `/collaboratives/${collaborativeId}`;
    
    // Special case for the Home tab (which has an empty path)
    if (currentPath === collaborativeBasePath) {
      return 'Home';
    }
    
    // For other tabs, extract the part after the collaborative ID
    const pathSuffix = currentPath.slice(collaborativeBasePath.length);
    
    const foundTab = tabsData.find(tab => {
      // Match exact paths or paths that start with the tab path followed by a slash
      return pathSuffix === tab.path || 
            (tab.path !== '' && pathSuffix.startsWith(`${tab.path}/`));
    });
    
    return foundTab?.key || 'Home';
  };

  const handleLogout = async () => {
    try {
        const response = await fetch(
          new URL("logout", import.meta.env.VITE_API_BASE),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({}) // Empty body as expected by the endpoint
        });

        if (response.ok) {
            logout(); // Call the logout function from AuthContext
            navigate("/login"); // Redirect to login page
            setMessage('Logout successful');
            console.log(message);
            setError(null);
        } else {
            setError('Failed to logout');
            console.log(error);
            setMessage(null);
        }
    } catch (err) {
        setError('An error occurred');
        console.log(error);
        setMessage(null);
    }
};

  // Function to navigate to the tab's URL
  const handleTabChange = (value: string | null) => {
    if (!value) return; // Handle null case gracefully
    const tab = tabsData.find(t => t.key === value);
    if (tab && collaborativeId) {
      // For Home tab, navigate to base collaborative path
      const path = tab.key === 'Home' 
        ? `/collaboratives/${collaborativeId}`
        : `/collaboratives/${collaborativeId}${tab.path}`;
      navigate(path);
    }
  };

  // Handle mobile navigation
  const handleMobileNavClick = (tabKey: string) => {
    handleTabChange(tabKey);
    close(); // Close the drawer after navigation
  };

  const items = tabsData.map((tab) => (
    <Tabs.Tab value={tab.key} key={tab.key}>
      {tab.key}
    </Tabs.Tab>
  ));

  // Mobile navigation items
  const mobileNavItems = tabsData.map((tab) => (
    <NavLink
      key={tab.key}
      label={tab.key}
      active={getActiveTab() === tab.key}
      onClick={() => handleMobileNavClick(tab.key)}
      style={{ borderRadius: '8px', marginBottom: '4px' }}
    />
  ));

  return (
    <>
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">

          {/* Logo - visible on mobile */}
            <Image
              src={logo}
              alt="CVx Logo"
              hiddenFrom="sm"
              style={{ 
                height: '32px', 
                width: 'auto'
              }}
            />


          <div>
            {/* Desktop tabs - only visible on larger screens */}
            {isCollaborativeRoute && (
              <Tabs
                value={getActiveTab()}
                onChange={handleTabChange}
                variant="outline"
                visibleFrom="sm"
                classNames={{
                  root: classes.tabs,
                  list: classes.tabsList,
                  tab: classes.tab,
                }}
              >
                <Tabs.List>{items}</Tabs.List>
              </Tabs>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Desktop user menu - hidden on mobile */}
            {user ? (
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                    visibleFrom="sm" // Only show on desktop
                  >
                    <Group gap={7}>
                      {user.avatarUrl ? (
                        <Avatar src={user.avatarUrl} alt={user.firstName + ' ' + user.lastName} radius="xl" size={30} />
                      ) : (
                        <Avatar alt={user.firstName + ' ' + user.lastName} color="blue" radius="xl" size={30} />
                      )}
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        { user.firstName ? user.firstName + ' ' + user.lastName : user.username }
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    to="/user-profile"
                    leftSection={<IconUser size={16} stroke={1.5} />}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconLogout size={16} stroke={1.5} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Link to="/login">
                <Button variant="default" visibleFrom="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Burger menu - always rightmost on mobile */}
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </div>
        </Group>
      </Container>
    </div>

    {/* Mobile Navigation Drawer */}
    <Drawer
      opened={opened}
      onClose={close}
      title="CVx"
      padding="md"
      size="lg"
      position="top"
    >
      <Stack gap="xs">
        {/* User section at top of mobile menu */}
        {user ? (
          <>
            <Group gap="sm">
              {user.avatarUrl ? (
                <Avatar src={user.avatarUrl} size={24} radius="xl" />
              ) : (
                <Avatar color="blue" size={24} radius="xl" />
              )}
              <Text fw={500} size="sm">
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
              </Text>
            </Group>
            <NavLink
              label="Profile"
              component={Link}
              to="/user-profile"
              onClick={close}
              style={{ borderRadius: '8px', marginBottom: '8px', padding: '12px' }}
              leftSection={<IconUser size={16} />}
            />
            <NavLink
              label="Logout"
              onClick={() => {
                handleLogout();
                close();
              }}
              style={{ borderRadius: '8px', marginBottom: '16px' }}
              leftSection={<IconLogout size={16} />}
              color="red"
            />
          </>
        ) : (
          <NavLink
            label="Sign In"
            component={Link}
            to="/login"
            onClick={close}
            style={{ borderRadius: '8px', marginBottom: '16px' }}
            fw="bold"
          />
        )}

        {/* Navigation links */}
        <NavLink
          label="Dashboard"
          onClick={() => {
            navigate('/dashboard');
            close();
          }}
          fw="bold"
        />
        <NavLink
          label="Collaborative Directory"
          onClick={() => {
            navigate('/collaborative-directory');
            close();
          }}
          fw="bold"
        />
        <NavLink
          label="Member Directory"
          onClick={() => {
            navigate('/member-directory');
            close();
          }}
          fw="bold"
        />
        
        {/* Collaborative tabs - only show when in a collaborative */}
        {isCollaborativeRoute && (
          <>
            <Text size="md" c="dimmed" mt="md" mb="xs" px="sm">
              COLLABORATIVE
            </Text>
            {mobileNavItems}
          </>
        )}
      </Stack>
    </Drawer>
    </>
  );
}