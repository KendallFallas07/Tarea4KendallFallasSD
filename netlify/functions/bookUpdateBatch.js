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

        const book = JSON.parse(event.body);

        await sql`
            UPDATE books
            SET
                title = ${book.title},
                edition = ${book.edition},
                copyright = ${book.copyright},
                language = ${book.language},
                pages = ${book.pages},
                author_id = ${book.author_id},
                publisher_id = ${book.publisher_id}
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