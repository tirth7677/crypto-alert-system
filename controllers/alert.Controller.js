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

module.exports = { setPriceAlert };