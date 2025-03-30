import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Link } from 'react-router-dom';
import { Button, Group } from '@mantine/core';

export function Home() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Group justify="center" mt="xl">
      <Link to="/login">
        <Button variant="default">
          Log in
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="default">
          Register
        </Button>
      </Link>
      </Group>
    </>
  );
}