const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const { slugify } = require('../../helpers/helpers');

const SAMPLE_CATEGORIES = [
  { name: 'Scrapping Laws & RTO', color: '#0D7A41', description: 'Government rules, 15-year policy, and RTO vehicle deregistration procedures.' },
  { name: 'Car Valuation & Cash', color: '#16A34A', description: 'Tips to maximize scrap metal weight price and cash payouts.' },
  { name: 'Eco Recycling & Green Fleet', color: '#0284C7', description: 'Environmental impact, zero-landfill depollution, and hazardous fluid disposal.' },
];

const SAMPLE_POSTS = [
  {
    title: 'Complete Guide to 15-Year Vehicle Scrapping Policy in India (2026)',
    excerpt: 'Everything you need to know about the National Vehicle Scrappage Policy, Certificate of Deposit (COD) benefits, and tax rebates on new car purchases.',
    content: `
      <h2>Understanding the 15-Year Scrappage Policy</h2>
      <p>The Ministry of Road Transport and Highways (MoRTH) mandates that commercial vehicles over 15 years and private passenger vehicles over 20 years undergo automated fitness testing. Non-compliant vehicles must be dismantled at Registered Vehicle Scrapping Facilities (RVSF).</p>
      <h3>Key Benefits for Vehicle Owners:</h3>
      <ul>
        <li><strong>Scrap Metal Payout:</strong> 4% to 6% of the new vehicle’s ex-showroom price.</li>
        <li><strong>Road Tax Rebate:</strong> Up to 25% discount on road tax for purchasing a new car against a COD certificate.</li>
        <li><strong>Registration Fee Waiver:</strong> 100% waiver on new vehicle registration fees when presenting an official Certificate of Deposit.</li>
      </ul>
      <p>Ensure your vehicle chassis cut-out and RC cancellation are processed through authorized scrapping yards to avoid legal misuse.</p>
    `,
    categoryName: 'Scrapping Laws & RTO',
    tags: ['rto policy', '15 year rule', 'vehicle scrappage', 'certificate of deposit'],
    status: 'PUBLISHED',
    isFeatured: true,
  },
  {
    title: 'How to Get Maximum Cash Value When Scrapping Your Old Car',
    excerpt: 'Discover key factors that determine your vehicle scrap valuation, including metal weight, battery condition, catalytic converter, and working components.',
    content: `
      <h2>How Scrap Yards Value Your Car</h2>
      <p>Car scrap pricing isn't just about weight. While kerb weight provides the baseline steel value, specific components hold significant resale value.</p>
      <h3>High-Value Scrappage Components:</h3>
      <ul>
        <li><strong>Catalytic Converter:</strong> Contains precious metals like Platinum, Palladium, and Rhodium.</li>
        <li><strong>Lead-Acid Battery:</strong> Recyclable lead plates offer instant cash trade-ins.</li>
        <li><strong>Alloy Wheels & Tyres:</strong> Aluminum alloy rims fetch premium per-kg prices.</li>
        <li><strong>Copper Wiring Harness:</strong> Pure copper wiring yields high scrap rates.</li>
      </ul>
    `,
    categoryName: 'Car Valuation & Cash',
    tags: ['scrap price', 'car valuation', 'instant cash', 'metal weight'],
    status: 'PUBLISHED',
    isFeatured: true,
  },
];

const seedBlogs = async () => {
  try {
    console.log('🌱 Seeding Blog Categories and Articles...');

    const adminUser = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!adminUser) {
      console.log('⚠️ Admin user missing, skipping blog seeding.');
      return;
    }

    const categoryDocs = {};
    for (const catData of SAMPLE_CATEGORIES) {
      const slug = slugify(catData.name);
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({ ...catData, slug });
      }
      categoryDocs[catData.name] = cat._id;
    }

    for (const postData of SAMPLE_POSTS) {
      const slug = slugify(postData.title);
      let post = await Post.findOne({ slug });

      if (!post) {
        await Post.create({
          title: postData.title,
          slug,
          excerpt: postData.excerpt,
          content: postData.content,
          author: adminUser._id,
          category: categoryDocs[postData.categoryName],
          tags: postData.tags,
          status: postData.status,
          isFeatured: postData.isFeatured,
          featuredImage: {
            url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
            alt: postData.title,
          },
          seoMeta: {
            metaTitle: postData.title,
            metaDescription: postData.excerpt,
            keywords: postData.tags,
          },
        });
      }
    }

    console.log(`✅ Seeded ${SAMPLE_POSTS.length} Blog Articles.`);
  } catch (error) {
    console.error('❌ Error seeding Blogs:', error);
    throw error;
  }
};

module.exports = seedBlogs;
