const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv')

// load env vars
dotenv.config({ path: './config/config.env'})

// locad models
const Nonprofit = require('./models/Nonprofit');
const asyncHandler = require('./middleware/async');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// Read JSON files
const nonprofits = JSON.parse(fs.readFileSync(`${__dirname}/_data/nonprofits.json`, 'utf-8'))

// Import data into DB
const importData = async () => {
    try {
        await Nonprofit.create(nonprofits)
        console.log('Data imported...'.green.inverse)
        process.exit();
    } catch (err) {
        console.error(err);
    }
}
// Delete data
const deleteData = async () => {
        try {
            await Nonprofit.deleteMany()
            console.log('Data destroyed...'.red.inverse)
            process.exit();
        } catch (err) {
            console.error(err);
        }
}

if(process.argv[2] === '-i'){
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}