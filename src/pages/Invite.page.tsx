import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconX, IconCheck } from '@tabler/icons-react';
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
  Box,
  Popover,
  Progress,
} from '@mantine/core';

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

export function Invite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract the token from the query parameter
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));

  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      setSuccess(true);
      setError('');
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send the invitation. Please try again.'
      );
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
              <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
                <Popover.Target>
                  <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                  >
                    <PasswordInput
                      withAsterisk
                      label="Password"
                      placeholder="Your password"
                      required
                      mt="md"
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress color={color} value={strength} size={5} mb="xs" />
                  <PasswordRequirement label="Includes at least 6 characters" meets={password.length > 5} />
                  {checks}
                </Popover.Dropdown>
              </Popover>
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