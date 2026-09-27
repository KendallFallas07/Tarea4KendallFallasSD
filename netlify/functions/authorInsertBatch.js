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

        const author = JSON.parse(event.body);

        await sql`
            INSERT INTO authors (
                id,
                author,
                nationality,
                birth_year,
                fields
            )
            VALUES (
                ${author.id},
                ${author.author},
                ${author.nationality},
                ${author.birth_year},
                ${author.fields}
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