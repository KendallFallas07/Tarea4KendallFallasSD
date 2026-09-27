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

        const publishers = await sql`
            SELECT
                id,
                publisher,
                country,
                founded,
                genre
            FROM publishers
            WHERE id = ${id}
        `;

        if (publishers.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: "Publisher not found"
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(publishers[0])
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
