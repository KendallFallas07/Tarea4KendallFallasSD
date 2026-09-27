"use strict";

const amqp = require('amqplib');

module.exports = async () => {

    const conn =
        await amqp.connect(process.env.CLOUDAMQP_URL);

    const channel =
        await conn.createConfirmChannel();

    await channel.checkQueue("bookstore");

    channel.closeAll = async () => {
        await channel.close();
        await conn.close();
    };

    return channel;
};
