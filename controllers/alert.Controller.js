const Alert = require('../models/alert');
const createResponse = require('../utils/response');
const sendEmail = require('../utils/email'); // Import the email function

// Set a new price alert
const setPriceAlert = async (req, res) => {
    try {
        const { symbol, price, condition, userEmail } = req.body;

        // Validate request data
        if (!symbol || !price || !condition || !userEmail) {
            return res.status(400).json(createResponse(false, 400, 'All fields are required'));
        }

        if (!['above', 'below'].includes(condition)) {
            return res.status(400).json(createResponse(false, 400, 'Condition must be either "above" or "below"'));
        }

        if (price <= 0) {
            return res.status(400).json(createResponse(false, 400, 'Price must be a positive number'));
        }

        // Check for duplicate alert
        const existingAlert = await Alert.findOne({ symbol, price, condition, userEmail });
        if (existingAlert) {
            return res.status(409).json(createResponse(false, 409, 'Duplicate alert: An alert with the same details already exists'));
        }

        // Create a new alert
        const alert = new Alert({ symbol, price, condition, userEmail });
        await alert.save();

        // Send confirmation email
        const subject = 'Price Alert Set Successfully';
        const html = `
            <h3>Your price alert has been set successfully!</h3>
            <p><strong>Symbol:</strong> ${symbol}</p>
            <p><strong>Condition:</strong> ${condition}</p>
            <p><strong>Price:</strong> $${price}</p>
            <p>We will notify you when the price meets your condition.</p>
        `;

        await sendEmail(userEmail, subject, html);

        res.status(201).json(createResponse(true, 201, 'Price alert set successfully and confirmation email sent', alert));
    } catch (error) {
        console.error('Error setting price alert:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to set price alert', { error: error.message }));
    }
};

// Get all active alerts (alreadyInformed = false)
const getAllActiveAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ alreadyInformed: false });
        const totalAlerts = alerts.length;

        res.status(200).json(createResponse(true, 200, 'Active alerts fetched successfully', { total: totalAlerts, alerts }));
    } catch (error) {
        console.error('Error fetching active alerts:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to fetch active alerts', { error: error.message }));
    }
};

// Get all completed alerts (alreadyInformed = true)
const getAllCompletedAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ alreadyInformed: true });
        const totalAlerts = alerts.length;

        res.status(200).json(createResponse(true, 200, 'Completed alerts fetched successfully', { total: totalAlerts, alerts }));
    } catch (error) {
        console.error('Error fetching completed alerts:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to fetch completed alerts', { error: error.message }));
    }
};

// Delete an alert by ID
const deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;

        const alert = await Alert.findByIdAndDelete(id);

        if (!alert) {
            return res.status(404).json(createResponse(false, 404, 'Alert not found'));
        }

        res.status(200).json(createResponse(true, 200, 'Alert deleted successfully', alert));
    } catch (error) {
        console.error('Error deleting alert:', error.message);
        res.status(500).json(createResponse(false, 500, 'Failed to delete alert', { error: error.message }));
    }
};

module.exports = { setPriceAlert, getAllActiveAlerts, deleteAlert,getAllCompletedAlerts };