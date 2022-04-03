const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Importing our routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin/OAuth/index');

// Load config variable
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// Session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

// Setting Pasport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function(req, res, next) {
    res.locals.admin = req.admin || null
    next();
})

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