const Seo = require('../models/Seo');
const Post = require('../models/Post');
const Service = require('../models/Service');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

const DEFAULT_SEO_CONFIGS = [
  {
    pageIdentifier: 'home',
    metaTitle: 'Car Scrap Platform | Best Cash for Scrap & Old Vehicles in India',
    metaDescription: 'Get instant online scrap valuation for your old, junk, or damaged car with 100% legal RTO RC cancellation and free doorstep pickup.',
    keywords: ['car scrap', 'scrap car price', 'cash for scrap cars', 'junk car removal', 'rto rc cancellation'],
  },
];

const getSeoByPage = asyncHandler(async (req, res) => {
  const { pageIdentifier } = req.params;
  let seo = await Seo.findOne({ pageIdentifier: pageIdentifier.toLowerCase() }).lean();

  if (!seo && pageIdentifier.toLowerCase() === 'home') {
    seo = await Seo.create(DEFAULT_SEO_CONFIGS[0]);
  }

  if (!seo) {
    throw new ApiError(404, `SEO metadata configuration for page '${pageIdentifier}' not found`);
  }

  return res.status(200).json(new ApiResponse(200, seo, 'SEO metadata fetched successfully'));
});

const updateSeoByPage = asyncHandler(async (req, res) => {
  const { pageIdentifier } = req.params;
  const updateData = req.body;

  let seo = await Seo.findOne({ pageIdentifier: pageIdentifier.toLowerCase() });
  if (!seo) {
    seo = new Seo({ pageIdentifier: pageIdentifier.toLowerCase(), ...updateData });
  } else {
    Object.assign(seo, updateData);
  }

  await seo.save();
  return res.status(200).json(new ApiResponse(200, seo, 'SEO metadata updated successfully'));
});

const generateRobotsTxt = asyncHandler(async (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const robotsContent = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  res.type('text/plain');
  return res.status(200).send(robotsContent);
});

const getSitemapConfig = asyncHandler(async (req, res) => {
  const [blogs, services, categories] = await Promise.all([
    Post.find({ status: 'PUBLISHED' }).select('slug updatedAt').lean(),
    Service.find({ isActive: true }).select('slug updatedAt').lean(),
    Category.find().select('slug updatedAt').lean(),
  ]);

  const sitemapUrls = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/services', priority: 0.9, changefreq: 'weekly' },
    { loc: '/blogs', priority: 0.8, changefreq: 'daily' },
    ...blogs.map((b) => ({ loc: `/blogs/${b.slug}`, lastmod: b.updatedAt, priority: 0.7, changefreq: 'weekly' })),
    ...services.map((s) => ({ loc: `/services/${s.slug}`, lastmod: s.updatedAt, priority: 0.8, changefreq: 'monthly' })),
    ...categories.map((c) => ({ loc: `/category/${c.slug}`, lastmod: c.updatedAt, priority: 0.6, changefreq: 'weekly' })),
  ];

  return res.status(200).json(new ApiResponse(200, { urls: sitemapUrls, total: sitemapUrls.length }, 'Sitemap config generated successfully'));
});

module.exports = {
  getSeoByPage,
  updateSeoByPage,
  generateRobotsTxt,
  getSitemapConfig,
};
