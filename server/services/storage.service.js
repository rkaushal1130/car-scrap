const fs = require('fs');
const cloudinary = require('../config/cloudinary.config');
const ApiError = require('../utils/apiError');

/**
 * Allowed image extensions and MIME types
 */
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Limit

/**
 * Upload local file to Cloudinary with compression & optimization
 * @param {string} filePath - Path to local file
 * @param {object} options - Custom folder, transformation, etc.
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  const { folder = 'car_scrap_uploads', maxWidth = 1920, maxHeight = 1080 } = options;

  try {
    // Check if file exists locally
    if (!fs.existsSync(filePath)) {
      throw new ApiError(400, 'Local file for upload does not exist');
    }

    // Verify 5MB size limit
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE_BYTES) {
      throw new ApiError(400, 'File size exceeds maximum limit of 5MB');
    }

    // Upload to Cloudinary with automatic format conversion & lossy compression
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      quality: 'auto:good', // Intelligent quality compression
      fetch_format: 'auto', // Converts to WebP/AVIF depending on browser support
      transformation: [
        { width: maxWidth, height: maxHeight, crop: 'limit' },
      ],
    });

    // Generate responsive compressed thumbnail URL (400x300 fill)
    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 400,
      height: 300,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true,
    });

    // Clean up local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      thumbnailUrl,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    // Clean up temp file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Cloudinary Image Upload Failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return false;
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error(`Failed to delete asset from Cloudinary (${publicId}):`, error.message);
    return false;
  }
};

/**
 * Replace existing image asset on Cloudinary
 * @param {string} oldPublicId - Existing Cloudinary public ID to delete
 * @param {string} newFilePath - Local file path of new image
 * @param {string} folder - Destination folder
 */
const replaceCloudinaryImage = async (oldPublicId, newFilePath, folder = 'car_scrap_uploads') => {
  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }
  return await uploadToCloudinary(newFilePath, { folder });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of local file paths
 * @param {string} folder - Destination folder
 */
const uploadMultipleToCloudinary = async (filePaths, folder = 'car_scrap_uploads') => {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    return [];
  }

  const uploadPromises = filePaths.map((filePath) =>
    uploadToCloudinary(filePath, { folder })
  );

  return await Promise.all(uploadPromises);
};

module.exports = {
  ALLOWED_FORMATS,
  MAX_FILE_SIZE_BYTES,
  uploadToCloudinary,
  deleteFromCloudinary,
  replaceCloudinaryImage,
  uploadMultipleToCloudinary,
};
