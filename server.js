const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

// Load config variable
dotenv.config({ path: './config/config.env' });


app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))