import express from 'express';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import File from '../models/File.js';
import User from '../models/User.js';
import { checkPermission } from '../middleware/auth.js';

const router = express.Router();

// List invoices
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.session.user.role !== 'admin') {
      query.assignedDistributor = req.session.user.id;
    }
    
    const invoices = await Invoice.find(query)
      .populate('client', 'fullName')
      .populate('file', 'fileName')
      .populate('assignedDistributor', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
      
    res.render('invoices/index', { invoices });
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل الفواتير');
    res.render('invoices/index', { invoices: [] });
  }
});

// New invoice form
router.get('/new', checkPermission('canCreateInvoices'), async (req, res) => {
  try {
    const clients = await Client.find().sort({ fullName: 1 });
    const files = await File.find().populate('company', 'name').sort({ fileName: 1 });
    const distributors = await User.find({ role: 'distributor', isActive: true }).sort({ username: 1 });
    
    res.render('invoices/new', { clients, files, distributors });
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل البيانات');
    res.redirect('/invoices');
  }
});

// Create invoice
router.post('/', checkPermission('canCreateInvoices'), async (req, res) => {
  try {
    const { invoiceCode, client, file, assignedDistributor, invoiceDate, amount } = req.body;
    
    // Get client and distributor commission rates
    const clientData = await Client.findById(client);
    const distributorData = await User.findById(assignedDistributor);
    
    if (!clientData || !distributorData) {
      req.flash('error', 'بيانات العميل أو الموزع غير صحيحة');
      return res.redirect('/invoices/new');
    }
    
    const invoice = new Invoice({
      invoiceCode,
      client,
      file,
      assignedDistributor,
      invoiceDate: new Date(invoiceDate),
      amount: parseFloat(amount) || 0,
      clientCommissionRate: clientData.commissionRate,
      distributorCommissionRate: distributorData.commissionRate,
      createdBy: req.session.user.id
    });
    
    await invoice.save();
    req.flash('success', 'تم إنشاء الفاتورة بنجاح');
    res.redirect('/invoices');
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء إنشاء الفاتورة');
    res.redirect('/invoices/new');
  }
});

// Edit invoice form
router.get('/:id/edit', checkPermission('canCreateInvoices'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    const clients = await Client.find().sort({ fullName: 1 });
    const files = await File.find().populate('company', 'name').sort({ fileName: 1 });
    const distributors = await User.find({ role: 'distributor', isActive: true }).sort({ username: 1 });
    
    if (!invoice) {
      req.flash('error', 'الفاتورة غير موجودة');
      return res.redirect('/invoices');
    }
    
    res.render('invoices/edit', { invoice, clients, files, distributors });
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحميل بيانات الفاتورة');
    res.redirect('/invoices');
  }
});

// Update invoice
router.put('/:id', checkPermission('canCreateInvoices'), async (req, res) => {
  try {
    const { invoiceCode, client, file, assignedDistributor, invoiceDate, amount, status } = req.body;
    
    await Invoice.findByIdAndUpdate(req.params.id, {
      invoiceCode,
      client,
      file,
      assignedDistributor,
      invoiceDate: new Date(invoiceDate),
      amount: parseFloat(amount) || 0,
      status
    });
    
    req.flash('success', 'تم تحديث الفاتورة بنجاح');
    res.redirect('/invoices');
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء تحديث الفاتورة');
    res.redirect('/invoices');
  }
});

// Delete invoice
router.delete('/:id', checkPermission('canCreateInvoices'), async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    req.flash('success', 'تم حذف الفاتورة بنجاح');
    res.redirect('/invoices');
  } catch (error) {
    req.flash('error', 'حدث خطأ أثناء حذف الفاتورة');
    res.redirect('/invoices');
  }
});

export default router;