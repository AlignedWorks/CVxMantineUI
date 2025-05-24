import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  Container,
  Avatar,
  Title,
  Card,
  Text,
  Group,
  Button,
  Badge,
  Grid,
  SimpleGrid,
  Stack,
  Loader,
} from '@mantine/core';
import {
  IconAt,
  IconBrandLinkedin,
  IconPhoneCall,
  IconMapPin,
} from '@tabler/icons-react'

interface User {
  userName: string;
  firstName: string;
  lastName: string;
  bio: string;
  city: string;
  state: string;
  phoneNumber: string;
  linkedIn: string;
  avatarUrl: string;
  createdAt: string;
  memberStatus: string;
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  const fetchUserData = () => {
    setLoading(true);  // Set loading to true before fetching
    try {
      fetch(
        new URL("profile", import.meta.env.VITE_API_BASE),
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => { 
          setUser(data);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((err) => 
          {
            console.error("Error fetching profile:", err);
            setLoading(false); // Set loading to false even if there's an error
          });
      } catch (err) {
        console.error("Error forming URL:", err);
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to="/dashboard" style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      {loading ? ( // Show a loader while loading
        <Loader size="lg" />
      ) : user ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder mt="lg" ml="lx">
          <Grid>
            <Grid.Col span={3}>
              <Avatar src={user.avatarUrl} size={120} radius={120} mb="xl" ml="lg" />
            </Grid.Col>
            <Grid.Col span={9}>
              <Stack>
                <Title order={2}>{user.firstName + " " + user.lastName}</Title>
                <SimpleGrid cols={2} mb="lg">
                  <div>
                    <Group wrap="nowrap" gap={10} mt={3}>
                      <IconAt stroke={1.5} size={16} />
                      <Text>
                        {user.userName}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconPhoneCall stroke={1.5} size={16} />
                      <Text>
                        {user.phoneNumber}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconMapPin stroke={1.5} size={16} />
                      <Text>
                        {user.city}, {user.state}
                      </Text>
                    </Group>
                  </div>
                  <div>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconBrandLinkedin stroke={1.5} size={18} />
                      <Text>
                      {user?.linkedIn ? (
                        <a
                          href={user.linkedIn}
                          style={{ color: '#0077b5', textDecoration: 'none' }}
                          target="_blank"
                          rel="noopener noreferrer">
                          {user.linkedIn.split('linkedin.com/in/')[1]}
                        </a>
                      ) : (
                        'N/A'
                      )}
                      </Text>
                    </Group>
                    <span style={{ color: 'grey'}}>Member since:</span>  {user.createdAt}
                    <br/>
                    <span style={{ color: 'grey'}}>Member status:</span>  {user.memberStatus}
                  </div>
                </SimpleGrid>
              </Stack>
              <p>
                {user.bio}<br /><br />
              </p>
              <SimpleGrid cols={2} mb="lg">
                  <div>
                    Skills<br/>
                    {user.skills && user.skills.length > 0 ? (
                      <Group gap="xs" mt="xs">
                        {user.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="light"
                            color="blue"
                          >
                            {skill.value}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No skills listed</Text>
                    )}
                  </div>
                  <div>
                    Experience<br/>
                    {user.experience && user.experience.length > 0 ? (
                      <Group gap="xs" mt="xs">
                        {user.experience.map((exp) => (
                          <Badge
                            key={exp.id}
                            variant="light"
                            color="green"
                          >
                            {exp.value}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No experience listed</Text>
                    )}
                  </div>
                </SimpleGrid>
            </Grid.Col>
          </Grid>
        </Card>
      ) : (
        <p>No user data available.</p>
      )}

      <Group justify="right" mt="xl">
        <Link to="/user-profile/edit" style={{ textDecoration: 'none' }}>
          <Button variant="default">
            Edit Profile
          </Button>
        </Link>
      </Group>
    </Container>
    </>
  );
}