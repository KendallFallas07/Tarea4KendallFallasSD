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

        const publisher = JSON.parse(event.body);

        await sql`
            INSERT INTO publishers (
                id,
                publisher,
                country,
                founded,
                genre
            )
            VALUES (
                ${publisher.id},
                ${publisher.publisher},
                ${publisher.country},
                ${publisher.founded},
                ${publisher.genre}
            )
        `;

        return {
            statusCode: 200,
            headers,
            body: "OK"
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
