import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import {
  Container,
  Text,
  Group,
  Button,
  Image,
  FileInput,
  Progress,
  Stack,
  Alert
} from '@mantine/core';
import { IconUpload, IconAlertCircle, IconCheck } from '@tabler/icons-react';

interface ImageUploadProps {
  onSuccess?: (url: string) => void;
  onCancel?: () => void;
}

export function ImageUpload({onSuccess, onCancel}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Call the Vercel Blob client upload function
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/img/upload',
        onUploadProgress: (progressEvent) => {
          // Update progress as the file uploads
          setUploadProgress(Math.round(progressEvent.percentage * 100));
        },
      });

      // Set the uploaded URL for display and later use
      setUploadedUrl(blob.url);
      onSuccess?.(blob.url);
      console.log('Upload complete:', blob);
    } catch (err) {
      console.error('Upload failed:', err);
      onCancel?.();
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadedUrl(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <Container size="md" py="md">
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Upload Error" color="red">
              {error}
            </Alert>
          )}

          {uploadedUrl ? (
            <Stack align="center">
              <Alert icon={<IconCheck size={16} />} title="Upload Successful" color="green">
                Your image has been uploaded successfully.
              </Alert>
              <Image 
                src={uploadedUrl} 
                alt="Uploaded image" 
                fit="contain" 
                height={300} 
                radius="md"
              />
              <Text size="sm">Image URL: {uploadedUrl}</Text>
              <Button onClick={resetForm} variant="outline">Upload Another Image</Button>
            </Stack>
          ) : (
            <>
              <FileInput
                label="Select image to upload"
                placeholder="Click to select an image from your device to upload"
                accept="image/jpeg,image/png,image/gif"
                value={file}
                onChange={setFile}
                clearable
                disabled={uploading}
                ref={fileInputRef}
              />

              {file && (
                <Group justify="center">
                  <Text size="sm">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</Text>
                </Group>
              )}

              {uploading && (
                <Stack>
                  <Progress
                    value={uploadProgress}
                    size="lg"
                    radius="xl" />
                  <Text size="sm" ta="center">{uploadProgress === 100 ? 'Processing upload...' : 'Uploading...'}</Text>
                </Stack>
              )}

              <Group justify="flex-end">
                <Button 
                  onClick={handleUpload} 
                  leftSection={<IconUpload size={16} />}
                  loading={uploading}
                  disabled={!file}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Group>
            </>
          )}
        </Stack>
    </Container>
  );
}