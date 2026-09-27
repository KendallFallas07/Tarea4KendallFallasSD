"use strict";

const sql = require('./database');
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

        const publishers = await sql`
            SELECT
                id,
                publisher,
                country,
                founded,
                genre
            FROM publishers
            ORDER BY id
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(publishers)
        };

    } catch (error) {

        console.error(error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
