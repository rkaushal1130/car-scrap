const mongoose = require('mongoose');
const Seo = require('../models/Seo');
const Post = require('../models/Post');
const Service = require('../models/Service');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Initial Default Global SEO Settings
 */
const DEFAULT_GLOBAL_SEO = {
  pageIdentifier: 'global',
  pageName: 'Global Site Default SEO',
  metaTitle: 'Car Scrap Enterprise - Vehicle Recycling & Valuation Platform',
  metaDescription:
    'Get instant fair market valuation for your end-of-life cars. Eco-friendly vehicle scrapping, hassle-free RTO paperwork, and cash payment on pickup.',
  keywords: ['car scrap', 'vehicle recycling', 'junk car buyer', 'car valuation', 'rto scrapping'],
  openGraph: {
    ogTitle: 'Car Scrap Enterprise - Vehicle Recycling & Valuation',
    ogDescription:
      'Scrap your car hassle-free with instant valuation and free door-step pickup.',
    ogImage: 'https://carscrapenterprise.com/assets/og-default.jpg',
    ogType: 'website',
    ogUrl: 'https://carscrapenterprise.com',
    ogSiteName: 'Car Scrap Enterprise',
  },
  twitterCard: {
    cardType: 'summary_large_image',
    twitterSite: '@carscrap',
    twitterCreator: '@carscrap',
    twitterTitle: 'Car Scrap Enterprise',
    twitterDescription: 'Instant fair valuation and doorstep pickup for scrap cars.',
    twitterImage: 'https://carscrapenterprise.com/assets/twitter-default.jpg',
  },
  canonicalUrl: 'https://carscrapenterprise.com',
  schema: {
    schemaType: 'Organization',
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'RecyclingCenter',
      name: 'Car Scrap Enterprise',
      url: 'https://carscrapenterprise.com',
      logo: 'https://carscrapenterprise.com/assets/logo.png',
      description: 'Certified car scrapping and vehicle valuation facility.',
    },
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    customRobotsTxt:
      "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: https://carscrapenterprise.com/sitemap.xml",
  },
  sitemapSettings: {
    includeInSitemap: true,
    priority: 1.0,
    changefreq: 'daily',
  },
  isGlobalDefault: true,
};

/**
 * Helper to ensure Global SEO entry exists
 */
const ensureGlobalSeoExists = async () => {
  let globalSeo = await Seo.findOne({ pageIdentifier: 'global' });
  if (!globalSeo) {
    globalSeo = await Seo.create(DEFAULT_GLOBAL_SEO);
  }
  return globalSeo;
};

/**
 * @desc    Get Global Default SEO Configuration
 * @route   GET /api/v1/seo/global
 * @access  Public
 */
const getGlobalSeo = asyncHandler(async (req, res) => {
  const globalSeo = await ensureGlobalSeoExists();
  return res
    .status(200)
    .json(new ApiResponse(200, globalSeo, 'Global SEO configuration retrieved successfully'));
});

/**
 * @desc    Get Page-Specific SEO Metadata (Falls back to Global SEO)
 * @route   GET /api/v1/seo/:pageIdentifier
 * @access  Public
 */
const getSeoByPageIdentifier = asyncHandler(async (req, res) => {
  const { pageIdentifier } = req.params;
  const normalizedId = pageIdentifier.toLowerCase().trim();

  let pageSeo = await Seo.findOne({ pageIdentifier: normalizedId });

  // If page-specific SEO is missing, fall back to global SEO settings
  if (!pageSeo) {
    const globalSeo = await ensureGlobalSeoExists();
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...globalSeo.toObject(),
          isFallback: true,
          requestedPage: normalizedId,
        },
        'SEO configuration retrieved (fallback to Global SEO)'
      )
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, pageSeo, 'Page SEO metadata retrieved successfully'));
});

/**
 * @desc    Get All Page SEO Entries with Pagination & Search (Admin Dashboard)
 * @route   GET /api/v1/seo
 * @access  Public / Admin
 */
const getAllSeoPages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const { search } = req.query;
  const query = {};

  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { pageIdentifier: searchRegex },
      { pageName: searchRegex },
      { metaTitle: searchRegex },
      { metaDescription: searchRegex },
    ];
  }

  await ensureGlobalSeoExists();

  const [seoPages, total] = await Promise.all([
    Seo.find(query).sort({ isGlobalDefault: -1, pageIdentifier: 1 }).skip(skip).limit(limit).lean(),
    Seo.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        seoPages,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      'SEO pages retrieved successfully'
    )
  );
});

/**
 * @desc    Create Page SEO Entry (Admin)
 * @route   POST /api/v1/seo
 * @access  Private/Admin
 */
