-- Create branches table
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  designation VARCHAR(255),
  department VARCHAR(255),
  branch_id UUID REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create asset_categories table
CREATE TABLE asset_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL REFERENCES asset_categories(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  purchase_date DATE,
  purchase_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  status VARCHAR(20) DEFAULT 'stock' CHECK (status IN ('stock', 'issued', 'scrapped')),
  issued_to UUID REFERENCES employees(id),
  issued_at TIMESTAMP,
  specifications JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create asset_transactions table
CREATE TABLE asset_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id),
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('issue', 'return', 'scrap')),
  employee_id UUID REFERENCES employees(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_employees_branch ON employees(branch_id);
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_assets_branch ON assets(branch_id);
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_code ON assets(asset_code);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_transactions_asset ON asset_transactions(asset_id);
CREATE INDEX idx_transactions_date ON asset_transactions(transaction_date);