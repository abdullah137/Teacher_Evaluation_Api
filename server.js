const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');

const app = express();

// Importing our routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin/OAuth/index');
const adminLgeaRoutes = require('./routes/admin/lgea/index');
const adminSchoolRoutes = require('./routes/admin/school/index');
const adminInpectorRoutes = require('./routes/admin/inspector/index');
const adminStaffRoutes = require('./routes/admin/staff/index');
const adminTeacherRoutes = require('./routes/admin/teacher/index');

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
app.use('/uploads/lgea', express.static(path.join(__dirname, 'uploads/')));
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000

// Router Middleware
app.use(indexRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/lgea', adminLgeaRoutes);
app.use('/admin/school', adminSchoolRoutes);
app.use('/admin/inspector', adminInpectorRoutes);
app.use('/admin/staff', adminStaffRoutes);
app.use('/admin/teacher', adminTeacherRoutes);

app.listen(PORT, () => console.log(`Server Up 📢  and Running 🏃 on Port ${PORT}`))