const createSeoPage = asyncHandler(async (req, res) => {
  const {
    pageIdentifier,
    pageName,
    metaTitle,
    metaDescription,
    keywords,
    openGraph,
    twitterCard,
    canonicalUrl,
    schema,
    robots,
    sitemapSettings,
  } = req.body;

  const normalizedId = pageIdentifier.toLowerCase().trim();

  const existingSeo = await Seo.findOne({ pageIdentifier: normalizedId });
  if (existingSeo) {
    throw new ApiError(400, `SEO configuration for page '${normalizedId}' already exists`);
  }

  // Parse keywords
  let parsedKeywords = [];
  if (Array.isArray(keywords)) {
    parsedKeywords = keywords.map((k) => k.toString().trim().toLowerCase()).filter(Boolean);
  } else if (typeof keywords === 'string') {
    parsedKeywords = keywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
  }

  const seoPage = await Seo.create({
    pageIdentifier: normalizedId,
    pageName: pageName.trim(),
    metaTitle: metaTitle.trim(),
    metaDescription: metaDescription.trim(),
    keywords: parsedKeywords,
    openGraph: openGraph || {},
    twitterCard: twitterCard || {},
    canonicalUrl: canonicalUrl || '',
    schema: schema || {},
    robots: robots || {},
    sitemapSettings: sitemapSettings || {},
    isGlobalDefault: normalizedId === 'global',
  });

  return res
    .status(201)
    .json(new ApiResponse(201, seoPage, 'Page SEO metadata created successfully'));
});

/**
 * @desc    Update Page SEO Entry by ID or PageIdentifier (Admin)
 * @route   PUT /api/v1/seo/:identifier
 * @access  Private/Admin
 */
const updateSeoPage = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const isMongoId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isMongoId ? { _id: identifier } : { pageIdentifier: identifier.toLowerCase().trim() };

  let seoPage = await Seo.findOne(query);

  if (!seoPage && (identifier === 'global' || !isMongoId)) {
    seoPage = await ensureGlobalSeoExists();
  }

  if (!seoPage) {
    throw new ApiError(404, 'SEO page entry not found');
  }

  const {
    pageName,
    metaTitle,
    metaDescription,
    keywords,
    openGraph,
    twitterCard,
    canonicalUrl,
    schema,
    robots,
    sitemapSettings,
  } = req.body;

  if (pageName) seoPage.pageName = pageName.trim();
  if (metaTitle) seoPage.metaTitle = metaTitle.trim();
  if (metaDescription) seoPage.metaDescription = metaDescription.trim();

  if (keywords !== undefined) {
    if (Array.isArray(keywords)) {
      seoPage.keywords = keywords.map((k) => k.toString().trim().toLowerCase()).filter(Boolean);
    } else if (typeof keywords === 'string') {
      seoPage.keywords = keywords
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
    }
  }

  if (openGraph) {
    seoPage.openGraph = {
      ogTitle: openGraph.ogTitle || seoPage.openGraph?.ogTitle || seoPage.metaTitle,
      ogDescription: openGraph.ogDescription || seoPage.openGraph?.ogDescription || seoPage.metaDescription,
      ogImage: openGraph.ogImage || seoPage.openGraph?.ogImage || '',
      ogType: openGraph.ogType || seoPage.openGraph?.ogType || 'website',
      ogUrl: openGraph.ogUrl || seoPage.openGraph?.ogUrl || '',
      ogSiteName: openGraph.ogSiteName || seoPage.openGraph?.ogSiteName || 'Car Scrap Enterprise',
    };
  }

  if (twitterCard) {
    seoPage.twitterCard = {
      cardType: twitterCard.cardType || seoPage.twitterCard?.cardType || 'summary_large_image',
      twitterSite: twitterCard.twitterSite || seoPage.twitterCard?.twitterSite || '',
      twitterCreator: twitterCard.twitterCreator || seoPage.twitterCard?.twitterCreator || '',
      twitterTitle: twitterCard.twitterTitle || seoPage.twitterCard?.twitterTitle || seoPage.metaTitle,
      twitterDescription:
        twitterCard.twitterDescription || seoPage.twitterCard?.twitterDescription || seoPage.metaDescription,
      twitterImage: twitterCard.twitterImage || seoPage.twitterCard?.twitterImage || seoPage.openGraph?.ogImage || '',
    };
  }

  if (canonicalUrl !== undefined) seoPage.canonicalUrl = canonicalUrl.trim();

  if (schema) {
    seoPage.schema = {
      schemaType: schema.schemaType || seoPage.schema?.schemaType || 'Organization',
      schemaJson: schema.schemaJson !== undefined ? schema.schemaJson : seoPage.schema?.schemaJson || {},
    };
  }

  if (robots) {
    seoPage.robots = {
      index: robots.index !== undefined ? Boolean(robots.index) : seoPage.robots?.index,
      follow: robots.follow !== undefined ? Boolean(robots.follow) : seoPage.robots?.follow,
      noarchive: robots.noarchive !== undefined ? Boolean(robots.noarchive) : seoPage.robots?.noarchive,
      nosnippet: robots.nosnippet !== undefined ? Boolean(robots.nosnippet) : seoPage.robots?.nosnippet,
      maxSnippet: robots.maxSnippet !== undefined ? robots.maxSnippet : seoPage.robots?.maxSnippet,
      maxImagePreview: robots.maxImagePreview || seoPage.robots?.maxImagePreview || 'large',
      customRobotsTxt:
        robots.customRobotsTxt !== undefined
          ? robots.customRobotsTxt
          : seoPage.robots?.customRobotsTxt || '',
    };
  }

  if (sitemapSettings) {
    seoPage.sitemapSettings = {
      includeInSitemap:
        sitemapSettings.includeInSitemap !== undefined
          ? Boolean(sitemapSettings.includeInSitemap)
          : seoPage.sitemapSettings?.includeInSitemap,
      priority:
        sitemapSettings.priority !== undefined ? parseFloat(sitemapSettings.priority) : seoPage.sitemapSettings?.priority,
      changefreq: sitemapSettings.changefreq || seoPage.sitemapSettings?.changefreq || 'weekly',
      lastMod: new Date(),
    };
  }

  await seoPage.save();

  return res
    .status(200)
    .json(new ApiResponse(200, seoPage, 'SEO page metadata updated successfully'));
});

