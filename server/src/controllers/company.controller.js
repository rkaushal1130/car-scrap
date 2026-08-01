const Company = require('../models/Company');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const { uploadToCloudinary } = require('../services/storage.service');

const getCompanyDetails = asyncHandler(async (req, res) => {
  const company = await Company.getSingletonInstance();
  return res.status(200).json(new ApiResponse(200, company, 'Company profile retrieved successfully'));
});

const updateCompanyDetails = asyncHandler(async (req, res) => {
  let company = await Company.getSingletonInstance();
  const updateData = req.body;

  if (updateData.emails) company.emails = { ...company.emails, ...updateData.emails };
  if (updateData.phones) company.phones = { ...company.phones, ...updateData.phones };
  if (updateData.address) company.address = { ...company.address, ...updateData.address };
  if (updateData.workingHours) company.workingHours = { ...company.workingHours, ...updateData.workingHours };
  if (updateData.socialLinks) company.socialLinks = { ...company.socialLinks, ...updateData.socialLinks };

  if (updateData.companyName) company.companyName = updateData.companyName;
  if (updateData.tagline) company.tagline = updateData.tagline;
  if (updateData.aboutText) company.aboutText = updateData.aboutText;
  if (updateData.gstNumber) company.gstNumber = updateData.gstNumber;
  if (updateData.rtoLicenseNumber) company.rtoLicenseNumber = updateData.rtoLicenseNumber;
  if (updateData.mapEmbedUrl) company.mapEmbedUrl = updateData.mapEmbedUrl;

  await company.save();
  return res.status(200).json(new ApiResponse(200, company, 'Company details updated successfully'));
});

const uploadCompanyAssets = asyncHandler(async (req, res) => {
  let company = await Company.getSingletonInstance();

  if (req.files) {
    if (req.files.logo && req.files.logo[0]) {
      const uploadResult = await uploadToCloudinary(req.files.logo[0].path, 'car_scrap_company');
      if (uploadResult) company.assets.logoUrl = uploadResult.url;
    }
    if (req.files.favicon && req.files.favicon[0]) {
      const uploadResult = await uploadToCloudinary(req.files.favicon[0].path, 'car_scrap_company');
      if (uploadResult) company.assets.faviconUrl = uploadResult.url;
    }
    await company.save();
  }

  return res.status(200).json(new ApiResponse(200, company, 'Company brand assets uploaded successfully'));
});

module.exports = {
  getCompanyDetails,
  updateCompanyDetails,
  uploadCompanyAssets,
};
