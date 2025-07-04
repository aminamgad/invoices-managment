import express from 'express';
import User from '../models/User.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';

const router = express.Router();

// Default permissions for new distributors
const getDefaultDistributorPermissions = async () => {
  const defaultPermissionNames = [
    // Clients, Files, Orders: View Own + Create + Update + Delete
    'clients.view_own', 'clients.create', 'clients.update', 'clients.delete',
    'files.view_own', 'files.create', 'files.update', 'files.delete',
    'orders.view_own', 'orders.create', 'orders.update', 'orders.delete',
    // Suppliers, Agents: View Own only
    'suppliers.view_own',
    'agents.view_own',
    // Reports: View Own
    'reports.view_own'
  ];
  
  const permissions = await Permission.find({ name: { $in: defaultPermissionNames } });
  return permissions.map(p => p._id);
};

// List distributors
router.get('/', async (req, res) => {
  try {
    const distributors = await User.find({ role: 'distributor' })
      .populate('roles')
      .sort({ createdAt: -1 });
    res.render('distributors/index', { distributors });
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل الموزعين');
    res.render('distributors/index', { distributors: [] });
  }
});

// New distributor form
router.get('/new', async (req, res) => {
  try {
    const permissions = await Permission.find({ isActive: true }).sort({ module: 1, action: 1 });
    
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
    
    // Assign distributor role
    const distributorRole = await Role.findOne({ name: 'distributor' });
    if (distributorRole) {
      distributor.roles = [distributorRole._id];
      await distributor.save();
    }
    
    req.flash('success', 'تم إضافة الموزع بنجاح');
    res.redirect('/distributors');
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء إضافة الموزع');
    res.redirect('/distributors/new');
  }
});

// Edit distributor form
router.get('/:id/edit', async (req, res) => {
  try {
    const distributor = await User.findById(req.params.id)
      .populate({
        path: 'roles',
        populate: {
          path: 'permissions'
        }
      });
      
    if (!distributor) {
      req.flash('error', 'الموزع غير موجود');
      return res.redirect('/distributors');
    }
    
    const permissions = await Permission.find({ isActive: true }).sort({ module: 1, action: 1 });
    
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
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل بيانات الموزع');
    res.redirect('/distributors');
  }
});

// Update distributor
router.put('/:id', async (req, res) => {
  try {
    const { username, commissionRate, permissions, isActive } = req.body;
    
    const updateData = {
      username,
      commissionRate: parseFloat(commissionRate) || 0,
      permissions: {
        canCreateCompanies: permissions?.canCreateCompanies === 'on',
        canCreateInvoices: permissions?.canCreateInvoices === 'on',
        canManageClients: permissions?.canManageClients === 'on',
        canViewReports: permissions?.canViewReports === 'on'
      },
      isActive: isActive === 'on'
    };
    
    await User.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'تم تحديث بيانات الموزع بنجاح');
    res.redirect('/distributors');
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحديث بيانات الموزع');
    res.redirect('/distributors');
  }
});

export default router;