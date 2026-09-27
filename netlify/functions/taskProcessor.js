"use strict";

const rabbitPromise = require('./rabbitMQ');

const routes = {
    book: {
        INSERT: ["bookInsertBatch", "POST"],
        UPDATE: ["bookUpdateBatch", "PUT"],
        DELETE: ["bookDeleteBatch", "DELETE"]
    },
    author: {
        INSERT: ["authorInsertBatch", "POST"],
        UPDATE: ["authorUpdateBatch", "PUT"],
        DELETE: ["authorDeleteBatch", "DELETE"]
    },
    publisher: {
        INSERT: ["publisherInsertBatch", "POST"],
        UPDATE: ["publisherUpdateBatch", "PUT"],
        DELETE: ["publisherDeleteBatch", "DELETE"]
    }
};

function batchUrl(request) {
    const route = routes[request.entity]?.[request.method];

    if (!route) {
        throw new Error(
            "Invalid RabbitMQ entity or method"
        );
    }

    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
        throw new Error("API_BASE_URL is required");
    }

    const suffix = request.method === "INSERT"
        ? route[0]
        : `${route[0]}/${request.id}`;

    return {
        method: route[1],
        url: `${baseUrl.replace(/\/?$/, "/")}${suffix}`
    };
}

async function dispatch(request) {
    const batch = batchUrl(request);
    const options = {
        method: batch.method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (request.method !== "DELETE") {
        options.body = JSON.stringify(request.body);
    }

    const response = await fetch(batch.url, options);

    if (!response.ok) {
        const detail = await response.text();

        throw new Error(
            `Batch ${response.status}: ${detail}`
        );
    }
}

module.exports = async (requestedEntity) => {
    const channel = await rabbitPromise();
    const processedByEntity = {
        book: 0,
        author: 0,
        publisher: 0
    };

    try {
        let message = await channel.get(
            "bookstore",
            { noAck: false }
        );

        while (message) {
            try {
                const request = JSON.parse(
                    message.content.toString()
                );

                await dispatch(request);
                channel.ack(message);
                processedByEntity[request.entity] += 1;
            } catch (error) {
                channel.nack(message, false, true);
                throw error;
            }

            message = await channel.get(
                "bookstore",
                { noAck: false }
            );
        }

        return {
            requestedEntity,
            processed:
                Object.values(processedByEntity)
                    .reduce((total, value) => total + value, 0),
            processedByEntity
        };
    } finally {
        await channel.closeAll();
    }
};
