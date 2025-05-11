const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const setupChatSocket = require('./chatSocket');
const setupOrderSocket = require('./orderSocket');

module.exports = function initializeSocket(server) {
    const origin = `${process.env.CLIENT_ORIGIN}:${process.env.CLIENT_PORT}`;

    const io = new Server(server, {
        cors: {
            origin,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    setupChatSocket(io);
    setupOrderSocket(io);

    return io;
};
