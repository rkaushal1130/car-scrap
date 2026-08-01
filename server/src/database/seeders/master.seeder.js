const connectDB = require('../db.config');
const seedRolesAndPermissions = require('./rolesAndPermissions.seeder');
const seedUsers = require('./users.seeder');
const seedCompany = require('./company.seeder');
const seedServices = require('./services.seeder');
const seedBlogs = require('./blogs.seeder');
const seedGallery = require('./gallery.seeder');
const seedTestimonials = require('./testimonials.seeder');
const seedFaqs = require('./faqs.seeder');
const seedStatistics = require('./statistics.seeder');
const seedWebsiteSettings = require('./websiteSettings.seeder');
const seedSeo = require('./seo.seeder');

const runMasterSeeder = async () => {
  try {
    console.log('🚀 Starting Enterprise Database Master Seeder...');
    await connectDB();

    await seedRolesAndPermissions();
    await seedUsers();
    await seedCompany();
    await seedServices();
    await seedBlogs();
    await seedGallery();
    await seedTestimonials();
    await seedFaqs();
    await seedStatistics();
    await seedWebsiteSettings();
    await seedSeo();

    console.log('🎉 All Database Seeders Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Master Seeder Execution Failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runMasterSeeder();
}

module.exports = runMasterSeeder;
