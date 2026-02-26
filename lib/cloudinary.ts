import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',
  async handleUpload({ file }: Parameters<HandleUpload>[0]) {
    try {
      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'vendo',
            public_id: file.filename.replace(/(\.[^/.]+)+$/, ''),
            use_filename: false,
            overwrite: false,
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('No result'));
            resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      file.filename = uploadResult.secure_url;
      file.mimeType = uploadResult.format;
      file.filesize = uploadResult.bytes;
    } catch (error) {
      console.log('Cloudinary upload error :', error);
    }
  },

  async handleDelete({ filename }: Parameters<HandleDelete>[0]) {
    try {
      // filename is now the full URL, extract public_id from it
      const publicId = filename
        .split('/upload/')[1] // get everything after /upload/
        .replace(/v\d+\//, '') // remove version like v1772020318/
        .replace(/\.[^/.]+$/, ''); // remove file extension

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.log('Cloudinary delete error :', error);
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 });
  },
});

export { cloudinary };
