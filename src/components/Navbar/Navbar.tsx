import { useState } from 'react';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconFolder,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Code, Group, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { MantineLogo } from '@mantinex/mantine-logo';
import lightLogo from '../../assets/CVxLogoWhite.png';
import darkLogo from '../../assets/CVxLogoBlack.png';
import classes from './Navbar.module.css';

const data = [
  { link: '/collaborative-directory', label: 'Collaborative Directory', icon: IconFolder },
  { link: '/member-directory', label: 'Member Directory', icon: IconFolder },
];

export function NavbarSimple() {
  const [active, setActive] = useState('Billing');
  const { colorScheme } = useMantineColorScheme();
  const logo = colorScheme === 'dark' ? darkLogo : lightLogo;

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
          <img src={logo} alt="Logo" className={classes.logo}/>
          </Link>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}