"use strict";

const headers = require('./headersCORS');
const rabbitPromise = require('./rabbitMQ');

exports.handler = async (event) => {

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "OK"
        };
    }

    try {

        const channel =
            await rabbitPromise();

        const request =
            JSON.stringify({
                entity: "book",
                method: "INSERT",
                body: JSON.parse(event.body)
            });

        await channel.sendToQueue(
            "bookstore",
            Buffer.from(request),
            { persistent: true }
        );

        await channel.waitForConfirms();
        await channel.closeAll();

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
