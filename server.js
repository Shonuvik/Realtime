
const path = require('path');
const http = require('http');
const express = require("express");
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

//definir pasta estática
app.use(express.static(path.join(__dirname, 'public')));

const usersName = 'Chat Bot Marlon';

//executa quando o cliente se conecta
io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);


        socket.join(user.room);

    

    //bem vindo novo usuário
    socket.emit('message', formatMessage(usersName, 'Bem Vindo ao Chat Bot Medical! Como posso te ajudar ? '));
    

    //da um broadcast quando um usuário se conecta
    socket.broadcast.to(user.room).emit('message', formatMessage(usersName, `${user.username} beggint in chat`));


    //escuta a mensagem
    socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));

        //envia informações dos usuários e da sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
    });

    //executa quando um cliente desconecta
    socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user){

        io.to(user.room).emit('message', formatMessage(usersName, `${user.username} ausgang aus chat`));
        
        //envia informações dos usuários e da sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    }

    });
    
});
const PORT = 8085 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));