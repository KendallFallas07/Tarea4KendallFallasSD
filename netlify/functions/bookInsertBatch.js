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

        const book = JSON.parse(event.body);

        await sql`
            INSERT INTO books (
                id,
                title,
                edition,
                copyright,
                language,
                pages,
                author_id,
                publisher_id
            )
            VALUES (
                ${book.id},
                ${book.title},
                ${book.edition},
                ${book.copyright},
                ${book.language},
                ${book.pages},
                ${book.author_id},
                ${book.publisher_id}
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