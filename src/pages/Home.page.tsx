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
        <Button variant="default" onClick={fetchUserData}>
          Refresh Profile
        </Button>
      </Group>
      <Group justify="center" mt="xl">
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold">Profile</h2>
          {user ? (
            <>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Bio:</strong> {user.bio}</p>
              <p><strong>LinkedIn:</strong> <a href={user.linkedIn} target="_blank" rel="noopener noreferrer">{user.linkedIn}</a></p>
              <p><strong>Avatar URL:</strong> <a href={user.avatarUrl} target="_blank" rel="noopener noreferrer">{user.avatarUrl}</a></p>
              <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </Group>
    </>
  );
}