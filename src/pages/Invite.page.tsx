import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Card,
  Group,
} from '@mantine/core';

export function Invite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract the token from the query parameter
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invitation token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(new URL('accept-invite', import.meta.env.VITE_API_BASE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, firstName, lastName, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept the invitation.');
      }

      setSuccess(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError('An error occurred while accepting the invitation. Please try again.');
    }
  };

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">
          Complete Your Invitation
        </Title>
        {error && (
          <Text c="red" mb="md">
            {error}
          </Text>
        )}
        {success ? (
          <Text c="green" size="md">
            Invitation accepted successfully! You can now log in.
          </Text>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                required
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                required
              />
              <Group justify="right">
                <Button type="submit" variant="default">
                  Complete Invitation
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Card>
    </Container>
  );
}