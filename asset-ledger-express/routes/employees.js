const express = require('express');
const router = express.Router();
const { Employee, Branch } = require('../models');

// Get all employees (HTML view)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: Branch, attributes: ['name'] }],
      order: [['full_name', 'ASC']]
    });
    res.render('employees/index', { title: 'Employee Master', employees });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving employees');
  }
});

// Get all employees (API endpoint)
router.get('/api', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: Branch, attributes: ['name'] }],
      order: [['full_name', 'ASC']]
    });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving employees' });
  }
});

// Get employee by ID (HTML view)
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{ model: Branch, attributes: ['name'] }]
    });
    if (employee) {
      res.render('employees/view', { title: 'View Employee', employee });
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving employee');
  }
});

// Get employee by ID (API endpoint)
router.get('/api/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{ model: Branch, attributes: ['name'] }]
    });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving employee' });
  }
});

// Show create employee form
router.get('/create', async (req, res) => {
  try {
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    res.render('employees/create', { title: 'Add Employee', branches });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Create new employee
router.post('/', async (req, res) => {
  try {
    await Employee.create(req.body);
    res.redirect('/employees');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating employee');
  }
});

// Show edit employee form
router.get('/:id/edit', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    const branches = await Branch.findAll({ order: [['name', 'ASC']] });
    if (employee) {
      res.render('employees/edit', { title: 'Edit Employee', employee, branches });
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading form');
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      await employee.update(req.body);
      res.json(employee); // Return updated employee data instead of redirect
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating employee' });
  }
});

// Delete employee
router.post('/:id/delete', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (employee) {
      await employee.destroy();
      res.redirect('/employees');
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting employee');
  }
});

module.exports = router;