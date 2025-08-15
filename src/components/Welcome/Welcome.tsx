import { Text } from '@mantine/core';
// Title was big default header previously

export function Welcome() {
  return (
    <>
      <Text fz="20px" lts="5px" ta="center" mt={20}>
        WELCOME TO THE 
      </Text>
      <Text fz="60px" c="#222" ta="center" mb="xl">
        Collaborative Value Exchange
      </Text>

      <Text ta="center" w="50%" fs="italic" fz="30px" c="#666" mt="xl" mx="auto">
        Where anyone can connect, contribute, and share upside to help launch purpose driven businesses.
      </Text>
    </>
  );
}
