const mineflayer = require('mineflayer');
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS chatlogs (player_name TEXT, message TEXT, timestamp DATETIME)`);

const theBot = () => {
    
    let bot = mineflayer.createBot({
        host: 'server-ip-here',
        username: 'Bot',
        version: 'version'
    });
    
    
    bot.on('login', () => {
        let botSocket = bot._client.socket;
        console.log(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
    });


    bot.on('end', (reason) => {
        let botSocket = bot._client.socket;
        console.log(`[${bot.username}] Disconnected from ${botSocket.server ? botSocket.server : botSocket._host} reason: ${reason}`);

        setTimeout(theBot, 5000);
    });
    
    
    bot.on('chat', async (username, message) => {
        console.log(`<${username}> ${message}`);
        
        const currentDate = new Date().toLocaleString();
        db.run(`INSERT INTO chatlogs (player_name, message, timestamp) VALUES (?, ?, ?)`, [username, message, currentDate], function (err) {
            if (err) {
                console.error(err.message);
            }
        });
    });
    
    
    bot.on('kicked', (reason) => {
        let botSocket = bot._client.socket;
        console.log(`[${bot.username}] Kicked from ${botSocket.server ? botSocket.server : botSocket._host} reason: ${reason}`);
    });
    
    
    bot.on('spawn', async () => {
        console.log(`Spawned`);
    });
    

    bot.on('death', () => {
        console.log(`Died`);
    });
    
    
    bot.on('error', (err) => {
        console.log(err);
    });
};

theBot();
