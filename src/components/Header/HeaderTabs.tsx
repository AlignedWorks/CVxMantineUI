import { useState } from 'react';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../AuthContext.tsx';
import { Link } from 'react-router-dom';
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

  const handleLogout = async () => {
    try {
        const response = await fetch('https://cvx.jordonbyers.com/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify({}) // Empty body as expected by the endpoint
        });

        if (response.ok) {
            logout(); // Call the logout function from AuthContext
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
      <Container className={classes.mainSection} size="lg">
        <Group justify="space-between">
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
                        <Avatar src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png' alt={user.firstName + ' ' + user.lastName} radius="xl" size={30} />
                      )}
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        {user.firstName + ' ' + user.lastName}
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                    Account settings
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                    Change account
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
              <Link to="/login" style={{ marginRight: '5rem' }}>Login</Link>
            </>
          )}
          
          
        </Group>
      </Container>
    </div>
  );
}