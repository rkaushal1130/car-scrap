const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const companyRoutes = require('./company.routes');
const serviceRoutes = require('./service.routes');
const blogRoutes = require('./blog.routes');
const categoryRoutes = require('./category.routes');
const galleryRoutes = require('./gallery.routes');
const mediaRoutes = require('./media.routes');
const testimonialRoutes = require('./testimonial.routes');
const faqRoutes = require('./faq.routes');
const statisticRoutes = require('./statistic.routes');
const inquiryRoutes = require('./inquiry.routes');
const contactRoutes = require('./contact.routes');
const seoRoutes = require('./seo.routes');
const dashboardRoutes = require('./dashboard.routes');
const auditLogRoutes = require('./auditLog.routes');

// API Version 1 Sub-routers Mounting for all 21 Admin Dashboard Modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/company', companyRoutes);
router.use('/services', serviceRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/gallery', galleryRoutes);
router.use('/media', mediaRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/faqs', faqRoutes);
router.use('/statistics', statisticRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/contact', contactRoutes);
router.use('/seo', seoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activity-logs', auditLogRoutes);

module.exports = router;
