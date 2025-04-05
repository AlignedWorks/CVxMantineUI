import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Link } from 'react-router-dom';
import { Button, Group } from '@mantine/core';
import { useEffect, useState } from "react";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  linkedIn: string;
  avatarUrl: string;
  createdAt: string;
}

export function Home() {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = () => {
    fetch("https://cvx.jordonbyers.com/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Group justify="center" mt="xl">
        <Link to="/login">
          <Button variant="default">Log in</Button>
        </Link>
        <Link to="/register">
          <Button variant="default">Register</Button>
        </Link>
        <Link to="/create-collaborative">
          <Button variant="default">Propose a Collaborative</Button>
        </Link>
      </Group>
      <Group justify="center" mt="xl">
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
          
          {user ? (
            <>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p>{user.firstName} {user.lastName}</p>
              <p>{user.username}</p>
              <p>{user.bio}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          ) : (
            <p></p>
          )}
        </div>
      </Group>
    </>
  );
}