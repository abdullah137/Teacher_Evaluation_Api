const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Importing our routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin/OAuth/index');
const adminLgeaRoutes = require('./routes/admin/lgea/index');
const adminSchoolRoutes = require('./routes/admin/school/index');
const adminInpectorRoutes = require('./routes/admin/inspector/index');
const adminStaffRoutes = require('./routes/admin/staff/index');
const adminTeacherRoutes = require('./routes/admin/teacher/index');
const adminEvaluationRoutes = require('./routes/admin/evaluation/index');

// Importing our routes
const inspectorRoutes = require('./routes/inspector/authentication/index')

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

// enabling cors restriction
var whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Setting the cors configurations
app.use(cors({

  origin: whitelist,
  methods: ["PATCH","PUT","GET","DELETE","POST", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization','Apptoken','Origin',
  'X-Requested-With','Accept','Access-Control-Allow-Credential'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  credentials: true
})

);

// Index Routes
app.use(indexRoutes);

// Admin Routes 
app.use('/admin', adminRoutes);
app.use('/admin/lgea', adminLgeaRoutes);
app.use('/admin/school', adminSchoolRoutes);
app.use('/admin/inspector', adminInpectorRoutes);
app.use('/admin/staff', adminStaffRoutes);
app.use('/admin/teacher', adminTeacherRoutes);
app.use('/admin/evaluation', adminEvaluationRoutes);

// Inspector Routes
app.use('/inspector', inspectorRoutes);

// 404 Error Handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    error: 'And Just Like That, You Completely Lost Your Way 😥',
  });
});

app.listen(PORT, () => console.log(`Server Up 📢  and Running 🏃 on Port ${PORT}`))