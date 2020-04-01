const users = [];

//usuário entrou no chat
function userJoin(id, username, room) {
    const user = {id, username, room };

    users.push(user);

    return user;

}

//obtém usuário atual
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//usuário deixou o chat

function userLeave(id) {
        const index = users.findIndex(user => user.id === id);
        if(index !==-1){
            return users.splice(index, 1)[0];
        }
}

//obtem sala de usuários
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};