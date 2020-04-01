const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Obtem o nome do usuário e o url da Sala
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//participar da sala
socket.emit('joinRoom', {username, room});

//Obtem sala e usuários
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);

});

//mensagem do server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

//envio de mensagem
chatForm.addEventListener('submit', (emit) => {
    emit.preventDefault();

        //busca  mensagem de texto
    const msg = emit.target.elements.msg.value;

    //emite uma mensagem para o servidor
    socket.emit('chatMessage', msg);

    //limpa a entrada de mensagens
    emit.target.elements.msg.value = '';
    emit.target.elements.msg.focus();
});

//mensagem de saída para o DOM
function outputMessage(message){

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//Adiciona o nome da sala no DOM
function outputRoomName(room){
    roomName.innerText = room;

}

//adiciona usuarios no DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}