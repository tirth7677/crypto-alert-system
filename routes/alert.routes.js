const express = require('express');
const { setPriceAlert, getAllActiveAlerts, getAllCompletedAlerts, deleteAlert } = require('../controllers/alert.Controller');
const router = express.Router();

// Route to set a new price alert
router.post('/', setPriceAlert);

// Route to get all active alerts
router.get('/active', getAllActiveAlerts);

// Route to get all completed alerts
router.get('/completed', getAllCompletedAlerts);

// Route to delete an alert by ID
router.delete('/:id', deleteAlert);

module.exports = router;