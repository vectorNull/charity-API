const express = require('express');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

// CRUD routes for non-profits
app.get('/api/v1/nonprofits', (req, res) => {
	res.status(200).json({
		success: true,
		data: `Get all non-profits`
	})
})

app.get('/api/v1/nonprofits/:id', (req, res) => {
	res.status(200).json({
		success: true,
		data: `Get a single non-profit. Id: ${req.params.id}`
		})
})

app.post('/api/v1/nonprofits', (req, res) => {
	res.status(200).json({
		success: true,
		data: 'create a new non-profit'
	})
})

app.put('/api/v1/nonprofits/:id', (req, res) => {
	res.status(200).json({
		success: true,
		data: `Udpate a non-profit. Id: ${req.params.id}`
	})
})

app.delete('/api/v1/nonprofits/:id', (req, res) => {
	res.status(200).json({
		success: true,
		data: `Delete a non-profit. Id: ${req.params.id}`
	})
})


const PORT = process.env.PORT | 5000;
app.listen(
	PORT,
	console.log(`
    Listening in ${process.env.NODE_ENV} on port ${PORT}
`),
);
