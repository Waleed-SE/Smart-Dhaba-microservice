const ChatMessage = require('../models/ChatMessage');
const { Server } = require('socket.io');

module.exports = function setupChatSocket(io) {
    const chatNamespace = io.of('/chat');

    chatNamespace.on('connection', (socket) => {
        console.log(`💬 User connected to /chat: ${socket.id}`);

        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`User joined group ${groupId}`);
        });

        socket.on('sendMessage', async ({ groupId, senderId, message }) => {
            const newMessage = new ChatMessage({ groupId, senderId, message });
            await newMessage.save();

            // Broadcast to group room
            chatNamespace.to(groupId).emit('receiveMessage', {
                _id: newMessage._id,
                groupId,
                senderId,
                message,
                sentAt: newMessage.sentAt
            });
        });

        socket.on('disconnect', () => {
            console.log('💬 User disconnected from chat');
        });
    });
};
