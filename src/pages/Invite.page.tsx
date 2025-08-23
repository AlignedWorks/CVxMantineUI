import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconX, IconCheck } from '@tabler/icons-react';
import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Card,
  Group,
  Box,
  Popover,
  Progress,
  Textarea,
  Select,
  SimpleGrid,
} from '@mantine/core';
import { us_states } from '../data';

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

const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/[^\d]/g, '');
  
  // Format based on length
  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export function Invite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    bio: '',
    city: '',
    state: '',
    phoneNumber: '',
    linkedIn: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement 
      key={index} 
      label={requirement.label} 
      meets={requirement.re.test(formData.password)} 
    />
  ));

  const strength = getStrength(formData.password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invitation token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(new URL('accept-invite', import.meta.env.VITE_API_BASE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          bio: formData.bio,
          city: formData.city,
          state: formData.state,
          phoneNumber: formData.phoneNumber,
          linkedIn: formData.linkedIn,
        }),
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
            <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="xl">
              <div>
              <TextInput
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.currentTarget.value)}
                required
                mt="sm"
              />
              <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.currentTarget.value)}
                required
                mt="md"
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
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.currentTarget.value)}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress color={color} value={strength} size={5} mb="xs" />
                  <PasswordRequirement label="Includes at least 6 characters" meets={formData.password.length > 5} />
                  {checks}
                </Popover.Dropdown>
              </Popover>
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.currentTarget.value)}
                required
                mt="md"
              />
              </div>
              <div>
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={(event) => handleInputChange('bio', event.currentTarget.value)}
                autosize
                minRows={3}
                mt="sm"
              />
              <TextInput
                label="City"
                placeholder="Your city"
                value={formData.city}
                onChange={(event) => handleInputChange('city', event.currentTarget.value)}
                mt="md"
              />
              <Select
                label="State"
                data={us_states}
                value={formData.state}
                searchable
                onChange={(value) => handleInputChange('state', value ?? '')}
                mt="md"
              />
              <TextInput
                label="Phone Number"
                placeholder="(555) 123-4567"
                value={formData.phoneNumber}
                onChange={(event) => {
                  const formatted = formatPhoneNumber(event.currentTarget.value);
                  handleInputChange('phoneNumber', formatted);
                }}
                maxLength={14}
                mt="md"
              />
              <TextInput
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedIn}
                onChange={(event) => handleInputChange('linkedIn', event.currentTarget.value)}
                mt="md"
              />
              <Group mt="xl" justify="right">
                <Button type="submit" variant="outline">
                  Complete Invitation
                </Button>
              </Group>
              </div>
            </SimpleGrid>
          </form>
        )}
      </Card>
    </Container>
  );
}