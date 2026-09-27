"use strict";

const processTasks = require('./taskProcessor');
const headers = require('./headersCORS');

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "OK"
        };
    }

    try {
        const result = await processTasks("publisher");

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 422,
            headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
