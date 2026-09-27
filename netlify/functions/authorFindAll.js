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

        const authors = await sql`
            SELECT
                id,
                author,
                nationality,
                birth_year,
                fields
            FROM authors
            ORDER BY id
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(authors)
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