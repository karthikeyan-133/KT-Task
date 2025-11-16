const express = require('express');
const router = express.Router();
const { Asset, AssetTransaction, Employee, Branch } = require('../models');

// Get all transactions (HTML view)
router.get('/', async (req, res) => {
  try {
    const transactions = await AssetTransaction.findAll({
      include: [
        { model: Asset, attributes: ['asset_code', 'name'] },
        { model: Employee, attributes: ['full_name'] },
        { model: Branch, attributes: ['name'] }
      ],
      order: [['transaction_date', 'DESC']]
    });
    res.render('transactions/index', { title: 'Asset Transactions', transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving transactions');
  }
});

// Get all transactions (API endpoint)
router.get('/api', async (req, res) => {
  try {
    const transactions = await AssetTransaction.findAll({
      include: [
        { model: Asset, attributes: ['asset_code', 'name'] },
        { model: Employee, attributes: ['full_name'] },
        { model: Branch, attributes: ['name'] }
      ],
      order: [['transaction_date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving transactions' });
  }
});

// Show issue asset form
router.get('/issue', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'stock' },
      order: [['asset_code', 'ASC']]
    });
    const employees = await Employee.findAll({
      where: { is_active: true },
      order: [['full_name', 'ASC']]
    });
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    res.render('transactions/issue', { title: 'Issue Asset', assets, employees, branches });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Process asset issue
router.post('/issue', async (req, res) => {
  try {
    const { asset_id, employee_id, branch_id, notes } = req.body;
    
    // Update asset status
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).send('Asset not found');
    }
    
    await asset.update({
      status: 'issued',
      issued_to: employee_id,
      issued_at: new Date()
    });
    
    // Create transaction record
    await AssetTransaction.create({
      asset_id,
      employee_id,
      branch_id,
      transaction_type: 'issue',
      notes
    });
    
    res.redirect('/transactions');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error issuing asset');
  }
});

// Show return asset form
router.get('/return', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: 'issued' },
      include: [{ model: Employee, attributes: ['full_name'] }],
      order: [['asset_code', 'ASC']]
    });
    res.render('transactions/return', { title: 'Return Asset', assets });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Process asset return
router.post('/return', async (req, res) => {
  try {
    const { asset_id, notes } = req.body;
    
    // Update asset status
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).send('Asset not found');
    }
    
    const branch_id = asset.branch_id;
    
    await asset.update({
      status: 'stock',
      issued_to: null,
      issued_at: null
    });
    
    // Create transaction record
    await AssetTransaction.create({
      asset_id,
      employee_id: asset.issued_to,
      branch_id,
      transaction_type: 'return',
      notes
    });
    
    res.redirect('/transactions');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error returning asset');
  }
});

// Show scrap asset form
router.get('/scrap', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: { status: ['stock', 'issued'] },
      order: [['asset_code', 'ASC']]
    });
    res.render('transactions/scrap', { title: 'Scrap Asset', assets });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Process asset scrap
router.post('/scrap', async (req, res) => {
  try {
    const { asset_id, notes } = req.body;
    
    // Update asset status
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).send('Asset not found');
    }
    
    const branch_id = asset.branch_id;
    const employee_id = asset.issued_to;
    
    await asset.update({
      status: 'scrapped'
    });
    
    // Create transaction record
    await AssetTransaction.create({
      asset_id,
      employee_id,
      branch_id,
      transaction_type: 'scrap',
      notes
    });
    
    res.redirect('/transactions');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error scrapping asset');
  }
});

module.exports = router;