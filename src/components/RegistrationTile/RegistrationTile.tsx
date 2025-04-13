import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './RegistrationTitle.module.css';

export function RegistrationTile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check for empty fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        setError(`The ${key} field is required.`);
        return;
      } 
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    } else {
      const payload = { email: formData.email, password: formData.password };

      const response = await fetch('https://cvx.jordonbyers.com/register', {
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
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Link to="/login">
          Sign in
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            mt="md"
            value={formData.email}
            onChange={(event) => handleInputChange('email', event.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={formData.password}
            onChange={(event) => handleInputChange('password', event.currentTarget.value)}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            value={formData.confirmPassword}
            onChange={(event) => handleInputChange('confirmPassword', event.currentTarget.value)}
          />

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Group justify="space-between" mt="lg">
            <Text size="sm" c="dimmed">
              By signing up, you agree to our terms and conditions.
            </Text>
          </Group>
          <Button fullWidth mt="xl" type="submit"> 
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

