const itemService = require('./itemService.js');
const walletService = require('./walletService.js');
const rconService = require('./rconService.js');
const rconSellService = require('./rconSellService.js');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const RCON = require('rcon');
const { log } = require('../util/logger.js');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_RCON_PORT = process.env.SERVER_RCON_PORT;
const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS;
const RCON_ASYNC_SLEEP_MS = process.env.RCON_ASYNC_SLEEP_MS;
const rconClient = new RCON(SERVER_HOST, SERVER_RCON_PORT, SERVER_RCON_PASS);

async function buyItem(player, itemName, quantity) {
    let item;
    try {
        item = await itemService.getItem(docClient, itemName);
    } catch (err) {
        if (err.message == 'item not found') {
            log('[shopService] item not found');
            throw err;
        } else {
            log('[shopService] error checking item validity: ' + err.message);
            throw Error('error checking item validity');
        }
    }

    let wallet;
    try {
        wallet = await walletService.getWallet(player);
    } catch (err) {
        log('[shopService] error getting wallet: ' + err.message);
        throw Error('error getting wallet');
    }

    const totalCost = (item.price * quantity);
    if (wallet.Balance < totalCost) {
        log('[shopService] insufficient funds');
        throw Error('insufficient funds');
    }

    try {
        await walletService.chargeWallet(player, totalCost);
    } catch (err) {
        log('[shopService] error charging wallet: ' + err.message);
        throw Error(err.message);
    }

    try {
        await rconService.giveItem(rconClient, player, item.itemId, quantity);
    } catch (err) {
        log('[shopService] error delivering item: ' + err.message);
        throw Error('error delivering item');
    }
}

async function sellItem(player, itemName, quantity) {

    if (quantity < 1) {
        log(`[shopService] Invalid quantity of items to sell: ${quantity}`);
        throw Error('quantity must be positive');
    }    
    let item;
    try {
        item = await itemService.getItem(docClient, itemName);
    } catch (err) {
        if (err.message == 'item not found') {
            log('[shopService] item not found');
            throw err;
        } else {
            log('[shopService] error checking item validity: ' + err.message);
            throw Error('error checking item validity');
        }
    }
    if (item.sellPrice == undefined) {
        log('[shopService] item not sellable');
        throw Error('item not sellable');
    }

    try {
        await rconSellService.processSell(player, itemName, item.itemId, quantity);
        await sleep(RCON_ASYNC_SLEEP_MS); // allow the async RCON process time to finish or things will screw up
    } catch (err) {
        log('[shopService] error processing item sell: ' + err.message);
        throw Error('error processing item sell');
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

exports.buyItem = buyItem;
exports.sellItem = sellItem;