import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
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
}

const mock_user = [
  {
    userName: 'jordonbyers@gmail.com',
    firstName: 'Jordon',
    lastName: 'Byers',
    bio: 'A passionate developer and designer with a love for creating beautiful and functional applications.',
    city: "Mechanicsburg",
    state: "PA",
    phoneNumber: '(717) 206-7137',
    linkedIn: 'https://www.linkedin.com/in/jordonbyers/',
    avatarUrl: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    createdAt: '01-01-2023',
    memberStatus: 'NetworkOwner',
  }
]

export function MemberProfile() {
    const { id } = useParams(); // Get the 'id' parameter from the URL
    const [user, setUser] = useState<User | null>(null);

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
            setUser(mock_user[0]);
          });
      } catch (err) {
        console.error("Error forming URL:", err);
        setUser(mock_user[0]); // Fallback to mock data
      }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  return (
    <>
    <Container size="md" py="xl">
        {/* Back Link */}
        <Link to="/member-directory" style={{ textDecoration: 'none', color: '#0077b5' }}>
            &larr; Back
        </Link>
      { user ? (
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
                          <a href={user.linkedIn} style={{ color: '#0077b5', textDecoration: 'none' }}>
                            {user.linkedIn.split('linkedin.com/in/')[1]}
                          </a>
                        ) : (
                          'N/A'
                        )}
                        </Text>
                      </Group>
                      <span style={{ color: 'grey'}}>Member since:</span>  {new Date(user.createdAt).toLocaleDateString()}
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
                      <Badge variant="light" color="blue">
                        Design & Creative
                      </Badge>
                      <Badge variant="light" color="blue">
                        Development & IT
                      </Badge>
                    </div>
                    <div>
                      Experience<br/>
                      <Badge variant="light" color="green">
                        Non-Profit
                      </Badge>
                    </div>
                  </SimpleGrid>
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