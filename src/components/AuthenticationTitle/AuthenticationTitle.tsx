import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
  } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classes from './AuthenticationTitle.module.css';
import { useAuth } from '../../AuthContext.tsx';

interface LoginRequest {
  email: string;
  password: string;
}

export function AuthenticationTitle() {
  const { login } = useAuth(); // Assuming `useAuth` provides a `login` function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const loginRequest: LoginRequest = { email, password };

    const response = await fetch('https://cvx.jordonbyers.com/login?useCookies=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginRequest),
    });

    if (response.ok) {
      // Fetch user profile after login
      const profileResponse = await fetch('https://cvx.jordonbyers.com/profile', {
        credentials: 'include',
      });
  
      if (profileResponse.ok) {
        const userProfile = await profileResponse.json();
        const user = {
          username: userProfile.username,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          avatarUrl: userProfile.avatarUrl,
        };
  
        login(user); // Store user in AuthContext
        navigate('/');
      } else {
        setError('Failed to fetch user profile');
      }
    } else {
      setError('Invalid email or password');
    }
  };


  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Link to="/register">
          Create account
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev" 
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}