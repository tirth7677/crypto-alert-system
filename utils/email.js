const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Use your Brevo API key

const sendEmail = async (to, subject, html) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
        sender: { name: 'Crypto Alert System', email: process.env.EMAIL_USER },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error in sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
