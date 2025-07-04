import mongoose from 'mongoose';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import User from '../models/UserUpdated.js';
import dotenv from 'dotenv';

dotenv.config();

const permissions = [
  // Suppliers (الشركات)
  { name: 'suppliers.view_own', displayName: 'عرض الشركات الخاصة', module: 'suppliers', action: 'view_own' },
  { name: 'suppliers.view_all', displayName: 'عرض جميع الشركات', module: 'suppliers', action: 'view_all' },
  { name: 'suppliers.create', displayName: 'إنشاء شركة', module: 'suppliers', action: 'create' },
  { name: 'suppliers.update', displayName: 'تعديل شركة', module: 'suppliers', action: 'update' },
  { name: 'suppliers.delete', displayName: 'حذف شركة', module: 'suppliers', action: 'delete' },
  
  // Clients (العملاء)
  { name: 'clients.view_own', displayName: 'عرض العملاء الخاصة', module: 'clients', action: 'view_own' },
  { name: 'clients.view_all', displayName: 'عرض جميع العملاء', module: 'clients', action: 'view_all' },
  { name: 'clients.create', displayName: 'إنشاء عميل', module: 'clients', action: 'create' },
  { name: 'clients.update', displayName: 'تعديل عميل', module: 'clients', action: 'update' },
  { name: 'clients.delete', displayName: 'حذف عميل', module: 'clients', action: 'delete' },
  
  // Files (الملفات)
  { name: 'files.view_own', displayName: 'عرض الملفات الخاصة', module: 'files', action: 'view_own' },
  { name: 'files.view_all', displayName: 'عرض جميع الملفات', module: 'files', action: 'view_all' },
  { name: 'files.create', displayName: 'إنشاء ملف', module: 'files', action: 'create' },
  { name: 'files.update', displayName: 'تعديل ملف', module: 'files', action: 'update' },
  { name: 'files.delete', displayName: 'حذف ملف', module: 'files', action: 'delete' },
  
  // Orders (الطلبات)
  { name: 'orders.view_own', displayName: 'عرض الطلبات الخاصة', module: 'orders', action: 'view_own' },
  { name: 'orders.view_all', displayName: 'عرض جميع الطلبات', module: 'orders', action: 'view_all' },
  { name: 'orders.create', displayName: 'إنشاء طلب', module: 'orders', action: 'create' },
  { name: 'orders.update', displayName: 'تعديل طلب', module: 'orders', action: 'update' },
  { name: 'orders.delete', displayName: 'حذف طلب', module: 'orders', action: 'delete' },
  
  // Agents (الوُسطاء)
  { name: 'agents.view_own', displayName: 'عرض الوُسطاء الخاصة', module: 'agents', action: 'view_own' },
  { name: 'agents.view_all', displayName: 'عرض جميع الوُسطاء', module: 'agents', action: 'view_all' },
  { name: 'agents.create', displayName: 'إنشاء وسيط', module: 'agents', action: 'create' },
  { name: 'agents.update', displayName: 'تعديل وسيط', module: 'agents', action: 'update' },
  { name: 'agents.delete', displayName: 'حذف وسيط', module: 'agents', action: 'delete' },
  
  // Reports (التقارير)
  { name: 'reports.view_own', displayName: 'عرض التقارير الخاصة', module: 'reports', action: 'view_own' },
  { name: 'reports.view_all', displayName: 'عرض جميع التقارير', module: 'reports', action: 'view_all' },
  { name: 'reports.export', displayName: 'تصدير التقارير', module: 'reports', action: 'manage' },
  
  // Commission Tiers (مستويات العمولة)
  { name: 'commission-tiers.create', displayName: 'إنشاء مستوى عمولة', module: 'commission-tiers', action: 'create' },
  { name: 'commission-tiers.read', displayName: 'عرض مستويات العمولة', module: 'commission-tiers', action: 'read' },
  { name: 'commission-tiers.update', displayName: 'تعديل مستوى عمولة', module: 'commission-tiers', action: 'update' },
  { name: 'commission-tiers.delete', displayName: 'حذف مستوى عمولة', module: 'commission-tiers', action: 'delete' },
  
  // Companies (backward compatibility)
  { name: 'companies.view_own', displayName: 'عرض الشركات الخاصة', module: 'companies', action: 'view_own' },
  { name: 'companies.view_all', displayName: 'عرض جميع الشركات', module: 'companies', action: 'view_all' },
  { name: 'companies.create', displayName: 'إنشاء شركة', module: 'companies', action: 'create' },
  { name: 'companies.update', displayName: 'تعديل شركة', module: 'companies', action: 'update' },
  { name: 'companies.delete', displayName: 'حذف شركة', module: 'companies', action: 'delete' },
  
  // Invoices (backward compatibility)
  { name: 'invoices.view_own', displayName: 'عرض الفواتير الخاصة', module: 'invoices', action: 'view_own' },
  { name: 'invoices.view_all', displayName: 'عرض جميع الفواتير', module: 'invoices', action: 'view_all' },
  { name: 'invoices.create', displayName: 'إنشاء فاتورة', module: 'invoices', action: 'create' },
  { name: 'invoices.update', displayName: 'تعديل فاتورة', module: 'invoices', action: 'update' },
  { name: 'invoices.delete', displayName: 'حذف فاتورة', module: 'invoices', action: 'delete' },
  
  // Distributors
  { name: 'distributors.view_own', displayName: 'عرض الموزعين الخاصة', module: 'distributors', action: 'view_own' },
  { name: 'distributors.view_all', displayName: 'عرض جميع الموزعين', module: 'distributors', action: 'view_all' },
  { name: 'distributors.create', displayName: 'إنشاء موزع', module: 'distributors', action: 'create' },
  { name: 'distributors.update', displayName: 'تعديل موزع', module: 'distributors', action: 'update' },
  { name: 'distributors.delete', displayName: 'حذف موزع', module: 'distributors', action: 'delete' },
  
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
      'suppliers.view_all', 'suppliers.create', 'suppliers.update',
      'clients.view_all', 'clients.create', 'clients.update',
      'files.view_all', 'files.create', 'files.update',
      'orders.view_all', 'orders.create', 'orders.update',
      'agents.view_all', 'agents.create', 'agents.update',
      'reports.view_all', 'reports.export',
      'commission-tiers.read', 'commission-tiers.create', 'commission-tiers.update'
    ]
  },
  {
    name: 'distributor',
    displayName: 'موزع',
    description: 'صلاحيات أساسية للموزعين',
    isSystemRole: true,
    permissions: [
      // Suppliers: View Own + View All
      'suppliers.view_own', 'suppliers.view_all',
      // Clients, Files, Orders: View Own + View All + Create + Update + Delete
      'clients.view_own', 'clients.view_all', 'clients.create', 'clients.update', 'clients.delete',
      'files.view_own', 'files.view_all', 'files.create', 'files.update', 'files.delete',
      'orders.view_own', 'orders.view_all', 'orders.create', 'orders.update', 'orders.delete',
      // Agents: View Own only
      'agents.view_own',
      // Reports: View Own
      'reports.view_own'
    ]
  },
  {
    name: 'employee',
    displayName: 'موظف',
    description: 'صلاحيات محدودة للموظفين',
    isSystemRole: true,
    permissions: [
      'clients.view_own',
      'files.view_own',
      'orders.view_own',
      'suppliers.view_own',
      'agents.view_own'
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