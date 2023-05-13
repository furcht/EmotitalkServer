const server = require('http').createServer();
const io = require('socket.io')(server);
const st = require('string-therapy');
const flags = require('./assets/flags.json');
const emojis = require('./assets/emojis.json');

let maxPerRoom = 25;
let clientCount = 0;
let chatLog = {};
let currentRoom;

const addClient = client => {
    console.log("-- CONNECTION --");
    console.log("Client ID:", client);

    //- Estabish Room
    if(!(clientCount % maxPerRoom)) {
        currentRoom = flags[Math.floor(Math.random() * (flags.length - 0) + 0)];
        currentRoom.id = st(currentRoom.name).toSnakeCase;
        chatLog[currentRoom.id] = {
            "ids": [],
            "users": {},
            "messages": []
        };
    }

    clientCount++;
    console.log("Clients Connected:", clientCount); 

    //- Establish User
    let randomUserID = emojis[Math.floor(Math.random() * (emojis.length - 0) + 0)];
    console.log("User:", randomUserID);
    
    return {"loaded": true}
};
const removeClient = client => {
    console.log("\n\n-- DISCONNECTION --");
    console.log("Client ID:", client);
    clientCount--;
    console.log("Clients Connected:", clientCount);
};

io.on('connection', client => {
    console.log("Client", client.id, "has connected");
    let newClient = addClient(client.id);
    console.log(newClient);
    client.emit("initialized", newClient);
    client.on('disconnect', () => {
        removeClient(client.id);
    });
});

// simulate connection
let output = addClient(1);
console.log(output);

// simulate disconnect
setTimeout(() => {
    removeClient(1);
}, 2000);


server.listen(3000);
