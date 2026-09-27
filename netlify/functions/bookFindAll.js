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

        const books = await sql`
            SELECT
                b.id,
                b.title,
                b.edition,
                b.copyright,
                b.language,
                b.pages,
                b.author_id,
                b.publisher_id,
                a.author,
                p.publisher
            FROM books b
            LEFT JOIN authors a
                ON b.author_id = a.id
            LEFT JOIN publishers p
                ON b.publisher_id = p.id
            ORDER BY b.id
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(books)
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