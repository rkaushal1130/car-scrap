const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const contactRoutes = require('./contact.routes');
const inquiryRoutes = require('./inquiry.routes');
const serviceRoutes = require('./service.routes');
const galleryRoutes = require('./gallery.routes');
const blogRoutes = require('./blog.routes');
const categoryRoutes = require('./category.routes');
const faqRoutes = require('./faq.routes');
const companyRoutes = require('./company.routes');
const seoRoutes = require('./seo.routes');
const mediaRoutes = require('./media.routes');
const testimonialRoutes = require('./testimonial.routes');
const statisticRoutes = require('./statistic.routes');

// API Version 1 Routes Mounting
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/services', serviceRoutes);
router.use('/gallery', galleryRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/faqs', faqRoutes);
router.use('/company', companyRoutes);
router.use('/seo', seoRoutes);
router.use('/media', mediaRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/statistics', statisticRoutes);

module.exports = router;







