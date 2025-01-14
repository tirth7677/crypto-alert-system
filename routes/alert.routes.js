const express = require('express');
const { setPriceAlert, getAllActiveAlerts, deleteAlert } = require('../controllers/alert.Controller');
const router = express.Router();

// Route to set a new price alert
router.post('/', setPriceAlert);

// Route to get all active alerts
router.get('/', getAllActiveAlerts);

// Route to delete an alert by ID
router.delete('/:id', deleteAlert);

module.exports = router;