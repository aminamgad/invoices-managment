import express from 'express';
<<<<<<< HEAD
import User from '../models/User.js';

const router = express.Router();

=======
import User from '../models/UserUpdated.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';

const router = express.Router();

// Default permissions for new distributors
const getDefaultDistributorPermissions = async () => {
  const defaultPermissionNames = [
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
  ];
  
  const permissions = await Permission.find({ name: { $in: defaultPermissionNames } });
  return permissions.map(p => p._id);
};

>>>>>>> 70d44eb189c11774f4f7101db3effc7420714e4a
// List distributors
router.get('/', async (req, res) => {
  try {
    const distributors = await User.find({ role: 'distributor' }).sort({ createdAt: -1 });
    res.render('distributors/index', { distributors });
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل الموزعين');
    res.render('distributors/index', { distributors: [] });
  }
});

// New distributor form
<<<<<<< HEAD
router.get('/new', (req, res) => {
  res.render('distributors/new');
=======
router.get('/new', async (req, res) => {
  try {
    const permissions = await Permission.find({ 
      isActive: true,
      module: { $in: ['suppliers', 'clients', 'files', 'orders', 'agents'] }
    }).sort({ module: 1, action: 1 });
    
    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {});
    
    // Get default permissions for distributors
    const defaultPermissions = await getDefaultDistributorPermissions();
    
    res.render('distributors/new', { 
      groupedPermissions,
      defaultPermissions: defaultPermissions.map(id => id.toString())
    });
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل البيانات');
    res.redirect('/distributors');
  }
>>>>>>> 70d44eb189c11774f4f7101db3effc7420714e4a
});

// Create distributor
router.post('/', async (req, res) => {
  try {
    const { username, password, commissionRate, permissions } = req.body;
    
    const distributor = new User({
      username,
      password,
      role: 'distributor',
      commissionRate: parseFloat(commissionRate) || 0,
      permissions: {
        canCreateCompanies: permissions?.canCreateCompanies === 'on',
        canCreateInvoices: permissions?.canCreateInvoices === 'on',
        canManageClients: permissions?.canManageClients === 'on',
        canViewReports: permissions?.canViewReports === 'on'
      }
    });
    
    await distributor.save();
<<<<<<< HEAD
=======
    
    // Create a custom role for this distributor with selected permissions
    const selectedPermissions = Array.isArray(permissions) ? permissions : [permissions].filter(Boolean);
    
    if (selectedPermissions.length > 0) {
      const customRole = new Role({
        name: `distributor_${distributor._id}`,
        displayName: `دور ${distributor.username}`,
        description: `دور مخصص للموزع ${distributor.username}`,
        permissions: selectedPermissions,
        isSystemRole: false,
        createdBy: req.session.user.id
      });
      
      await customRole.save();
      
      // Assign the custom role to the distributor
      distributor.roles = [customRole._id];
      await distributor.save();
    } else {
      // Assign default distributor role
      const distributorRole = await Role.findOne({ name: 'distributor' });
      if (distributorRole) {
        distributor.roles = [distributorRole._id];
        await distributor.save();
      }
    }
    
>>>>>>> 70d44eb189c11774f4f7101db3effc7420714e4a
    req.flash('success', 'تم إضافة الموزع بنجاح');
    res.redirect('/distributors');
  } catch (error) {
    console.error('Error creating distributor:', error);
    req.flash('error', 'حدث خطأ أثناء إضافة الموزع');
    res.redirect('/distributors/new');
  }
});

// Edit distributor form
router.get('/:id/edit', async (req, res) => {
  try {
    const distributor = await User.findById(req.params.id);
    if (!distributor) {
      req.flash('error', 'الموزع غير موجود');
      return res.redirect('/distributors');
    }
<<<<<<< HEAD
    res.render('distributors/edit', { distributor });
=======
    
    const permissions = await Permission.find({ 
      isActive: true,
      module: { $in: ['suppliers', 'clients', 'files', 'orders', 'agents'] }
    }).sort({ module: 1, action: 1 });
    
    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {});
    
    // Get current user permissions
    const userPermissions = [];
    distributor.roles.forEach(role => {
      role.permissions.forEach(permission => {
        userPermissions.push(permission._id.toString());
      });
    });
    
    res.render('distributors/edit', { 
      distributor, 
      groupedPermissions,
      userPermissions
    });
>>>>>>> 70d44eb189c11774f4f7101db3effc7420714e4a
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل بيانات الموزع');
    res.redirect('/distributors');
  }
});

// Update distributor
router.put('/:id', async (req, res) => {
  try {
    const { username, commissionRate, permissions, isActive } = req.body;
    
    const distributor = await User.findById(req.params.id).populate('roles');
    if (!distributor) {
      req.flash('error', 'الموزع غير موجود');
      return res.redirect('/distributors');
    }
    
    // Update basic info
    distributor.username = username;
    distributor.commissionRate = parseFloat(commissionRate) || 0;
    distributor.isActive = isActive === 'on';
    distributor.permissions = {
      canCreateCompanies: permissions?.canCreateCompanies === 'on',
      canCreateInvoices: permissions?.canCreateInvoices === 'on',
      canManageClients: permissions?.canManageClients === 'on',
      canViewReports: permissions?.canViewReports === 'on'
    };
    
    await distributor.save();
    
    // Update permissions
    const selectedPermissions = Array.isArray(permissions) ? permissions : [permissions].filter(Boolean);
    
    // Find or create custom role for this distributor
    let customRole = await Role.findOne({ name: `distributor_${distributor._id}` });
    
    if (customRole) {
      // Update existing custom role
      customRole.permissions = selectedPermissions;
      await customRole.save();
    } else if (selectedPermissions.length > 0) {
      // Create new custom role
      customRole = new Role({
        name: `distributor_${distributor._id}`,
        displayName: `دور ${distributor.username}`,
        description: `دور مخصص للموزع ${distributor.username}`,
        permissions: selectedPermissions,
        isSystemRole: false,
        createdBy: req.session.user.id
      });
      
      await customRole.save();
      
      // Update distributor roles
      distributor.roles = [customRole._id];
      await distributor.save();
    }
    
    req.flash('success', 'تم تحديث بيانات الموزع بنجاح');
    res.redirect('/distributors');
  } catch (error) {
    console.error('Error updating distributor:', error);
    req.flash('error', 'حدث خطأ أثناء تحديث بيانات الموزع');
    res.redirect('/distributors');
  }
});

export default router;