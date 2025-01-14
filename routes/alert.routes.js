const express = require('express');
const { setPriceAlert } = require('../controllers/alert.Controller');
const router = express.Router();

// Route to set a new price alert
router.post('/', setPriceAlert);

module.exports = router;