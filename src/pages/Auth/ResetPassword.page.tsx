import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { IconX, IconCheck } from '@tabler/icons-react';
import { Anchor, Button, Card, Container, PasswordInput, Stack, Text, Title, Box, Popover, Progress } from '@mantine/core';

export function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
      <Text
        c={meets ? 'teal' : 'red'}
        style={{ display: 'flex', alignItems: 'center' }}
        mt={7}
        size="sm"
      >
        {meets ? <IconCheck size={14} /> : <IconX size={14} />}
        <Box ml={10}>{label}</Box>
      </Text>
    );
  }
  
  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
  ];
  
  function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;
  
    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
  
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');
  
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

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
              <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
                <Popover.Target>
                  <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  >
                    <PasswordInput
                      withAsterisk
                      label="New Password"
                      required
                      mt="md"
                      value={newPassword}
                      onChange={(event) => {
                        const newValue = event.currentTarget.value;
                        setValue(newValue);
                        setNewPassword(newValue);
                      }}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress color={color} value={strength} size={5} mb="xs" />
                  <PasswordRequirement label="Includes at least 6 characters" meets={value.length > 5} />
                  {checks}
                </Popover.Dropdown>
              </Popover>
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