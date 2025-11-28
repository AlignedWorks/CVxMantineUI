import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
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
  Button
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
  const [member, setMember] = useState<User | null>(null);
  const { user } = useAuth();

  // Get the "from" state or default to a fallback
  const from = location.state?.from || '/member-directory';

  const fetchMemberData = () => {
    try {
      fetch(
        "/api/members/${id}",
      {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => { 
          setMember(data);
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
      { member ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder mt="lg" ml="lx">
          <Grid>
            <Grid.Col span={{ base: 12, sm: 12, md: 3 }}>
              <Center>
                <Avatar src={member.avatarUrl} size={120} radius={120}/>
              </Center>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 12, md: 9 }}>
              <Title order={2} ta="center" hiddenFrom="md" mb="xl">
                {member.firstName + " " + member.lastName}
              </Title>
              <Title order={1} visibleFrom="md" mb="xl">
                {member.firstName + " " + member.lastName}
              </Title>

              <Text fz="sm" c="dimmed" mt="lg">
                Bio
              </Text>
              <Text fz="md" mb="xl">
                {member.bio ? member.bio : 'No bio available.'}
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 12, md: 7 }}>
                  <Stack mt="sm">
                    <Group wrap="nowrap" gap={10}>
                      <IconAt stroke={1.5} size={18} />
                      <Text 
                        component="a"
                        href={`mailto:${member.userName}`}
                        style={{
                          color: '#0077b5',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {member.userName}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10}>
                      <IconBrandLinkedin stroke={1.5} size={18} />
                      <Text>
                        {member?.linkedIn ? (
                          <a
                            href={member.linkedIn}
                            style={{ color: '#0077b5', textDecoration: 'none' }}
                            target="_blank"
                            rel="noopener noreferrer">
                            {member.linkedIn.split('linkedin.com/in/')[1]}
                          </a>
                        ) : (
                          "No LinkedIn provided"
                        )}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconPhoneCall stroke={1.5} size={18} />
                      <Text>
                        {member.phoneNumber}
                      </Text>
                    </Group>
                    <Group wrap="nowrap" gap={10} mt={5}>
                      <IconMapPin stroke={1.5} size={18} />
                      <Text>
                        {member.city}, {member.state}
                      </Text>
                    </Group>
                    <div>
                      <Text fz="sm" c="dimmed">
                        Member Since
                      </Text>
                      <Text fz="md">
                        {member.createdAt}
                      </Text>
                    </div>
                    <div>
                      <Text fz="sm" c="dimmed">
                        Member Status
                      </Text>
                      <Text fz="md">
                        {member.memberStatus}
                      </Text>
                    </div>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 12, md: 5 }}>
                  <Text fz="sm" c="dimmed" mt="sm">
                    Collaboratives
                  </Text>
                  {member.collaboratives && member.collaboratives.length > 0 ? (
                    <Group gap="xs" mt="xs">
                      {member.collaboratives.map((collab) => (
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
                  {member.skills && member.skills.length > 0 ? (
                    <Group gap="xs" mt="xs">
                      {member.skills.map((skill) => (
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
                  {member.experience && member.experience.length > 0 ? (
                    <Group gap="xs" mt="xs">
                      {member.experience.map((exp) => (
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

      {user?.userId === id && (
        <Group justify="right" mt="xl">
          <Link to="/user-profile/edit" style={{ textDecoration: 'none' }}>
            <Button variant="default">
              Edit User Profile
            </Button>
          </Link>
        </Group>
      )}
    </Container>
    </>
  );
}