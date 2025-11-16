const express = require('express');
const router = express.Router();
const { Asset, Employee, Branch } = require('../models');

// Home page route
router.get('/', async (req, res) => {
  try {
    // Get counts for dashboard
    const assetCount = await Asset.count();
    const stockCount = await Asset.count({ where: { status: 'stock' } });
    const issuedCount = await Asset.count({ where: { status: 'issued' } });
    const scrappedCount = await Asset.count({ where: { status: 'scrapped' } });
    const employeeCount = await Employee.count();
    
    res.render('index', { 
      title: 'Asset Ledger Dashboard',
      assetCount,
      stockCount,
      issuedCount,
      scrappedCount,
      employeeCount
    });
  } catch (error) {
    console.error(error);
    res.render('index', { 
      title: 'Asset Ledger Dashboard',
      assetCount: 0,
      stockCount: 0,
      issuedCount: 0,
      scrappedCount: 0,
      employeeCount: 0
    });
  }
});

module.exports = router;