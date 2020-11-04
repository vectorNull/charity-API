const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

// Security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')

const app = express();
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// File uploading
app.use(fileupload());

// Saniitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// xss-clean
app.use(xss());

// rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,    // 10 mins
    max: 100
})

app.use(limiter);

// Prevent HTTP param pollution
app.use(hpp());

// Enable CORS
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const nonprofits = require('./routes/nonprofits');
const programs = require('./routes/programs');
const auth = require('./routes/auth');
const users = require('./routes/users');

// Mount Routers
app.use('/api/v1/nonprofits', nonprofits);
app.use('/api/v1/programs', programs);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// Mount error handler
app.use(errorHandler);

// @desc	mount logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const PORT = process.env.PORT | 5000;

app.listen(
    PORT,
    console.log(
        `
    Listening in ${process.env.NODE_ENV} on port ${PORT}
`.yellow.bold
    )
);
