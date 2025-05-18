import { handleUpload } from '@vercel/blob/client';
 
export default async function (req, res) {
  try {
    console.log('Processing upload request');
    // Use req.body directly in Node.js environment
    const body = req.body;
    
    // Note: 'request' is not defined - we need to use 'req' instead
    const jsonResponse = await handleUpload({
      body,
      request: req,  // Use req instead of request
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        console.log('Generating token for:', pathname);
        
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          console.error('Error updating after upload:', error);
          throw new Error('Could not update user');
        }
      },
    });
 
    // Use res.json in a Node.js environment
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error in /api/img/upload:', error);
    return res.status(400).json({ error: error.message });
  }
}