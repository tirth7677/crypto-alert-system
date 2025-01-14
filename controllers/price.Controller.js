const axios = require('axios');
const createResponse = require('../utils/response');

// Fetch specific cryptocurrencies by symbols
const getPricesBySymbols = async (req, res) => {
    try {
        const { symbols } = req.query;

        if (!symbols) {
            return res.status(400).json(createResponse(false, 400, 'Symbols query parameter is required'));
        }

        const requestedSymbols = symbols.split(',');
        const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${requestedSymbols.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
        const response = await axios.get(apiUrl);

        res.status(200).json(createResponse(true, 200, 'Prices fetched successfully', response.data));
    } catch (error) {
        console.error('Error fetching cryptocurrency data by symbols:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to fetch cryptocurrency data by symbols', { error: error.message }));
    }
};

// Fetch all cryptocurrencies (default page 1)
const getAllPrices = async (req, res) => {
    try {
        const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
        const response = await axios.get(apiUrl);

        res.status(200).json(createResponse(true, 200, 'Prices fetched successfully (default page 1)', response.data));
    } catch (error) {
        console.error('Error fetching all cryptocurrency data:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to fetch all cryptocurrency data', { error: error.message }));
    }
};

// Fetch cryptocurrencies with pagination
const getPricesByPage = async (req, res) => {
    try {
        const { page = 1 } = req.query;

        const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`;
        const response = await axios.get(apiUrl);

        res.status(200).json(createResponse(true, 200, `Prices fetched successfully (page ${page})`, response.data));
    } catch (error) {
        console.error('Error fetching cryptocurrency data by page:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to fetch cryptocurrency data by page', { error: error.message }));
    }
};

module.exports = { getPricesBySymbols, getAllPrices, getPricesByPage };