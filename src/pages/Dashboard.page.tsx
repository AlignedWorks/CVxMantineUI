import {
  Container,
  Title,
  Button,
  Group,
} from '@mantine/core';
import { Link } from 'react-router-dom';

export function Dashboard() {

    return (
        <Container size="md" py="xl">
            <Title order={1} mb="md" pt="sm" pb="lg">
                Dashboard
            </Title>
            <Group justify="center" mt="xl">
                <Link to="/create-collaborative">
                    <Button variant="default">
                        Propose a Collaborative
                    </Button>
                </Link>

            </Group>
        </Container>
    );
}