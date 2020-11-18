const itemService = require('../service/itemService.js');
const walletService = require('../service/walletService.js');
const axios = require('axios');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const { log } = require('./logger.js');

const SPACE = ' ';

async function processClearResponse(resp, itemName) {
    if (resp.includes('Removed')) {
        await processRemovedItems(resp, itemName);
    } else if (resp.includes('No items were found on player'))  {
        await processNoItemsFound(resp, itemName);
    } else if (resp.includes('No player was found')) {
        await processNoPlayerFound();
    } else {
        await postUnknownResponseToWebhook(resp);
    }
}

async function processRemovedItems(resp, itemName) {
    let item;
    try {
        item = await itemService.getItem(docClient, itemName);
    } catch (err) {
        log('[rconClearResponseProcessor] Error getting item: ' + err.message);
        throw Error('Error getting item from DB');
    }

    let words, playerName, itemQuantity, totalPrice;
    try {
        words = resp.split(SPACE);
        playerName = words[5];
        itemQuantity = words[1];
        totalPrice = item.sellPrice * itemQuantity;
    } catch (err) {
        log('[rconClearResponseProcessor] Error parsing RCON response: ' + err.message);
        throw Error('Error parsing RCON response')
    }

    try {
        await walletService.payWallet(playerName, totalPrice);
    } catch (err) {
        log('[rconClearResponseProcessor] Error paying wallet: ' + err.message);
        throw Error('Error paying wallet');
    }
    
    try {
        await postSaleToWebhook(playerName, itemName, itemQuantity, totalPrice);
    } catch (err) {
        log('[rconClearResponseProcessor] Error posting to Discord: ' + err.message);
        throw Error('Error posting notification to Discord');
    }
}

async function processNoItemsFound(resp, itemName) {
    let words, playerName;
    try {
        words = resp.split(SPACE);
        playerName = words[6];
    } catch (err) {
        log('[rconClearResponseProcessor] Error parsing RCON response: ' + err.message);
        throw Error('Error parsing RCON response')
    }

    try {
        await postNoItemsFoundToWebhook(itemName, playerName);
    } catch (err) {
        log('[rconClearResponseProcessor] Error posting to Discord: ' + err.message);
        throw Error('Error posting notification to Discord');
    }
}

async function processNoPlayerFound() {
    try {
        await postNoPlayerFoundToWebhook();
    } catch (err) {
        log('[rconClearResponseProcessor] Error posting to Discord: ' + err.message);
        throw Error('Error posting notification to Discord');
    }
}

async function postSaleToWebhook(playerName, itemName, itemQuantity, totalPrice) {
    await axios.post(
        process.env.DISCORD_WEBHOOK_URL,
        {
            "embeds": [
                {
                    "author": {
                        "name": "Wandering Trader"
                    },
                    "thumbnail": {
                        "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
                    },
                    "title": `Purchased ${itemQuantity} ${itemName} from ${playerName} for ${totalPrice}`,
                    "color": 65280
                }
            ]
        }
    );
}

async function postNoItemsFoundToWebhook(itemName, playerName) {
    await axios.post(
        process.env.DISCORD_WEBHOOK_URL,
        {
            "embeds": [
                {
                    "author": {
                        "name": "Wandering Trader"
                    },
                    "thumbnail": {
                        "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
                    },
                    "title": `No ${itemName} found in ${playerName} inventory.  Sale aborted.`,
                    "color": 65280
                }
            ]
        }
    );
}

async function postNoPlayerFoundToWebhook() {
    await axios.post(
        process.env.DISCORD_WEBHOOK_URL,
        {
            "embeds": [
                {
                    "author": {
                        "name": "Wandering Trader"
                    },
                    "thumbnail": {
                        "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
                    },
                    "title": `Player not online.  Sale aborted.`,
                    "color": 65280
                }
            ]
        }
    );
}

async function postUnknownResponseToWebhook(resp) {
    await axios.post(
        process.env.DISCORD_WEBHOOK_URL,
        {
            "embeds": [
                {
                    "author": {
                        "name": "Wandering Trader"
                    },
                    "thumbnail": {
                        "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
                    },
                    "title": `I tried to process the transaction, but the server responded unexpectedly: \`\`\`${resp}\`\`\`.`,
                    "color": 65280
                }
            ]
        }
    );
}

exports.processClearResponse = processClearResponse;