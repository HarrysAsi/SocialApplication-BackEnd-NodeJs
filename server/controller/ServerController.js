const app = require('../../app');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Friends = require('../../models/Friend');
const friends = new Friends("friends");


module.exports = class ServerController {
    constructor(socket, io, user_data, connected_users) {
        this.socket = socket;
        this.io = io;
        this.user_data = user_data;
        this.connected_users = connected_users;
        console.log("Server Controller initialized...");
        this.emitEvents();
    }

    //Override method
    emitEvents() { }

};