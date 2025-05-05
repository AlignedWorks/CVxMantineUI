import { Text } from '@mantine/core';
// Title was big default header previously

export function Welcome() {
  return (
    <>
      <Text fz="20px" lts="5px" ta="center" mt={20}>
        WELCOME TO THE 
      </Text>
      <Text fz="60px" c="#222" ta="center">
        Collaborative Value Exchange
      </Text>
    </>
  );
}
