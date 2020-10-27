const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
// Routes
const nonprofits = require('./routes/nonprofits');

// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

// @desc	mount logger
if (process.env.NODE_ENV) {
	app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/nonprofits', nonprofits);

const PORT = process.env.PORT | 5000;

app.listen(
	PORT,
	console.log(`
    Listening in ${process.env.NODE_ENV} on port ${PORT}
`),
);
