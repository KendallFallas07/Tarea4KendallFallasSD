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
            WHERE b.id = ${id}
        `;

        if (books.length === 0) {

            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: "Book not found"
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(books[0])
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