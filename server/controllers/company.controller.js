const Company = require('../models/Company');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/storage.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Default initial company configuration
 */
const DEFAULT_COMPANY_DATA = {
  companyName: 'Car Scrap Enterprise',
  tagline: 'Eco-Friendly Vehicle Recycling & Valuation',
  description: 'Authorized Scrap Vehicle Recycling Facility & Fair Market Valuation Platform.',
  address: {
    street: 'Plot No. 42, Industrial Area, Sector 5',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    formattedAddress: 'Plot No. 42, Industrial Area, Sector 5, New Delhi, Delhi 110001',
  },
  phone: {
    primary: '+91 98765 43210',
    secondary: '+91 98765 43211',
    whatsapp: '+91 98765 43210',
    tollFree: '1800 123 4567',
  },
  email: {
    primary: 'info@carscrapenterprise.com',
    support: 'support@carscrapenterprise.com',
    inquiry: 'valuation@carscrapenterprise.com',
  },
  workingHours: {
    weekdays: 'Mon - Sat: 9:00 AM - 7:00 PM',
    weekends: 'Sunday: Closed',
    note: '24/7 Online Instant Car Scrap Quote Service',
  },
  googleMapLink: 'https://maps.google.com/?q=Car+Scrap+Enterprise',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.99!',
  socialLinks: {
    facebook: 'https://facebook.com/carscrapenterprise',
    instagram: 'https://instagram.com/carscrapenterprise',
    twitter: 'https://twitter.com/carscrapent',
    linkedin: 'https://linkedin.com/company/carscrapenterprise',
    youtube: 'https://youtube.com/c/carscrapenterprise',
  },
  logo: {
    url: '',
    alt: 'Car Scrap Enterprise Logo',
    publicId: '',
  },
  favicon: {
    url: '',
    publicId: '',
  },
  gstNumber: '07AAAAA0000A1Z5',
  licenseNumber: 'RTO-DL-2024-SCRAP-0099',
  isDefault: true,
};

/**
 * @desc    Get Company Information (Public)
 * @route   GET /api/v1/company
 * @access  Public
 */
const getCompanyInfo = asyncHandler(async (req, res) => {
  let company = await Company.findOne();

  // If no record exists yet, initialize default entry
  if (!company) {
    company = await Company.create(DEFAULT_COMPANY_DATA);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, company, 'Company information retrieved successfully'));
});

/**
 * @desc    Create or Update Company Information (Admin)
 * @route   PUT /api/v1/company
 * @access  Private/Admin
 */
