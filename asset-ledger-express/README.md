# Asset Ledger Express Application

This is a Node.js/Express application for managing company assets and employees with PostgreSQL database.

## Features

1. Employee Master - Add/Edit/View all employees with active/inactive filters
2. Asset Master - Add/Edit/View all assets with asset type filters
3. Asset Category Master - Manage hardware types (Laptop, Mobile Phone, etc.)
4. Stock View - Bird's eye view of assets in stock by branch
5. Issue Asset - Issue assets to employees
6. Return Asset - Return assets from employees with reason capture
7. Scrap Asset - Mark assets as obsolete
8. Asset History - View complete history of an asset

## Tech Stack

- Node.js with Express.js
- PostgreSQL database
- Sequelize ORM
- Pug (Jade) for HTML templating
- Bootstrap 5 for styling
- DataTables.net for data tables
- jQuery

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Update the `.env` file with your database credentials
   - Run the setup script to create tables and sample data:
     ```bash
     npm run setup-db
     ```
   - Alternatively, you can use the SQL migrations in the `migrations/` directory to set up the database manually

4. Run the application:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_ledger
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

## Project Structure

```
asset-ledger-express/
├── config/          # Database configuration
├── models/          # Sequelize models
├── public/          # Static assets (CSS, JS, images)
├── routes/          # Express routes
├── views/           # Pug templates
├── .env             # Environment variables
├── server.js        # Main application file
└── package.json     # Project dependencies
```

## Running the Application

To start the development server:
```bash
npm run dev
```

To start the production server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Database Schema

The application uses the following tables:
- branches
- employees
- asset_categories
- assets
- asset_transactions

Refer to the models in the `models/` directory for detailed schema information.