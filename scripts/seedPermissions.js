import mongoose from 'mongoose';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import User from '../models/UserUpdated.js';
import dotenv from 'dotenv';

dotenv.config();

const permissions = [
  // Companies
  { name: 'companies.create', displayName: 'إنشاء شركة', module: 'companies', action: 'create' },
  { name: 'companies.read', displayName: 'عرض الشركات', module: 'companies', action: 'read' },
  { name: 'companies.update', displayName: 'تعديل شركة', module: 'companies', action: 'update' },
  { name: 'companies.delete', displayName: 'حذف شركة', module: 'companies', action: 'delete' },
  { name: 'companies.read_all', displayName: 'عرض جميع الشركات', module: 'companies', action: 'read_all' },
  
  // Clients
  { name: 'clients.create', displayName: 'إنشاء عميل', module: 'clients', action: 'create' },
  { name: 'clients.read', displayName: 'عرض العملاء', module: 'clients', action: 'read' },
  { name: 'clients.update', displayName: 'تعديل عميل', module: 'clients', action: 'update' },
  { name: 'clients.delete', displayName: 'حذف عميل', module: 'clients', action: 'delete' },
  { name: 'clients.read_all', displayName: 'عرض جميع العملاء', module: 'clients', action: 'read_all' },
  { name: 'clients.read_own', displayName: 'عرض العملاء الخاصة', module: 'clients', action: 'read_own' },
  
  // Files
  { name: 'files.create', displayName: 'إنشاء ملف', module: 'files', action: 'create' },
  { name: 'files.read', displayName: 'عرض الملفات', module: 'files', action: 'read' },
  { name: 'files.update', displayName: 'تعديل ملف', module: 'files', action: 'update' },
  { name: 'files.delete', displayName: 'حذف ملف', module: 'files', action: 'delete' },
  { name: 'files.read_all', displayName: 'عرض جميع الملفات', module: 'files', action: 'read_all' },
  { name: 'files.read_own', displayName: 'عرض الملفات الخاصة', module: 'files', action: 'read_own' },
  
  // Invoices
  { name: 'invoices.create', displayName: 'إنشاء فاتورة', module: 'invoices', action: 'create' },
  { name: 'invoices.read', displayName: 'عرض الفواتير', module: 'invoices', action: 'read' },
  { name: 'invoices.update', displayName: 'تعديل فاتورة', module: 'invoices', action: 'update' },
  { name: 'invoices.delete', displayName: 'حذف فاتورة', module: 'invoices', action: 'delete' },
  { name: 'invoices.read_all', displayName: 'عرض جميع الفواتير', module: 'invoices', action: 'read_all' },
  { name: 'invoices.read_own', displayName: 'عرض الفواتير الخاصة', module: 'invoices', action: 'read_own' },
  
  // Distributors
  { name: 'distributors.create', displayName: 'إنشاء موزع', module: 'distributors', action: 'create' },
  { name: 'distributors.read', displayName: 'عرض الموزعين', module: 'distributors', action: 'read' },
  { name: 'distributors.update', displayName: 'تعديل موزع', module: 'distributors', action: 'update' },
  { name: 'distributors.delete', displayName: 'حذف موزع', module: 'distributors', action: 'delete' },
  { name: 'distributors.manage', displayName: 'إدارة الموزعين', module: 'distributors', action: 'manage' },
  
  // Reports
  { name: 'reports.read', displayName: 'عرض التقارير', module: 'reports', action: 'read' },
  { name: 'reports.read_all', displayName: 'عرض جميع التقارير', module: 'reports', action: 'read_all' },
  { name: 'reports.read_own', displayName: 'عرض التقارير الخاصة', module: 'reports', action: 'read_own' },
  { name: 'reports.export', displayName: 'تصدير التقارير', module: 'reports', action: 'manage' },
  
  // Commission Tiers
  { name: 'commission-tiers.create', displayName: 'إنشاء مستوى عمولة', module: 'commission-tiers', action: 'create' },
  { name: 'commission-tiers.read', displayName: 'عرض مستويات العمولة', module: 'commission-tiers', action: 'read' },
  { name: 'commission-tiers.update', displayName: 'تعديل مستوى عمولة', module: 'commission-tiers', action: 'update' },
  { name: 'commission-tiers.delete', displayName: 'حذف مستوى عمولة', module: 'commission-tiers', action: 'delete' },
  
  // Roles & Permissions
  { name: 'roles.create', displayName: 'إنشاء دور', module: 'roles', action: 'create' },
  { name: 'roles.read', displayName: 'عرض الأدوار', module: 'roles', action: 'read' },
  { name: 'roles.update', displayName: 'تعديل دور', module: 'roles', action: 'update' },
  { name: 'roles.delete', displayName: 'حذف دور', module: 'roles', action: 'delete' },
  { name: 'roles.assign', displayName: 'تعيين الأدوار', module: 'roles', action: 'manage' },
  
  { name: 'permissions.create', displayName: 'إنشاء صلاحية', module: 'permissions', action: 'create' },
  { name: 'permissions.read', displayName: 'عرض الصلاحيات', module: 'permissions', action: 'read' },
  { name: 'permissions.update', displayName: 'تعديل صلاحية', module: 'permissions', action: 'update' },
  { name: 'permissions.delete', displayName: 'حذف صلاحية', module: 'permissions', action: 'delete' },
  
  // System
  { name: 'system.settings', displayName: 'إعدادات النظام', module: 'system', action: 'manage' },
  { name: 'system.backup', displayName: 'النسخ الاحتياطي', module: 'system', action: 'manage' },
  { name: 'system.logs', displayName: 'سجلات النظام', module: 'system', action: 'read' }
];

