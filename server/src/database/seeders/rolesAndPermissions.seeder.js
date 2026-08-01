const mongoose = require('mongoose');
const Role = require('../../models/Role');
const Permission = require('../../models/Permission');
const { slugify } = require('../../helpers/helpers');

const DEFAULT_PERMISSIONS = [
  { name: 'Create', module: 'CONTENT', description: 'Permission to create new resources and content entries' },
  { name: 'Read', module: 'CONTENT', description: 'Permission to view and read system resources' },
  { name: 'Update', module: 'CONTENT', description: 'Permission to edit existing resources and content entries' },
  { name: 'Delete', module: 'CONTENT', description: 'Permission to soft-delete or remove resources' },
  { name: 'Publish', module: 'CONTENT', description: 'Permission to publish, unpublish, or archive live content' },
  { name: 'Export', module: 'DATA', description: 'Permission to export data reports and CSV/JSON files' },
  { name: 'Import', module: 'DATA', description: 'Permission to bulk import data into the platform' },
  { name: 'Manage Users', module: 'ADMIN', description: 'Permission to create, edit, or delete platform users' },
  { name: 'Manage Settings', module: 'ADMIN', description: 'Permission to configure global website settings and parameters' },
];

const DEFAULT_ROLES_MAP = [
  {
    name: 'Super Admin',
    description: 'Unrestricted access to all platform resources, settings, and user management',
    permissions: ['Create', 'Read', 'Update', 'Delete', 'Publish', 'Export', 'Import', 'Manage Users', 'Manage Settings'],
  },
  {
    name: 'Admin',
    description: 'Full operational access excluding critical global system infrastructure settings',
    permissions: ['Create', 'Read', 'Update', 'Delete', 'Publish', 'Export', 'Import', 'Manage Users'],
  },
  {
    name: 'Editor',
    description: 'Editorial content management access including creating, editing, publishing, and imports',
    permissions: ['Create', 'Read', 'Update', 'Publish', 'Export', 'Import'],
  },
  {
    name: 'Manager',
    description: 'Operations management access for reviewing inquiries, services, and reporting',
    permissions: ['Create', 'Read', 'Update', 'Publish', 'Export'],
  },
  {
    name: 'Customer Support',
    description: 'Support agent access to handle customer inquiries, follow-ups, and view records',
    permissions: ['Read', 'Update', 'Export'],
  },
];

const seedRolesAndPermissions = async () => {
  try {
    console.log('🌱 Starting Roles and Permissions seeding...');

    // 1. Seed Permissions
    const permissionDocsMap = {};
    for (const permData of DEFAULT_PERMISSIONS) {
      const slug = slugify(permData.name);
      let perm = await Permission.findOne({ slug });
      if (!perm) {
        perm = await Permission.create({
          name: permData.name,
          slug,
          module: permData.module,
          description: permData.description,
        });
      }
      permissionDocsMap[permData.name] = perm._id;
    }
    console.log(`✅ Seeded ${Object.keys(permissionDocsMap).length} Permissions.`);

    // 2. Seed Roles and Link Permissions
    for (const roleData of DEFAULT_ROLES_MAP) {
      const slug = slugify(roleData.name);
      const linkedPermissionIds = roleData.permissions.map((pName) => permissionDocsMap[pName]);

      let role = await Role.findOne({ slug });
      if (!role) {
        await Role.create({
          name: roleData.name,
          slug,
          description: roleData.description,
          permissions: linkedPermissionIds,
          isSystemRole: true,
        });
      } else {
        role.permissions = linkedPermissionIds;
        await role.save();
      }
    }

    console.log(`✅ Seeded ${DEFAULT_ROLES_MAP.length} Roles with assigned permissions.`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding Roles and Permissions:', error);
    throw error;
  }
};

module.exports = seedRolesAndPermissions;
