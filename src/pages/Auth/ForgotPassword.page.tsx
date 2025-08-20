import { useState } from 'react';
import { Button, Card, Container, Stack, Text, TextInput, Title } from '@mantine/core';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        new URL('forgotPassword', import.meta.env.VITE_API_BASE),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email }),
        }
      );

      // Always show success, even if email not found
      if (!res.ok) {
        // Optionally parse error, but still set sent
        // const data = await res.json();
      }
      setSent(true);
    } catch (err) {
      // Still set sent to avoid email enumeration
      setSent(true);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Card withBorder padding="lg" radius="md" shadow="sm">
        <Title order={2} mb="md">Forgot password</Title>
        {sent ? (
          <Text>
            If an account exists for that email, a reset link has been sent.
            Please check your inbox.
          </Text>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              {error && <Text c="red">{error}</Text>}
              <Button type="submit">Send reset link</Button>
            </Stack>
          </form>
        )}
      </Card>
    </Container>
  );
}