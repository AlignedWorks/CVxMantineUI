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
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { collaborativeId } = useCollaborativeContext();
  const isCollaborativeRoute = Boolean(collaborativeId);
  const navigate = useNavigate();

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

  const items = tabsData.map((tab) => (
    <Tabs.Tab value={tab.key} key={tab.key}>
      {tab.key}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">

          <div>
            {/* Conditionally render the Tabs menu */}
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
            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            {user ? (
              <>
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
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="default">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Group>
      </Container>
    </div>
  );
}