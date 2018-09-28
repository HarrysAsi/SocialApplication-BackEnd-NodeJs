const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.port || 4500;


const Friends = require('./models/Friend');
const friends = new Friends("friends");

//Server Controller
const usersController = require('./server/controller/UserController');


var connected_users = new Map();

io.on('connection', function (socket) {
    let user_data = socket.handshake.query;
    user_data.socket_id = socket.id;
    console.log(user_data);
    const userController = new usersController(socket, io, user_data, connected_users);
    let current_user = new Map();
    current_user[user_data.id] = user_data;
    //Connect, save the user in memory
    userController.onConnect();

    //Get the online friends for each user
    socket.on('online_friends', function () {
        userController.getOnlineFriends();
    });

    socket.on('new_message', function (data) {
        userController.sendNewMessage(data);
    });

    //In case user disconnects, it removes him from the memory
    userController.disconnect();

})
;

http.listen(port, function () {
    console.log('listening on *:' + port);
});