const express = require('express');
const router = express.Router();
const { AssetCategory } = require('../models');

// Get all categories (HTML view)
router.get('/', async (req, res) => {
  try {
    const categories = await AssetCategory.findAll({
      order: [['name', 'ASC']]
    });
    res.render('categories/index', { title: 'Asset Category Master', categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving categories');
  }
});

// Get all categories (API endpoint)
router.get('/api', async (req, res) => {
  try {
    const categories = await AssetCategory.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving categories' });
  }
});

// Show create category form
router.get('/create', (req, res) => {
  res.render('categories/create', { title: 'Add Category' });
});

// Create new category
router.post('/', async (req, res) => {
  try {
    await AssetCategory.create(req.body);
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating category');
  }
});

// Show edit category form
router.get('/:id/edit', async (req, res) => {
  try {
    const category = await AssetCategory.findByPk(req.params.id);
    if (category) {
      res.render('categories/edit', { title: 'Edit Category', category });
    } else {
      res.status(404).send('Category not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const category = await AssetCategory.findByPk(req.params.id);
    if (category) {
      await category.update(req.body);
      res.json(category); // Return updated category data instead of redirect
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating category' });
  }
});

// Delete category
router.post('/:id/delete', async (req, res) => {
  try {
    const category = await AssetCategory.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.redirect('/categories');
    } else {
      res.status(404).send('Category not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting category');
  }
});

module.exports = router;