const Gallery = require('../../models/Gallery');

const SAMPLE_GALLERY = [
  {
    title: 'Hydraulic Car Press Machine & Metal Baler',
    description: 'High-density hydraulic compactor compressing scrap vehicle body shells into compact metal cubes.',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    category: 'machinery',
    album: 'Facility Operations',
    tags: ['hydraulic press', 'metal baler', 'scrapyard machinery'],
    displayOrder: 1,
    status: 'ACTIVE',
  },
  {
    title: 'Automated Fluid Depollution Station',
    description: 'Zero-emission vacuum extraction of engine oil, coolant, brake fluids, and refrigerant gases.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
    category: 'dismantling',
    album: 'Eco Recycling',
    tags: ['fluid depollution', 'eco friendly', 'dismantling bay'],
    displayOrder: 2,
    status: 'ACTIVE',
  },
  {
    title: 'Chassis Stamping & Cut-Out Verification',
    description: 'Authorized technicians cutting out chassis number plates for official RTO de-registration verification.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
    category: 'scrapyard',
    album: 'RTO Compliance',
    tags: ['chassis cut', 'rto verification', 'scrap yard'],
    displayOrder: 3,
    status: 'ACTIVE',
  },
  {
    title: 'Sorted Heavy Metal Scrap Bales',
    description: 'Sorted high-grade steel and non-ferrous aluminum scrap bales ready for eco-foundry smelting.',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
    category: 'bales',
    album: 'Recycling Storage',
    tags: ['metal bales', 'steel scrap', 'foundry supply'],
    displayOrder: 4,
    status: 'ACTIVE',
  },
];

const seedGallery = async () => {
  try {
    console.log('🌱 Seeding Gallery Images...');

    for (const item of SAMPLE_GALLERY) {
      let doc = await Gallery.findOne({ title: item.title });
      if (!doc) {
        await Gallery.create(item);
      }
    }

    console.log(`✅ Seeded ${SAMPLE_GALLERY.length} Gallery Images.`);
  } catch (error) {
    console.error('❌ Error seeding Gallery:', error);
    throw error;
  }
};

module.exports = seedGallery;
