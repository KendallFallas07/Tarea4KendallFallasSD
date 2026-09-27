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

        const authors = await sql`
            SELECT
                id,
                author,
                nationality,
                birth_year,
                fields
            FROM authors
            WHERE id = ${id}
        `;

        if (authors.length === 0) {

            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: "Author not found"
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(authors[0])
        };

    } catch (error) {

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};