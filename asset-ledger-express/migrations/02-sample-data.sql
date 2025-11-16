-- Insert sample branches
INSERT INTO branches (id, name, location) VALUES
('11111111-1111-1111-1111-111111111111', 'Main Office', '123 Main St, City Center'),
('22222222-2222-2222-2222-222222222222', 'Downtown Branch', '456 Downtown Ave, City Center');

-- Insert sample asset categories
INSERT INTO asset_categories (id, name, description) VALUES
('33333333-3333-3333-3333-333333333333', 'Laptop', 'Portable computers'),
('44444444-4444-4444-4444-444444444444', 'Desktop', 'Stationary computers'),
('55555555-5555-5555-5555-555555555555', 'Mobile Phone', 'Smartphones and cell phones'),
('66666666-6666-6666-6666-666666666666', 'Tablet', 'Tablet computers'),
('77777777-7777-7777-7777-777777777777', 'Monitor', 'Computer displays'),
('88888888-8888-8888-8888-888888888888', 'Printer', 'Printing devices'),
('99999999-9999-9999-9999-999999999999', 'Server', 'Server equipment');

-- Insert sample employees
INSERT INTO employees (id, employee_code, full_name, email, phone, designation, department, branch_id, is_active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EMP001', 'John Smith', 'john.smith@company.com', '555-1234', 'Software Engineer', 'IT', '11111111-1111-1111-1111-111111111111', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'EMP002', 'Jane Doe', 'jane.doe@company.com', '555-5678', 'HR Manager', 'Human Resources', '11111111-1111-1111-1111-111111111111', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'EMP003', 'Bob Johnson', 'bob.johnson@company.com', '555-9012', 'Sales Representative', 'Sales', '22222222-2222-2222-2222-222222222222', true);

-- Insert sample assets
INSERT INTO assets (id, asset_code, name, category_id, branch_id, purchase_date, purchase_value, current_value, status, issued_to) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'LAP001', 'Dell XPS 15', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2023-01-15', 1200.00, 800.00, 'issued', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'LAP002', 'MacBook Pro 16', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2023-02-20', 2500.00, 1800.00, 'stock', NULL),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'PHN001', 'iPhone 14 Pro', '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '2023-03-10', 999.00, 750.00, 'issued', 'cccccccc-cccc-cccc-cccc-cccccccccccc');