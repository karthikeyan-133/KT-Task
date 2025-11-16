const express = require('express');
const router = express.Router();
const { Asset, AssetCategory, Branch, Employee } = require('../models');

// Get all assets (HTML view)
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [
        { model: AssetCategory, attributes: ['name'] },
        { model: Branch, attributes: ['name'] },
        { model: Employee, attributes: ['full_name'] }
      ],
      order: [['asset_code', 'ASC']]
    });
    res.render('assets/index', { title: 'Asset Master', assets });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving assets');
  }
});

// Get all assets (API endpoint)
router.get('/api', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [
        { model: AssetCategory, attributes: ['name'] },
        { model: Branch, attributes: ['name'] },
        { model: Employee, attributes: ['full_name'] }
      ],
      order: [['asset_code', 'ASC']]
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving assets' });
  }
});

// Get stock view
router.get('/stock', async (req, res) => {
  try {
    const { Branch, Asset } = require('../models');
    
    // Get branches with asset counts and values
    const branches = await Branch.findAll({
      include: [{
        model: Asset,
        where: { status: 'stock' },
        required: false,
        attributes: []
      }],
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('Assets.id')), 'assetCount'],
        [sequelize.fn('SUM', sequelize.col('Assets.current_value')), 'totalValue']
      ],
      group: ['Branch.id']
    });
    
    // Calculate totals
    let totalAssets = 0;
    let totalValue = 0;
    branches.forEach(branch => {
      totalAssets += parseInt(branch.dataValues.assetCount) || 0;
      totalValue += parseFloat(branch.dataValues.totalValue) || 0;
    });
    
    res.render('assets/stock', { 
      title: 'Stock View', 
      branches,
      totalAssets,
      totalValue
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving stock data');
  }
});

// Get asset by ID (HTML view)
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [
        { model: AssetCategory, attributes: ['name'] },
        { model: Branch, attributes: ['name'] },
        { model: Employee, attributes: ['full_name'] }
      ]
    });
    if (asset) {
      res.render('assets/view', { title: 'View Asset', asset });
    } else {
      res.status(404).send('Asset not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving asset');
  }
});

// Get asset by ID (API endpoint)
router.get('/api/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [
        { model: AssetCategory, attributes: ['name'] },
        { model: Branch, attributes: ['name'] },
        { model: Employee, attributes: ['full_name'] }
      ]
    });
    if (asset) {
      res.json(asset);
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving asset' });
  }
});

// Get asset history
router.get('/:id/history', async (req, res) => {
  try {
    res.render('assets/history', { title: 'Asset History' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving asset history');
  }
});

// Show create asset form
router.get('/create', async (req, res) => {
  try {
    const categories = await AssetCategory.findAll({ order: [['name', 'ASC']] });
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    res.render('assets/create', { title: 'Add Asset', categories, branches });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Create new asset
router.post('/', async (req, res) => {
  try {
    await Asset.create(req.body);
    res.redirect('/assets');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating asset');
  }
});

// Show edit asset form
router.get('/:id/edit', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    const categories = await AssetCategory.findAll({ order: [['name', 'ASC']] });
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    if (asset) {
      res.render('assets/edit', { title: 'Edit Asset', asset, categories, branches });
    } else {
      res.status(404).send('Asset not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (asset) {
      await asset.update(req.body);
      res.json(asset); // Return updated asset data instead of redirect
    } else {
      res.status(404).json({ error: 'Asset not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating asset' });
  }
});

// Delete asset
router.post('/:id/delete', async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (asset) {
      await asset.destroy();
      res.redirect('/assets');
    } else {
      res.status(404).send('Asset not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting asset');
  }
});

module.exports = router;