const express = require('express');
const { getPricesBySymbols, getAllPrices, getPricesByPage } = require('../controllers/price.Controller');
const router = express.Router();

// Route to fetch specific cryptocurrencies by symbols
router.get('/symbols', getPricesBySymbols);

// Route to fetch all cryptocurrencies (default page 1)
router.get('/all', getAllPrices);

// Route to fetch cryptocurrencies with pagination
router.get('/page', getPricesByPage);

module.exports = router;