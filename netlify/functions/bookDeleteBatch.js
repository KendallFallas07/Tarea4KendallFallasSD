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

        const id = parseInt(
            event.path.split("/").reverse()[0]
        );

        await sql`
            DELETE FROM books
            WHERE id = ${id}
        `;

        return {
            statusCode: 200,
            headers,
            body: "OK"
        };

    } catch (error) {

        return {
            statusCode: 422,
            headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};