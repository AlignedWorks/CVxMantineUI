import { useState, useEffect } from 'react';
import {
  IconFolder
} from '@tabler/icons-react';
import { Group, useMantineColorScheme } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import classes from './Navbar.module.css';

const data = [
  { link: '/collaborative-directory', label: 'Collaborative Directory', icon: IconFolder },
  { link: '/member-directory', label: 'Member Directory', icon: IconFolder },
];

export function NavbarSimple() {
  const [active, setActive] = useState('');
  const { colorScheme } = useMantineColorScheme();
  const location = useLocation(); // Hook to get the current route
  const logo = colorScheme === 'dark' ? '/assets/CVxLogoBlack.png' : '/assets/CVxLogoWhite.png';

  // Update active state based on the current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = data.find((item) => item.link === currentPath);
    setActive(activeItem ? activeItem.label : ''); // Clear active state if no match
  }, [location.pathname]); // Run this effect whenever the route changes

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Link to="/">
          <img src={logo} alt="Logo" className={classes.logo} />
          </Link>
        </Group>
        {links}
      </div>
    </nav>
  );
}