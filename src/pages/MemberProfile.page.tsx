import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Avatar,
  Title,
  Card,
  Text,
  Group,
  Badge,
  Grid,
  Stack,
  Center,
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
  collaboratives: string[];
  skills: { id: number; value: string }[];
  experience: { id: number; value: string }[];
}

export function MemberProfile() {
  const location = useLocation();
  const { id } = useParams(); // Get the 'id' parameter from the URL
  const [user, setUser] = useState<User | null>(null);

  // Get the "from" state or default to a fallback
  const from = location.state?.from || '/member-directory';

  const fetchMemberData = () => {
    try {
        fetch(`https://cvx.jordonbyers.com/members/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => { 
             setUser(data);
        })
        .catch((err) => 
          {
            console.error("Error fetching profile:", err);
          });
      } catch (err) {
        console.error("Error forming URL:", err);
      }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  return (
    <>
    <Container size="md" py="xl">
        {/* Back Link */}
        <Link to={from} style={{ textDecoration: 'none', color: '#0077b5' }}>
            &larr; Back
        </Link>
      { user ? (
          <Card shadow="sm" padding="xl" radius="md" withBorder mt="lg" ml="lx">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 12, md: 3 }}>
                <Center>
                  <Avatar src={user.avatarUrl} size={120} radius={120}/>
                </Center>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 12, md: 9 }}>
                <Title order={1} ta="center" hiddenFrom="md" mb="xl">
                  {user.firstName + " " + user.lastName}
                </Title>
                <Title order={1} visibleFrom="md" mb="xl">
                  {user.firstName + " " + user.lastName}
                </Title>
  
                <Text fz="sm" c="dimmed" mt="lg">
                  Bio
                </Text>
                <Text fz="md" mb="xl">
                  {user.bio ? user.bio : 'No bio available.'}
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 12, md: 7 }}>
                    <Stack mt="sm">
                      <Group wrap="nowrap" gap={10}>
                        <IconAt stroke={1.5} size={18} />
                        <Text 
                          component="a"
                          href={`mailto:${user.userName}`}
                          style={{
                            color: '#0077b5',
                            textDecoration: 'none',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {user.userName}
                        </Text>
                      </Group>
                      <Group wrap="nowrap" gap={10}>
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
                            "No LinkedIn provided"
                          )}
                        </Text>
                      </Group>
                      <Group wrap="nowrap" gap={10} mt={5}>
                        <IconPhoneCall stroke={1.5} size={18} />
                        <Text>
                          {user.phoneNumber}
                        </Text>
                      </Group>
                      <Group wrap="nowrap" gap={10} mt={5}>
                        <IconMapPin stroke={1.5} size={18} />
                        <Text>
                          {user.city}, {user.state}
                        </Text>
                      </Group>
                      <div>
                        <Text fz="sm" c="dimmed">
                          Member Since
                        </Text>
                        <Text fz="md">
                          {user.createdAt}
                        </Text>
                      </div>
                      <div>
                        <Text fz="sm" c="dimmed">
                          Member Status
                        </Text>
                        <Text fz="md">
                          {user.memberStatus}
                        </Text>
                      </div>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 12, md: 5 }}>
                    <Text fz="sm" c="dimmed" mt="sm">
                      Collaboratives
                    </Text>
                    {user.collaboratives && user.collaboratives.length > 0 ? (
                      <Group gap="xs" mt="xs">
                        {user.collaboratives.map((collab) => (
                          <Badge
                            variant="light"
                            color="yellow"
                          >
                            {collab}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No collaboratives listed</Text>
                    )}
                    <br/>
  
                    <Text fz="sm" c="dimmed">
                      Skills
                    </Text>
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
                    <br/>
                    
                    <Text fz="sm" c="dimmed">
                      Experience
                    </Text>
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
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Card>
      ) : (
        <p></p>
      )}

    </Container>
    </>
  );
}