const roles = [
  {
    name: 'admin',
    displayName: 'مدير النظام',
    description: 'صلاحيات كاملة لجميع أجزاء النظام',
    isSystemRole: true,
    permissions: [] // Will be populated with all permissions
  },
  {
    name: 'manager',
    displayName: 'مدير',
    description: 'صلاحيات إدارية محدودة',
    isSystemRole: true,
    permissions: [
      'companies.read', 'companies.create', 'companies.update',
      'clients.read', 'clients.create', 'clients.update', 'clients.read_all',
      'files.read', 'files.create', 'files.update', 'files.read_all',
      'invoices.read', 'invoices.create', 'invoices.update', 'invoices.read_all',
      'reports.read', 'reports.read_all', 'reports.export',
      'commission-tiers.read', 'commission-tiers.create', 'commission-tiers.update'
    ]
  },
  {
    name: 'distributor',
    displayName: 'موزع',
    description: 'صلاحيات أساسية للموزعين',
    isSystemRole: true,
    permissions: [
      'clients.read', 'clients.read_own',
      'files.read', 'files.read_own',
      'invoices.read', 'invoices.create', 'invoices.read_own',
      'reports.read', 'reports.read_own'
    ]
  },
  {
    name: 'employee',
    displayName: 'موظف',
    description: 'صلاحيات محدودة للموظفين',
    isSystemRole: true,
    permissions: [
      'clients.read', 'clients.read_own',
      'files.read', 'files.read_own',
      'invoices.read', 'invoices.read_own'
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arabic-invoice-system')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Clear existing permissions and roles
      await Permission.deleteMany({});
      await Role.deleteMany({});
      console.log('Cleared existing permissions and roles');
      
      // Create permissions
      const createdPermissions = await Permission.insertMany(permissions);
      console.log(`Created ${createdPermissions.length} permissions`);
      
      // Create permission map for easy lookup
      const permissionMap = {};
      createdPermissions.forEach(permission => {
        permissionMap[permission.name] = permission._id;
      });
      
      // Create roles with proper permission references
      for (const roleData of roles) {
        const role = new Role({
          name: roleData.name,
          displayName: roleData.displayName,
          description: roleData.description,
          isSystemRole: roleData.isSystemRole,
          permissions: roleData.name === 'admin' 
            ? createdPermissions.map(p => p._id) // Admin gets all permissions
            : roleData.permissions.map(permName => permissionMap[permName]).filter(Boolean)
        });
        
        await role.save();
        console.log(`Created role: ${role.displayName}`);
      }
      
      // Update admin user to use new role system
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        const adminRole = await Role.findOne({ name: 'admin' });
        if (adminRole) {
          adminUser.roles = [adminRole._id];
          await adminUser.save();
          console.log('Updated admin user with new role system');
        }
      }
      
      console.log('✅ Permissions and roles seeded successfully!');
      console.log('\nCreated Roles:');
      const allRoles = await Role.find().populate('permissions');
      allRoles.forEach(role => {
        console.log(`- ${role.displayName} (${role.permissions.length} permissions)`);
      });
      
    } catch (error) {
      console.error('Error seeding permissions and roles:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });