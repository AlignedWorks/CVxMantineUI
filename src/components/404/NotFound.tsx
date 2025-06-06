import { Button, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './NotFound.module.css';

const notFoundImage = '/assets/404.svg';

export function NotFound() {
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={notFoundImage} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            The page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Link to="/">
            <Button variant="outline" size="md" mt="xl" className={classes.control}>
              Get back to home page
            </Button>
          </Link>
        </div>
        <Image src={notFoundImage} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
}