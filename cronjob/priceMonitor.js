const cron = require('node-cron');
const axios = require('axios');
const Alert = require('../models/alert');
const sendEmail = require('../utils/email');

const checkAlerts = async () => {
    try {
        const alerts = await Alert.find({ alreadyInformed: false }); // Only check active alerts

        if (alerts.length === 0) {
            console.log('No active alerts to process');
            return;
        }

        // Fetch current prices for all unique symbols in alerts
        const symbols = [...new Set(alerts.map(alert => alert.symbol))];
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd`;
        const response = await axios.get(apiUrl);
        const prices = response.data;

        // Check each alert condition
        for (const alert of alerts) {
            const currentPrice = prices[alert.symbol].usd;

            if (
                (alert.condition === 'above' && currentPrice > alert.price) ||
                (alert.condition === 'below' && currentPrice < alert.price)
            ) {
                // Send email notification
                const subject = 'Price Alert Triggered';
                const html = `
                    <h3>Your price alert has been triggered!</h3>
                    <p><strong>Symbol:</strong> ${alert.symbol}</p>
                    <p><strong>Condition:</strong> ${alert.condition}</p>
                    <p><strong>Alert Price:</strong> $${alert.price}</p>
                    <p><strong>Current Price:</strong> $${currentPrice}</p>
                `;

                await sendEmail(alert.userEmail, subject, html);
                console.log(`Alert triggered and email sent to ${alert.userEmail}`);

                // Update the alert's status to already informed
                alert.alreadyInformed = true;
                await alert.save();
            }
        }
    } catch (error) {
        console.error('Error in checking alerts:', error.message);
    }
};

// Schedule the task to run every 1 minute
cron.schedule('*/1 * * * *', checkAlerts);