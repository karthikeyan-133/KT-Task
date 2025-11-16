const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./config/database');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/employees', require('./routes/employees'));
app.use('/assets', require('./routes/assets'));
app.use('/categories', require('./routes/categories'));
app.use('/branches', require('./routes/branches'));
app.use('/transactions', require('./routes/transactions'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});