const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define models
const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'branches',
  timestamps: true,
  underscored: true
});

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employee_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  designation: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'employees',
  timestamps: true,
  underscored: true
});

const AssetCategory = sequelize.define('AssetCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'asset_categories',
  timestamps: true,
  underscored: true
});

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  asset_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purchase_date: {
    type: DataTypes.DATE
  },
  purchase_value: {
    type: DataTypes.DECIMAL(15, 2)
  },
  current_value: {
    type: DataTypes.DECIMAL(15, 2)
  },
  status: {
    type: DataTypes.ENUM('stock', 'issued', 'scrapped'),
    defaultValue: 'stock'
  },
  specifications: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'assets',
  timestamps: true,
  underscored: true
});

const AssetTransaction = sequelize.define('AssetTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transaction_type: {
    type: DataTypes.ENUM('issue', 'return', 'scrap'),
    allowNull: false
  },
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'asset_transactions',
  timestamps: true,
  underscored: true
});

// Define associations
Employee.belongsTo(Branch, { foreignKey: 'branch_id' });
Branch.hasMany(Employee, { foreignKey: 'branch_id' });

Asset.belongsTo(AssetCategory, { foreignKey: 'category_id' });
AssetCategory.hasMany(Asset, { foreignKey: 'category_id' });

Asset.belongsTo(Branch, { foreignKey: 'branch_id' });
Branch.hasMany(Asset, { foreignKey: 'branch_id' });

Asset.belongsTo(Employee, { foreignKey: 'issued_to' });
Employee.hasMany(Asset, { foreignKey: 'issued_to' });

AssetTransaction.belongsTo(Asset, { foreignKey: 'asset_id' });
Asset.hasMany(AssetTransaction, { foreignKey: 'asset_id' });

AssetTransaction.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(AssetTransaction, { foreignKey: 'employee_id' });

AssetTransaction.belongsTo(Branch, { foreignKey: 'branch_id' });
Branch.hasMany(AssetTransaction, { foreignKey: 'branch_id' });

module.exports = {
  sequelize,
  Branch,
  Employee,
  AssetCategory,
  Asset,
  AssetTransaction
};