const updateCompanyInfo = asyncHandler(async (req, res) => {
  let company = await Company.findOne();

  const {
    companyName,
    tagline,
    description,
    address,
    phone,
    email,
    workingHours,
    googleMapLink,
    googleMapEmbedUrl,
    socialLinks,
    logo,
    favicon,
    gstNumber,
    licenseNumber,
  } = req.body;

  if (!company) {
    company = new Company(DEFAULT_COMPANY_DATA);
  }

  if (companyName) company.companyName = companyName.trim();
  if (tagline !== undefined) company.tagline = tagline.trim();
  if (description !== undefined) company.description = description.trim();

  // Address deep merge
  if (address) {
    company.address = {
      street: address.street !== undefined ? address.street : company.address?.street || '',
      city: address.city !== undefined ? address.city : company.address?.city || '',
      state: address.state !== undefined ? address.state : company.address?.state || '',
      postalCode:
        address.postalCode !== undefined ? address.postalCode : company.address?.postalCode || '',
      country: address.country !== undefined ? address.country : company.address?.country || 'India',
      formattedAddress:
        address.formattedAddress !== undefined
          ? address.formattedAddress
          : `${address.street || company.address?.street || ''}, ${
              address.city || company.address?.city || ''
            }, ${address.state || company.address?.state || ''} ${
              address.postalCode || company.address?.postalCode || ''
            }`,
    };
  }

  // Phone deep merge
  if (phone) {
    company.phone = {
      primary: phone.primary !== undefined ? phone.primary : company.phone?.primary || '',
      secondary: phone.secondary !== undefined ? phone.secondary : company.phone?.secondary || '',
      whatsapp: phone.whatsapp !== undefined ? phone.whatsapp : company.phone?.whatsapp || '',
      tollFree: phone.tollFree !== undefined ? phone.tollFree : company.phone?.tollFree || '',
    };
  }

  // Email deep merge
  if (email) {
    company.email = {
      primary: email.primary !== undefined ? email.primary : company.email?.primary || '',
      support: email.support !== undefined ? email.support : company.email?.support || '',
      inquiry: email.inquiry !== undefined ? email.inquiry : company.email?.inquiry || '',
    };
  }

  // Working Hours deep merge
  if (workingHours) {
    company.workingHours = {
      weekdays:
        workingHours.weekdays !== undefined
          ? workingHours.weekdays
          : company.workingHours?.weekdays || '',
      weekends:
        workingHours.weekends !== undefined
          ? workingHours.weekends
          : company.workingHours?.weekends || '',
      note:
        workingHours.note !== undefined ? workingHours.note : company.workingHours?.note || '',
    };
  }

  // Links & Embeds
  if (googleMapLink !== undefined) company.googleMapLink = googleMapLink.trim();
  if (googleMapEmbedUrl !== undefined) company.googleMapEmbedUrl = googleMapEmbedUrl.trim();

  // Social Links deep merge
  if (socialLinks) {
    company.socialLinks = {
      facebook:
        socialLinks.facebook !== undefined
          ? socialLinks.facebook
          : company.socialLinks?.facebook || '',
      instagram:
        socialLinks.instagram !== undefined
          ? socialLinks.instagram
          : company.socialLinks?.instagram || '',
      twitter:
        socialLinks.twitter !== undefined
          ? socialLinks.twitter
          : company.socialLinks?.twitter || '',
      linkedin:
        socialLinks.linkedin !== undefined
          ? socialLinks.linkedin
          : company.socialLinks?.linkedin || '',
      youtube:
        socialLinks.youtube !== undefined
          ? socialLinks.youtube
          : company.socialLinks?.youtube || '',
    };
  }

  // Logo & Favicon
  if (logo) {
    company.logo = {
      url: logo.url || company.logo?.url || '',
      alt: logo.alt || company.logo?.alt || company.companyName,
      publicId: logo.publicId || company.logo?.publicId || '',
    };
  }

  if (favicon) {
    company.favicon = {
      url: favicon.url || company.favicon?.url || '',
      publicId: favicon.publicId || company.favicon?.publicId || '',
    };
  }

  if (gstNumber !== undefined) company.gstNumber = gstNumber.trim().toUpperCase();
  if (licenseNumber !== undefined) company.licenseNumber = licenseNumber.trim().toUpperCase();

  await company.save();

  return res
    .status(200)
    .json(new ApiResponse(200, company, 'Company information updated successfully'));
});

/**
 * @desc    Upload Company Logo to Cloudinary (Admin)
 * @route   POST /api/v1/company/upload-logo
 * @access  Private/Admin
 */
const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Logo image file is required');
  }

  let company = await Company.findOne();
  if (!company) {
    company = new Company(DEFAULT_COMPANY_DATA);
  }

  // Delete previous logo asset if publicId exists
  if (company.logo && company.logo.publicId) {
    await deleteFromCloudinary(company.logo.publicId);
  }

  const cloudinaryData = await uploadToCloudinary(req.file.path, 'car_scrap_company');

  company.logo = {
    url: cloudinaryData.secureUrl,
    alt: `${company.companyName} Logo`,
    publicId: cloudinaryData.publicId,
  };

  await company.save();

  return res
    .status(200)
    .json(new ApiResponse(200, company.logo, 'Company logo uploaded successfully'));
});

/**
 * @desc    Upload Company Favicon to Cloudinary (Admin)
 * @route   POST /api/v1/company/upload-favicon
 * @access  Private/Admin
 */
const uploadCompanyFavicon = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Favicon image file is required');
  }

  let company = await Company.findOne();
  if (!company) {
    company = new Company(DEFAULT_COMPANY_DATA);
  }

  // Delete previous favicon asset if publicId exists
  if (company.favicon && company.favicon.publicId) {
    await deleteFromCloudinary(company.favicon.publicId);
  }

  const cloudinaryData = await uploadToCloudinary(req.file.path, 'car_scrap_company');

  company.favicon = {
    url: cloudinaryData.secureUrl,
    publicId: cloudinaryData.publicId,
  };

  await company.save();

  return res
    .status(200)
    .json(new ApiResponse(200, company.favicon, 'Company favicon uploaded successfully'));
});

/**
 * @desc    Reset Company Information to Defaults (Super Admin)
 * @route   DELETE /api/v1/company
 * @access  Private/SuperAdmin
 */
const resetCompanyInfo = asyncHandler(async (req, res) => {
  await Company.deleteMany({});
  const company = await Company.create(DEFAULT_COMPANY_DATA);

  return res
    .status(200)
    .json(new ApiResponse(200, company, 'Company profile reset to defaults successfully'));
});

module.exports = {
  getCompanyInfo,
  updateCompanyInfo,
  uploadCompanyLogo,
  uploadCompanyFavicon,
  resetCompanyInfo,
};
