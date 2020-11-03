const itemService = require('./itemService.js');
const walletService = require('./walletService.js');
const rconService = require('./rconService.js');

async function buyItem(player, itemName, quantity) {
    // check if item is real
    // check if player has enough money
    // check if player is online
    // charge player
    // give item
    let item;
    try {
        item = await itemService.getItem(itemName);
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
        await rconService.giveItem(player, item.itemId, quantity);
    } catch (err) {
        throw Error('error delivering item');
    }
}

exports.buyItem = buyItem;