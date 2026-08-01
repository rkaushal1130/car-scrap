const fs = require('fs');
const cloudinary = require('../config/cloudinary.config');
const ApiError = require('../utils/apiError');

/**
 * Upload image to Cloudinary with compression & format conversion
 */
const uploadToCloudinary = async (localFilePath, folder = 'car_scrap_uploads') => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'image',
      quality: 'auto:good',
      fetch_format: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
      ],
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new ApiError(500, `Cloudinary Upload Error: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary by public ID
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return true;
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error(`Failed to delete asset from Cloudinary [${publicId}]:`, error.message);
    return false;
  }
};

/**
 * Replace existing Cloudinary image with a new local file
 */
const replaceCloudinaryImage = async (oldPublicId, newLocalFilePath, folder = 'car_scrap_uploads') => {
  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }
  return await uploadToCloudinary(newLocalFilePath, folder);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  replaceCloudinaryImage,
};
