import { handleUpload } from '@vercel/blob/client';
 
export default async function (req, res) {
  try {
    console.log('Processing upload request');
    // Use req.body directly in Node.js environment
    const body = req.body;
    const fileType = req.query.type || 'generic'; // 'image', 'document', 'pdf'
    console.log('File type:', fileType);

    // Content type mapping
    const contentTypeMap = {
      'image': ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
      'document': ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text'],
      'pdf': ['application/pdf'],
      'generic': ['application/octet-stream', 'image/jpeg', 'image/png', 'application/pdf']
    };

    // Note: 'request' is not defined - we need to use 'req' instead
    const jsonResponse = await handleUpload({
      body,
      request: req,  // Use req instead of request
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        console.log('Generating token for:', pathname);
        console.log('contentTypeMap:', contentTypeMap[fileType]);
        
        return {
          allowedContentTypes: contentTypeMap[fileType] || contentTypeMap.generic,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            fileType,
            ...clientPayload
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
        const payload = JSON.parse(tokenPayload || '{}');
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
          // Run type-specific logic after upload completes
          // Different handling based on file type
          if (payload.fileType === 'image') {
            // Image-specific processing
          } else if (payload.fileType === 'document') {
            // Document-specific processing
          } else if (payload.fileType === 'pdf') {
            // PDF-specific processing
          }
        } catch (error) {
          console.error('Error updating after upload:', error);
          throw new Error('Could not update user');
        }
      },
    });
 
    // Use res.json in a Node.js environment
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error in /api/upload:', error);
    return res.status(400).json({ error: error.message });
  }
}