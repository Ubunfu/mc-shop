const RCON = require('rcon');
const clearResponseProcessor = require('../util/rconClearResponseProcessor.js');
const { log } = require('../util/logger.js');
const { sleep } = require('../util/sleep.js');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_RCON_PORT = process.env.SERVER_RCON_PORT;
const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS;
const SERVER_RCON_CONNECT_DELAY_MS = process.env.SERVER_RCON_CONNECT_DELAY_MS;

let rconClient = new RCON(SERVER_HOST, SERVER_RCON_PORT, SERVER_RCON_PASS);
let itemNameGlobal;

rconClient.on('auth', function() {
    log("[rconService] Authenticated!");
}).on('response', async function(resp) {
    log(`[rconService] Got response: ${resp}`);
    await clearResponseProcessor.processClearResponse(resp, itemNameGlobal);
}).on('end', function() {
    log("[rconService] Socket closed!");
}).on('error', function(err) {
    log("[rconService] RCON error!");
    log(err);
});

/*
    Process sell is implemented separately because there seems to be something about the async,
    event-driven nature of the RCON library (or perhaps just JS in general) that was causing 
    problems when it was implemented the same way the buy item command is.
    I don't understand what's going on well enough yet to fix it more properly, but implementing
    it in this very difficult to test way, and adding some artificial sleep time after the async 
    invocation (to give the RCON command execution and post processing time to finish) seems to
    work OK for now.
*/
async function processSell(player, itemName, itemId, quantity) {
    itemNameGlobal = itemName;
    log(`[rconService] process sell args: ${player}, ${itemName}, ${itemId}, ${quantity}`);
    await rconClient.connect();
    await sleep(SERVER_RCON_CONNECT_DELAY_MS);
    await rconClient.send(await buildCommandItemSell(player, itemId, quantity));
    rconClient.disconnect();
}

async function buildCommandItemSell(player, itemId, quantity) {
    const rconCommand = `clear ${player} ${itemId} ${quantity}`;
    log('[rconService] Constructed RCON command: ' + rconCommand);
    return rconCommand;
}

exports.processSell = processSell;