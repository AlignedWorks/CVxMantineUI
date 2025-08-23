import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  Textarea,
  TextInput,
  Title,
  Box,
  Popover,
  Progress,
  Select,
  SimpleGrid,
} from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconX, IconCheck } from '@tabler/icons-react';
import classes from './RegistrationTitle.module.css';
import { us_states } from '../../data.ts';

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

export function RegistrationTile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    city: '',
    state: '',
    phoneNumber: '',
    linkedIn: '',
    password: '',
    confirmPassword: '',
  });

  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');
 
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    } else {
      const payload = { email: formData.email,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        bio: formData.bio,
                        city: formData.city,
                        state: formData.state,
                        phoneNumber: formData.phoneNumber,
                        linkedIn: formData.linkedIn,
                        password: formData.password
                      };

      const response = await fetch(
        new URL("register-custom", import.meta.env.VITE_API_BASE),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        navigate('/login');
      }

    setError(''); // Clear any previous errors
    console.log('Form Data:', formData);
    }
  };

  return (
    <Container size="lg" my={40}>
      <Title ta="center" className={classes.title}>
        Join the network
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Link to="/login">
          Sign in
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="md">
            <div>
              <TextInput
                label="Email"
                placeholder="Your email address"
                required
                mt="md"
                value={formData.email}
                onChange={(event) => handleInputChange('email', event.currentTarget.value)}
              />
              <TextInput
                label="First Name"
                placeholder="Your first name"
                mt="md"
                value={formData.firstName}
                onChange={(event) => handleInputChange('firstName', event.currentTarget.value)}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Your last name"
                mt="md"
                value={formData.lastName}
                onChange={(event) => handleInputChange('lastName', event.currentTarget.value)}
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
                      value={value}
                      onChange={(event) => {
                        const newValue = event.currentTarget.value;
                        setValue(newValue);
                        handleInputChange('password', newValue);
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
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                mt="md"
                value={formData.confirmPassword}
                onChange={(event) => handleInputChange('confirmPassword', event.currentTarget.value)}
              />
            </div>
            <div>
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself"
                mt="md"
                value={formData.bio}
                onChange={(event) => handleInputChange('bio', event.currentTarget.value)}
                autosize
                minRows={3}
              />
              <TextInput
                label="City"
                placeholder="Your city"
                mt="md"
                value={formData.city}
                onChange={(event) => handleInputChange('city', event.currentTarget.value)}
              />
              <Select
                label="State"
                mt="md"
                data={us_states}
                value={formData.state}
                searchable
                onChange={(value) => handleInputChange('state', value ?? '')}
              />
              <TextInput
                label="Phone Number"
                placeholder="(555) 123-4567"
                mt="md"
                value={formData.phoneNumber}
                onChange={(event) => {
                  const formatted = formatPhoneNumber(event.currentTarget.value);
                  handleInputChange('phoneNumber', formatted);
                }}
                maxLength={14} // Prevents over-typing
              />
              <TextInput
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/yourprofile"
                mt="md"
                value={formData.linkedIn}
                onChange={(event) => handleInputChange('linkedIn', event.currentTarget.value)}
              />
            </div>
          </SimpleGrid>

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit"> 
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

