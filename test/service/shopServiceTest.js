const shopService = require('../../src/service/shopService.js');
const itemService = require('../../src/service/itemService.js');
const walletService = require('../../src/service/walletService.js');
const rconService = require('../../src/service/rconService.js');
const sinon = require('sinon');
const expect = require('chai').expect;

const ERROR_ITEM_NOT_FOUND = 'item not found';
const ERROR_CHECKING_ITEM = 'error checking item validity';
const ERROR_GETTING_WALLET = 'error getting wallet';
const ERROR_INSUFFICIENT_FUNDS = 'insufficient funds';
const ERROR_OTHER_ERROR = 'other error';

const PLAYER = 'player1';
const ITEM_NAME = 'someItem';
const ITEM_ID = 'minecraft:some_item';
const QUANTITY = 1;
const AN_ITEM_50 = {
    itemName: ITEM_NAME,
    itemId: ITEM_ID,
    price: 50
};
const AN_ITEM_500 = {
    itemName: ITEM_NAME,
    itemId: ITEM_ID,
    price: 500
};
const A_WALLET_100 = {
    WalletId: PLAYER,
    Balance: 100
};

describe('shopService: When buyItem is called', function() {
    describe('And item is not found', function() {
        it('Throws error with correct message', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem")
                .throws('errorName', ERROR_ITEM_NOT_FOUND);
            try {
                await shopService.buyItem(PLAYER, ITEM_NAME, QUANTITY);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(ERROR_ITEM_NOT_FOUND);
            }
            itemServiceMock.restore();
        });
    });
    describe('Something else happened while checking the item', function() {
        it('Throws error with correct message', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem")
                .throws('errorName', ERROR_OTHER_ERROR);
            try {
                await shopService.buyItem(PLAYER, ITEM_NAME, QUANTITY);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(ERROR_CHECKING_ITEM);
            }
            itemServiceMock.restore();
        });
    });
    describe('And item is found', function() {
        describe('And player does not have enough money', function() {
            it('Throws error with correct message', async function() {
                const itemServiceMock = sinon.stub(itemService, "getItem")
                    .returns(AN_ITEM_500);
                const walletServiceMock = sinon.stub(walletService, "getWallet")
                    .returns(A_WALLET_100);
                try {
                    await shopService.buyItem(PLAYER, ITEM_NAME, QUANTITY);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal(ERROR_INSUFFICIENT_FUNDS);
                }
                itemServiceMock.restore();
                walletServiceMock.restore();
            });
        });
        describe('And something else happened while checking wallet balance', function() {
            it('Throws error with correct message', async function() {
                const itemServiceMock = sinon.stub(itemService, "getItem")
                    .returns(AN_ITEM_50);
                const walletServiceMock = sinon.stub(walletService, "getWallet")
                    .throws('errorName', ERROR_OTHER_ERROR);
                try {
                    await shopService.buyItem(PLAYER, ITEM_NAME, QUANTITY);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal(ERROR_GETTING_WALLET);
                }
                itemServiceMock.restore();
                walletServiceMock.restore();
            });
        });
        describe('And player has enough money', function() {
            describe('And player is not online', function() {
                it('Throws error with correct message');
            });
            describe('And player is online', function() {
                let itemServiceMock, getWalletMock, chargeWalletMock, rconServiceMock;
                beforeEach(async function() {
                    itemServiceMock = sinon.stub(itemService, "getItem").returns(AN_ITEM_50);
                    getWalletMock = sinon.stub(walletService, "getWallet").returns(A_WALLET_100);
                    chargeWalletMock = sinon.stub(walletService, "chargeWallet").returns(null);
                    rconServiceMock = sinon.stub(rconService, "giveItem").returns(null);
                    await shopService.buyItem(PLAYER, ITEM_NAME, QUANTITY);
                });
                afterEach(function() {
                    itemServiceMock.restore();
                    getWalletMock.restore();
                    chargeWalletMock.restore();
                    rconServiceMock.restore();
                });
                it('Charges player', async function() {
                    expect(chargeWalletMock.calledOnceWith(PLAYER, (AN_ITEM_50.price * QUANTITY))).to.be.true;
                });
                it('Gives player items', async function() {
                    expect(rconServiceMock.calledOnce).to.be.true;
                    expect(rconServiceMock.lastCall.args[1]).to.be.equal(PLAYER);
                    expect(rconServiceMock.lastCall.args[2]).to.be.equal(ITEM_ID);
                    expect(rconServiceMock.lastCall.args[3]).to.be.equal(QUANTITY);
                    // expect(rconServiceMock.calledOnceWith(PLAYER, AN_ITEM_50.itemId, QUANTITY)).to.be.true;
                });
            });
        });
    });
});