const express = require('express');
const router = express.Router();
const { Branch } = require('../models');

// Get all branches (HTML view)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.findAll({
      order: [['name', 'ASC']]
    });
    res.render('branches/index', { title: 'Branch Master', branches });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving branches');
  }
});

// Get all branches (API endpoint)
router.get('/api', async (req, res) => {
  try {
    const branches = await Branch.findAll({
      order: [['name', 'ASC']]
    });
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving branches' });
  }
});

// Show create branch form
router.get('/create', (req, res) => {
  res.render('branches/create', { title: 'Add Branch' });
});

// Create new branch
router.post('/', async (req, res) => {
  try {
    await Branch.create(req.body);
    res.redirect('/branches');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating branch');
  }
});

// Show edit branch form
router.get('/:id/edit', async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (branch) {
      res.render('branches/edit', { title: 'Edit Branch', branch });
    } else {
      res.status(404).send('Branch not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Update branch
router.put('/:id', async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (branch) {
      await branch.update(req.body);
      res.json(branch); // Return updated branch data instead of redirect
    } else {
      res.status(404).json({ error: 'Branch not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating branch' });
  }
});

// Delete branch
router.post('/:id/delete', async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (branch) {
      await branch.destroy();
      res.redirect('/branches');
    } else {
      res.status(404).send('Branch not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting branch');
  }
});

module.exports = router;