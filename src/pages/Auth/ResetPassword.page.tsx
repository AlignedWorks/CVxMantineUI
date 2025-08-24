import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Anchor, Button, Card, Container, PasswordInput, Stack, Text, Title } from '@mantine/core';

export function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(
        new URL('resetPassword', import.meta.env.VITE_API_BASE),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error resetting password');
    }
  };

  return (
    <Container size="sm" py="xl">
      <Card withBorder padding="lg" radius="md" shadow="sm">
        <Title order={2} mb="md">Reset password</Title>
        {success ? (
          <Text>Password reset successful. Redirecting to login…</Text>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack>
              <PasswordInput
                label="New password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
              />
              <PasswordInput
                label="Confirm new password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.currentTarget.value)}
              />
              {error && <Text c="red">{error}</Text>}
              <Button type="submit">Reset password</Button>
              <Anchor component={Link} to="/login" size="sm">Back to login</Anchor>
            </Stack>
          </form>
        )}
      </Card>
    </Container>
  );
}