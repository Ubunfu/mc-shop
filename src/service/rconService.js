const { log } = require('../util/logger.js');
const { sleep } = require('../util/sleep.js');

const SERVER_RCON_CONNECT_DELAY_MS = process.env.SERVER_RCON_CONNECT_DELAY_MS;

async function giveItem(rconClient, player, itemId, quantity) {
    await setupClientListeners(rconClient);
    await rconClient.connect();
    await sleep(SERVER_RCON_CONNECT_DELAY_MS);
    await rconClient.send(await buildCommand(player, itemId, quantity));
    rconClient.disconnect();
}

async function buildCommand(player, itemId, quantity) {
    const rconCommand = `give ${player} ${itemId} ${quantity}`;
    log('[rconService] Constructed RCON command: ' + rconCommand);
    return rconCommand;
}

async function setupClientListeners(rconClient) {
    rconClient.on('auth', function() {
        log("[rconService] Authenticated!");
    }).on('response', function(resp) {
        log(`[rconService] Got response: ${resp}`);
    }).on('end', function() {
        log("[rconService] Socket closed!");
    }).on('error', function(err) {
        log("[rconService] RCON error!");
        log(err);
    });
}

exports.giveItem = giveItem;