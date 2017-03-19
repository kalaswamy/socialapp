const Util = require("./library/util");
const ChatUsers = require("./library/chatusers");

module.exports = {
    init(http){
        var io = require('socket.io')(http);
        let chatUsers = new ChatUsers();

        io.on('connection', function(socket){
            console.log('a user connected');

            socket.on('join', (params, callback) => {
                socket.join(params.room);
                chatUsers.removeUser(socket.id);
                chatUsers.addUser(socket.id, params.name, params.room, params.profileimg, params.location);
                io.to(params.room).emit('updateUserList', chatUsers.getUsers(params.room));
                socket.broadcast.to(params.room).emit('newMessage', Util.generateMessage('Admin', new Date(), `${params.name} has joined.`));
                socket.emit('newMessage', Util.generateMessage("Admin", new Date(), "Welcome to the chat room " + params.name));
            });

            socket.on('createMessage', (message, callback) => {
                io.to(message.room).emit('newMessage', Util.generateMessage(message.name, message.date, message.text));

                callback();
            });

            socket.on('updategeocordinate', (params, callback) => {
                chatUsers.updategeoCordinate(socket.id, params.location);
                io.to(params.room).emit('updateUserList', chatUsers.getUsers(params.room));
            });

            socket.on('disconnect', () => {
               var user = chatUsers.removeUser(socket.id);

               if (user) {
                   io.to(user.room).emit('updateUserList', chatUsers.getUsers(user.room));
                   io.to(user.room).emit('newMessage', Util.generateMessage('Admin', new Date(), `${user.name} has left.`));
                }
            });
        });
    }
}