const app = require('../../app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ServerController = require('../controller/ServerController');

const Friends = require('../../models/Friend');
const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const ConversationMessage = require('../../models/ConversationMessages');

const friends = new Friends("friends");
const conversation = new Conversation('conversation');
const message = new Message('message');
const conversation_messages = new ConversationMessage('conversation_messages');

module.exports = class userController extends ServerController {
    constructor(socket, io, user_data, connected_users) {
        super(socket, io, user_data, connected_users);
    }

    notifyFriendsOnDisconnect() {
        let self = this;
        friends.query('select * from friends where user_id =' + self.user_data.id, function (err, row, fields) {
            let friends = row;
            let response = new Map();
            for (let i = 0; i < friends.length; i++) {
                let curr_friend = friends[i];
                for (let ob in self.connected_users) {
                    let curr_connected_user = self.connected_users[ob];
                    if (parseInt(curr_connected_user.id) === parseInt(curr_friend.friend_id)) {
                        response[curr_connected_user.id] = curr_connected_user;
                        console.log("ONDISCONNECTED");
                        console.log(response);
                    }
                }
            }
            //console.log(response);
            for (let ob in response) {
                let user = {};
                user.user = self.user_data;
                let curr_re = response[ob];
                let socket_id = curr_re.socket_id;
                self.io.sockets.connected[socket_id].emit('on_disconnect_user', JSON.stringify(user));
            }


        });
    }


    notifyFriendsOnConnected() {
        let self = this;
        friends.query('select * from friends where user_id =' + self.user_data.id, function (err, row, fields) {
            let friends = row;
            let response = {};
            for (let i = 0; i < friends.length; i++) {
                let curr_friend = friends[i];
                for (let ob in self.connected_users) {
                    let curr_connected_user = self.connected_users[ob];
                    if (parseInt(curr_connected_user.id) === parseInt(curr_friend.friend_id)) {
                        response[curr_connected_user.id] = curr_connected_user;
                        console.log("ONCONNECTED");
                        console.log(response);
                    }
                }
            }
            //console.log(response);
            for (let ob in response) {
                let user = {};
                user.user = self.user_data;
                let curr_re = response[ob];
                let socket_id = curr_re.socket_id;
                self.io.sockets.connected[socket_id].emit('on_connected_user', JSON.stringify(user));
            }
        });
    }

    sendNewMessage(data) {
        let self = this;
        let response = {};
        // insert the message in database
        message.query("INSERT INTO message (content, sender_id) VALUES ('" + data.message + "' , '" + this.user_data.id + "');", function (err, row) {
            console.log("Message: ");
            console.log(row);
            if (err) {
                console.log(err.message);
            } else {
                let insertedId = row.insertId || 0;
                response.message = {
                    id: insertedId,
                    content: data.message,
                    sender_id: parseInt(self.user_data.id)
                };
                console.log(data);
                // insert the conversation_message...
                conversation_messages.query("INSERT INTO conversation_messages(message_id, conversation_id) VALUES ('" + insertedId + "', '" + data.conversation_id + "')", function (err1, row1, fields1) {
                    if (err1) {
                        console.log(err.message);
                    } else {
                        response.conversation_messages = {
                            id: insertedId,
                            message_id: insertedId,
                            conversation_id: data.conversation_id
                        };
                        conversation.query("select * from conversation, conversation_participants where conversation.id = conversation_participants.conversation_id and conversation.id = " + data.conversation_id + " " +
                            "AND conversation_participants.participant_id != " + self.user_data.id + " ", function (err, row, fields) {
                                data.sender_id = parseInt(self.user_data.id);
                                for (let i = 0; i < row.length; i++) {
                                    let participant_id = row[i].participant_id;
                                    for (let ob in self.connected_users) {
                                        let curr_conn_user = self.connected_users[ob];
                                        if (parseInt(curr_conn_user.id) === participant_id) {
                                            console.log("LEL");
                                            self.io.sockets.connected[curr_conn_user.socket_id].emit('new_message', JSON.stringify(response));
                                        }
                                    }
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    getOnlineFriends() {
        let self = this;
        friends.query('select * from friends where user_id =' + self.user_data.id, function (err, row, fields) {
            let friends = row;
            let response = {};
            for (let i = 0; i < friends.length; i++) {
                let curr_friend = friends[i];
                for (let ob in self.connected_users) {
                    let curr_connected_user = self.connected_users[ob];
                    if (parseInt(curr_connected_user.id) === parseInt(curr_friend.friend_id)) {
                        response[curr_connected_user.id] = curr_connected_user;
                        console.log("ONALLUSER");
                        console.log(response);
                    }
                }
            }
            self.socket.emit('online_friends', JSON.stringify(response));
        });
    }

    onConnect() {
        let self = this;
        self.connected_users[self.user_data.id] = self.user_data;
        console.log("User " + self.user_data.email + " just connected");
        self.getOnlineFriends();
        self.notifyFriendsOnConnected();
    }

    disconnect() {
        let self = this;
        self.socket.on('disconnect', function () {
            console.log("User " + self.user_data.email + " just disconnected");
            self.notifyFriendsOnDisconnect();
            delete self.connected_users[self.user_data.id];
        });
    }
};