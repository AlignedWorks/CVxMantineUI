import { Container, Title } from '@mantine/core';
import { TableSort } from '../components/Table/TableSort';

export function CollaborativeDirectory() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} align="left" mb="md" pt="xl" pb="xl">
        Collaborative Directory
      </Title>
      <TableSort />
    </Container>
  );
}