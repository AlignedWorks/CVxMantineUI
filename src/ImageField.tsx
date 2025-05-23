import { useState } from 'react';
import { Group, Image, Button, Paper, Title, Box, BoxProps } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { ImageUpload } from './pages/ImageUpload.page.tsx';

// Extend the props to include Mantine's BoxProps (which includes margin/padding props)
interface ImageFieldProps extends BoxProps {
  label: string;
  initialImageUrl?: string;
  onImageSelected: (url: string) => void;
}

export function ImageField({
  label,
  initialImageUrl,
  onImageSelected,
  ...others // Spread the rest of the props (including mb, mt, etc.)
}: ImageFieldProps) {
  const [showUploader, setShowUploader] = useState(!initialImageUrl);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);

  console.log(`showUpLoader: ${showUploader}, imageUrl: ${imageUrl}`);
  
  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    setShowUploader(false);
    onImageSelected(url);
  };
  
  // Wrap everything in a Box component that will handle the margin props
  return (
    <Box {...others}>
      <Paper withBorder p="md" mb="md">
        <Title order={5} mb="md">{label}</Title>
        
        {(!showUploader && imageUrl) ? (
          <Group>
            <Image 
              src={imageUrl} 
              width={100} 
              height={100} 
              radius="md" 
              alt={label} 
            />
            <Button 
              variant="subtle" 
              leftSection={<IconEdit size={16} />}
              onClick={() => setShowUploader(true)}
            >
              Change Image
            </Button>
          </Group>
        ) : (
          <ImageUpload
            onSuccess={handleImageUploaded}
            onCancel={() => {
              if (imageUrl) setShowUploader(false);
            }}
          />
        )}
      </Paper>
    </Box>
  );
}