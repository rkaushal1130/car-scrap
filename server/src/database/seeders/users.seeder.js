const User = require('../../models/User');

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding Users...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@carscrap.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        fullName: 'Super Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'SUPER_ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        isActive: true,
      });
      console.log(`✅ Super Admin created: ${admin.email}`);
    } else {
      console.log(`ℹ️ Super Admin already exists: ${admin.email}`);
    }

    const editorEmail = 'editor@carscrap.com';
    let editor = await User.findOne({ email: editorEmail });

    if (!editor) {
      editor = await User.create({
        fullName: 'Lead Content Editor',
        email: editorEmail,
        password: 'Editor@123456',
        role: 'EDITOR',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        isActive: true,
      });
      console.log(`✅ Editor created: ${editor.email}`);
    }

    return admin;
  } catch (error) {
    console.error('❌ Error seeding Users:', error);
    throw error;
  }
};

module.exports = seedUsers;
