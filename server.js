const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

// Importing our routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin/OAuth/index');

// Load config variable
dotenv.config({ path: './config/config.env' });

// Connecting to the dabase
const connectDB = require('./database/db');

// Calling our connection here
connectDB();

// Body-Parser
app.use(express.json());

const PORT = process.env.PORT || 5000

// Router Middleware
app.use(indexRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => console.log(`Server Up 📢  and Running 🏃 on Port ${PORT}`))