import { useRef } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from './DropzoneButton.module.css';

interface DropzoneButtonProps {
    imgType?: string; // Profile pic vs Collaborative logo
}

export function DropzoneButton({
    imgType = 'Pic',
    }: DropzoneButtonProps ) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={() => {}}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
        maxSize={2 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center" mt="lg">
            <Dropzone.Accept>
              <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} className={classes.icon} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="lg">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Img file (PNG or JPEG) less than 2mb</Dropzone.Reject>
            <Dropzone.Idle>Upload your {imgType}</Dropzone.Idle>
          </Text>

          <Text className={classes.description}>
            Drag&apos;n&apos;drop the image file here to upload. We can accept only <i>.png or .jpeg</i> files that
            are less than 2mb in size.<br/>It should be a roughly square image that is tightly cropped for best results.
          </Text>
        </div>
      </Dropzone>

      <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select files
      </Button>
    </div>
  );
}