const itemService = require('./itemService.js');

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
}

exports.buyItem = buyItem;