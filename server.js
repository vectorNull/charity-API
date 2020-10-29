const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/database');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Routes
const nonprofits = require('./routes/nonprofits');
const app = express();
app.use(express.json());


// @desc	mount logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/v1/nonprofits', nonprofits);

const PORT = process.env.PORT | 5000;

app.listen(
	PORT,
	console.log(`
    Listening in ${process.env.NODE_ENV} on port ${PORT}
`.yellow.bold),
);
