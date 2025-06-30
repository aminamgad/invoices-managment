import express from 'express';
import User from '../models/User.js';

const router = express.Router();

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
router.get('/new', (req, res) => {
  res.render('distributors/new');
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
    const distributor = await User.findById(req.params.id);
    if (!distributor) {
      req.flash('error', 'الموزع غير موجود');
      return res.redirect('/distributors');
    }
    res.render('distributors/edit', { distributor });
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