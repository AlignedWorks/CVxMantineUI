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

  // Client-side soft limit (try to resize if larger)
  const MAX_FILE_SIZE = 0.5 * 1024 * 1024; // 0.5 MB

  async function resizeImageToWebP(inputFile: File, maxDim = 1024): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        const img = new window.Image();
        img.onerror = () => reject(new Error('Invalid image'));
        img.onload = () => {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Image conversion failed'));
          }, 'image/webp', 0.85);
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(inputFile);
    });
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // If file is larger than soft limit, attempt client-side resize/convert to WebP
      let uploadFile: File = file;
      if (file.size > MAX_FILE_SIZE) {
        try {
          const resizedBlob = await resizeImageToWebP(file, 1024);
          const newName = file.name.replace(/\.\w+$/, '') + '.webp';
          uploadFile = new File([resizedBlob], newName, { type: 'image/webp' });
        } catch (resizeErr) {
          setError('Image is too large and could not be resized. Please choose a smaller image.');
          setUploading(false);
          return;
        }
      }

      // Call the Vercel Blob client upload function with the (possibly resized) file
      const blob = await upload(uploadFile.name, uploadFile, {
        access: 'public',
        handleUploadUrl: '/api/upload?type=image',
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
                accept="image/jpeg,image/png,image/gif,image/webp"
                value={file}
                onChange={setFile}
                clearable
                disabled={uploading}
                ref={fileInputRef}
              />

              {file && (
                <Group justify="center">
                  <Text size="sm">
                    Selected: {file.name} ({file.size > 1024 * 1024 ? (file.size / (1024*1024)).toFixed(2) + ' MB' : (file.size / 1024).toFixed(1) + ' KB'})
                    {file.size > MAX_FILE_SIZE && ' — will be resized before upload'}
                  </Text>
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

              <Group justify="space-between">
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