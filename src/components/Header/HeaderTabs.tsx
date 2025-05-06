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

const tabs = [
  'Home',
  'Projects',
  'Members',
  'Treasury',
  'Wallet',
];

export function HeaderTabs() {
  // const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { collaborativeId } = useCollaborativeContext();
  const isCollaborativeRoute = Boolean(collaborativeId);


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

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
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
                defaultValue="Home"
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