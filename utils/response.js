const createResponse = (success, statusCode, message, data = {}) => {
    return {
        success: success,
        statusCode: statusCode,
        message: message,
        data: data
    };
};

module.exports = createResponse;