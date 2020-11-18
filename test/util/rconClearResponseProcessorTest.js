const expect = require('chai').expect;
const axios = require('axios');
const sinon = require('sinon');
const itemService = require('../../src/service/itemService.js');
const walletService = require('../../src/service/walletService.js');
const rconClearResponseProcessor = require('../../src/util/rconClearResponseProcessor.js');

const RCON_RESPONSE_REMOVED_ITEMS = 'Removed 10 items from player player1';
const RCON_RESPONSE_NO_ITEMS_FOUND = 'No items were found on player player1';
const RCON_RESPONSE_NO_PLAYER_FOUND = 'No player was found';
const RCON_RESPONSE_UNKNOWN = 'some bullshit from the server';

const ITEM_NAME = 'Diamond';
const ITEM_ID = 'minecraft:diamond';
const AN_ITEM_50_SELLABLE = {
    itemName: ITEM_NAME,
    itemId: ITEM_ID,
    price: 50,
    sellPrice: 10
};

const WEBHOOK_POST_SALE_SUCCESS = {
    "embeds": [
        {
            "author": {
                "name": "Wandering Trader"
            },
            "thumbnail": {
                "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
            },
            "title": `Purchased 10 Diamond from player1 for 100`,
            "color": 65280
        }
    ]
}
const WEBHOOK_POST_NO_ITEMS_FOUND = {
    "embeds": [
        {
            "author": {
                "name": "Wandering Trader"
            },
            "thumbnail": {
                "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
            },
            "title": `No Diamond found in player1 inventory.  Sale aborted.`,
            "color": 65280
        }
    ]
}
const WEBHOOK_POST_NO_PLAYER_FOUND = {
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
const WEBHOOK_POST_UNKNOWN_RESPONSE = {
    "embeds": [
        {
            "author": {
                "name": "Wandering Trader"
            },
            "thumbnail": {
                "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
            },
            "title": `I tried to process the transaction, but the server responded unexpectedly: \`\`\`${RCON_RESPONSE_UNKNOWN}\`\`\`.`,
            "color": 65280
        }
    ]
}

describe('rconClearResponseProcessor: When processClearResponse is called', function() {
    describe('And some items were removed', function() {
        it('Charges player for correctly and posts to webhook', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem").returns(AN_ITEM_50_SELLABLE);
            const walletServiceMock = sinon.stub(walletService, "payWallet").returns();
            const webhookMock = sinon.stub(axios, "post").returns();
            await rconClearResponseProcessor.processClearResponse(RCON_RESPONSE_REMOVED_ITEMS, ITEM_NAME);
            expect(walletServiceMock.calledOnceWithExactly('player1', 100)).to.be.true;
            expect(webhookMock.calledOnce).to.be.true;
            expect(webhookMock.lastCall.args[1]).to.be.deep.equal(WEBHOOK_POST_SALE_SUCCESS);
            itemServiceMock.restore();
            walletServiceMock.restore();
            webhookMock.restore();
        });
    });
    describe('And items were not found in the player inventory', function() {
        it('Does not charge player and posts to webhook', async function() {
            const walletServiceMock = sinon.stub(walletService, "payWallet").returns();
            const webhookMock = sinon.stub(axios, "post").returns();
            await rconClearResponseProcessor.processClearResponse(RCON_RESPONSE_NO_ITEMS_FOUND, ITEM_NAME);
            expect(walletServiceMock.callCount).to.be.equal(0);
            expect(webhookMock.calledOnce).to.be.true;
            expect(webhookMock.lastCall.args[1]).to.be.deep.equal(WEBHOOK_POST_NO_ITEMS_FOUND);
            walletServiceMock.restore();
            webhookMock.restore();
        });
    });
    describe('And player was not found online', function() {
        it('Does not charge player and posts to webhook', async function() {
            const walletServiceMock = sinon.stub(walletService, "payWallet").returns();
            const webhookMock = sinon.stub(axios, "post").returns();
            await rconClearResponseProcessor.processClearResponse(RCON_RESPONSE_NO_PLAYER_FOUND, ITEM_NAME);
            expect(walletServiceMock.callCount).to.be.equal(0);
            expect(webhookMock.calledOnce).to.be.true;
            expect(webhookMock.lastCall.args[1]).to.be.deep.equal(WEBHOOK_POST_NO_PLAYER_FOUND);
            walletServiceMock.restore();
            webhookMock.restore();
        });
    });
    describe('And any other unexpected response from the server', function() {
        it('Does not charge player and posts to webhook', async function() {
            const walletServiceMock = sinon.stub(walletService, "payWallet").returns();
            const webhookMock = sinon.stub(axios, "post").returns();
            await rconClearResponseProcessor.processClearResponse(RCON_RESPONSE_UNKNOWN, ITEM_NAME);
            expect(walletServiceMock.callCount).to.be.equal(0);
            expect(webhookMock.calledOnce).to.be.true;
            expect(webhookMock.lastCall.args[1]).to.be.deep.equal(WEBHOOK_POST_UNKNOWN_RESPONSE);
            walletServiceMock.restore();
            webhookMock.restore();
        });
    });
});