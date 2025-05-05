import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Link } from 'react-router-dom';
import {
  Button,
  Group,
 } from '@mantine/core';
import { Hero } from '../components/Hero/Hero'

export function Home() {

  return (
    <>
      <Welcome />
    </>
  );
}