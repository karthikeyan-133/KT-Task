// Script to initialize the database tables
const { sequelize, Branch, Employee, AssetCategory, Asset, AssetTransaction } = require('./models');

async function setupDatabase() {
  try {
    // Sync all models to the database
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully!');
    
    // Create some sample data
    console.log('Creating sample data...');
    
    // Create branches
    const branch1 = await Branch.create({
      name: 'Main Office',
      location: '123 Main St, City Center'
    });
    
    const branch2 = await Branch.create({
      name: 'Downtown Branch',
      location: '456 Downtown Ave, City Center'
    });
    
    console.log('Branches created');
    
    // Create asset categories
    const categories = await AssetCategory.bulkCreate([
      { name: 'Laptop', description: 'Portable computers' },
      { name: 'Desktop', description: 'Stationary computers' },
      { name: 'Mobile Phone', description: 'Smartphones and cell phones' },
      { name: 'Tablet', description: 'Tablet computers' },
      { name: 'Monitor', description: 'Computer displays' },
      { name: 'Printer', description: 'Printing devices' },
      { name: 'Server', description: 'Server equipment' }
    ]);
    
    console.log('Asset categories created');
    
    // Create employees
    const employees = await Employee.bulkCreate([
      {
        employee_code: 'EMP001',
        full_name: 'John Smith',
        email: 'john.smith@company.com',
        phone: '555-1234',
        designation: 'Software Engineer',
        department: 'IT',
        branch_id: branch1.id,
        is_active: true
      },
      {
        employee_code: 'EMP002',
        full_name: 'Jane Doe',
        email: 'jane.doe@company.com',
        phone: '555-5678',
        designation: 'HR Manager',
        department: 'Human Resources',
        branch_id: branch1.id,
        is_active: true
      },
      {
        employee_code: 'EMP003',
        full_name: 'Bob Johnson',
        email: 'bob.johnson@company.com',
        phone: '555-9012',
        designation: 'Sales Representative',
        department: 'Sales',
        branch_id: branch2.id,
        is_active: true
      }
    ]);
    
    console.log('Employees created');
    
    // Create assets
    const assets = await Asset.bulkCreate([
      {
        asset_code: 'LAP001',
        name: 'Dell XPS 15',
        category_id: categories[0].id,
        branch_id: branch1.id,
        purchase_date: new Date('2023-01-15'),
        purchase_value: 1200.00,
        current_value: 800.00,
        status: 'issued',
        issued_to: employees[0].id
      },
      {
        asset_code: 'LAP002',
        name: 'MacBook Pro 16',
        category_id: categories[0].id,
        branch_id: branch1.id,
        purchase_date: new Date('2023-02-20'),
        purchase_value: 2500.00,
        current_value: 1800.00,
        status: 'stock'
      },
      {
        asset_code: 'PHN001',
        name: 'iPhone 14 Pro',
        category_id: categories[2].id,
        branch_id: branch2.id,
        purchase_date: new Date('2023-03-10'),
        purchase_value: 999.00,
        current_value: 750.00,
        status: 'issued',
        issued_to: employees[2].id
      }
    ]);
    
    console.log('Assets created');
    
    // Create sample transactions
    const transactions = await AssetTransaction.bulkCreate([
      {
        asset_id: assets[0].id,
        employee_id: employees[0].id,
        branch_id: branch1.id,
        transaction_type: 'issue',
        notes: 'Initial issue to employee'
      },
      {
        asset_id: assets[2].id,
        employee_id: employees[2].id,
        branch_id: branch2.id,
        transaction_type: 'issue',
        notes: 'New phone for sales team'
      }
    ]);
    
    console.log('Sample transactions created');
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the setup
setupDatabase();