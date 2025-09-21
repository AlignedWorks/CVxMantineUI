import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import {
  Text,
  Group,
  Button,
  FileInput,
  Progress,
  Stack,
  Alert,
  Anchor
} from '@mantine/core';
import { IconUpload, IconAlertCircle, IconCheck, IconFileText } from '@tabler/icons-react';

interface FileUploadProps {
  onSuccess?: (url: string) => void;
  onCancel?: () => void;
  fileType?: 'document' | 'pdf'; // Type of file to upload
  maxSizeMB?: number; // Maximum file size in MB
}

export function FileUpload({
  onSuccess, 
  onCancel, 
  fileType = 'pdf',
  maxSizeMB = 5
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  // Set the accept attribute based on file type
  const getAcceptTypes = () => {
    switch (fileType) {
      case 'pdf':
        return 'application/pdf';
      case 'document':
        return '.doc,.docx,.pdf,.txt,.odt';
      default:
        return '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Call the Vercel Blob client upload function
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/upload?type=${fileType}`,
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

  // Generate a nice display name for the file type
  const fileTypeDisplay = fileType === 'pdf' ? 'PDF' : 'document';

  return (
    <Stack>
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Upload Error" color="red">
          {error}
        </Alert>
      )}

      {uploadedUrl ? (
        <Stack align="center">
          <Alert icon={<IconCheck size={16} />} title="Upload Successful" color="green">
            Your {fileTypeDisplay} has been uploaded successfully.
          </Alert>
          <Group>
            <IconFileText size={48} />
            <Stack gap={0}>
              <Text fw={500}>{file?.name}</Text>
              <Anchor href={uploadedUrl} target="_blank" size="sm">
                View uploaded file
              </Anchor>
            </Stack>
          </Group>
          <Text size="sm">File URL: {uploadedUrl}</Text>
          <Button onClick={resetForm} variant="outline">Upload Another File</Button>
        </Stack>
      ) : (
        <>
          <FileInput
            label={`Select a ${fileTypeDisplay} to upload`}
            placeholder={`Click to select a ${fileTypeDisplay} from your device to upload`}
            accept={getAcceptTypes()}
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

          <Group justify="space-between">
            <Text>
              File requirements:<br/>
              1) Maximum size: {maxSizeMB}MB<br/>
              2) Accepted formats: {fileType === 'pdf' ? 'PDF files only' : 'DOC, DOCX, PDF, TXT, ODT'}<br/>
              3) No sensitive information should be included
            </Text>
            <Button 
              onClick={handleUpload} 
              leftSection={<IconUpload size={16} />}
              loading={uploading}
              disabled={!file}
              variant="outline"
            >
              {uploading ? 'Uploading...' : `Upload ${fileTypeDisplay}`}
            </Button>
          </Group>
          
          {onCancel && (
            <Button variant="subtle" onClick={onCancel} fullWidth mt="xs">
              Cancel
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}