/**
 * @desc    Delete Page SEO Entry (Admin)
 * @route   DELETE /api/v1/seo/:id
 * @access  Private/Admin
 */
const deleteSeoPage = asyncHandler(async (req, res) => {
  const seoPage = await Seo.findById(req.params.id);

  if (!seoPage) {
    throw new ApiError(404, 'SEO page entry not found');
  }

  if (seoPage.isGlobalDefault || seoPage.pageIdentifier === 'global') {
    throw new ApiError(400, 'Cannot delete Global Site Default SEO configuration');
  }

  await Seo.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'SEO page entry deleted successfully'));
});

/**
 * @desc    Get Dynamic robots.txt Content
 * @route   GET /api/v1/seo/robots.txt
 * @access  Public
 */
const getRobotsTxt = asyncHandler(async (req, res) => {
  const globalSeo = await ensureGlobalSeoExists();

  const robotsTxtContent =
    globalSeo.robots?.customRobotsTxt ||
    "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: https://carscrapenterprise.com/sitemap.xml";

  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send(robotsTxtContent);
});

/**
 * @desc    Get Dynamic Sitemap Entries (URLs, Priorities, Frequencies)
 * @route   GET /api/v1/seo/sitemap-config
 * @access  Public
 */
const getSitemapData = asyncHandler(async (req, res) => {
  const [seoPages, blogs, services, categories] = await Promise.all([
    Seo.find({ 'sitemapSettings.includeInSitemap': true }).lean(),
    Post.find({ status: 'PUBLISHED' }).select('slug updatedAt publishedAt').lean(),
    Service.find({ status: 'PUBLISHED' }).select('slug updatedAt').lean(),
    Category.find().select('slug updatedAt').lean(),
  ]);

  const staticUrls = seoPages.map((page) => ({
    url: page.pageIdentifier === 'home' || page.pageIdentifier === 'global' ? '/' : `/${page.pageIdentifier}`,
    priority: page.sitemapSettings?.priority || 0.8,
    changefreq: page.sitemapSettings?.changefreq || 'weekly',
    lastMod: page.sitemapSettings?.lastMod || page.updatedAt,
  }));

  const blogUrls = blogs.map((blog) => ({
    url: `/blog/${blog.slug}`,
    priority: 0.7,
    changefreq: 'weekly',
    lastMod: blog.updatedAt || blog.publishedAt,
  }));

  const serviceUrls = services.map((service) => ({
    url: `/services/${service.slug}`,
    priority: 0.9,
    changefreq: 'monthly',
    lastMod: service.updatedAt,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `/categories/${cat.slug}`,
    priority: 0.6,
    changefreq: 'weekly',
    lastMod: cat.updatedAt,
  }));

  const allSitemapUrls = [...staticUrls, ...serviceUrls, ...blogUrls, ...categoryUrls];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: allSitemapUrls.length,
        sitemapUrls: allSitemapUrls,
      },
      'Sitemap entries retrieved successfully'
    )
  );
});

module.exports = {
  getGlobalSeo,
  getSeoByPageIdentifier,
  getAllSeoPages,
  createSeoPage,
  updateSeoPage,
  deleteSeoPage,
  getRobotsTxt,
  getSitemapData,
};
