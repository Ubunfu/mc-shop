const itemService = require('./itemService.js');
const walletService = require('./walletService.js');
const rconService = require('./rconService.js');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const RCON = require('rcon');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_RCON_PORT = process.env.SERVER_RCON_PORT;
const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS;
const rconClient = new RCON(SERVER_HOST, SERVER_RCON_PORT, SERVER_RCON_PASS);

async function buyItem(player, itemName, quantity) {
    let item;
    try {
        item = await itemService.getItem(docClient, itemName);
    } catch (err) {
        if (err.message == 'item not found') {
            throw err;
        } else {
            throw Error('error checking item validity');
        }
    }

    let wallet;
    try {
        wallet = await walletService.getWallet(player);
    } catch (err) {
        throw Error('error getting wallet');
    }

    const totalCost = (item.price * quantity);
    if (wallet.Balance < totalCost) {
        throw Error('insufficient funds');
    }

    try {
        await walletService.chargeWallet(player, totalCost);
    } catch (err) {
        throw Error('error charging wallet');
    }

    try {
        await rconService.giveItem(rconClient, player, item.itemId, quantity);
    } catch (err) {
        throw Error('error delivering item');
    }
}

exports.buyItem = buyItem;