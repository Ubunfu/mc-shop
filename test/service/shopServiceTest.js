const shopService = require('../../src/service/shopService.js');
const sinon = require('sinon');
const expect = require('chai').expect;
const itemService = require('../../src/service/itemService.js');

const ERROR_ITEM_NOT_FOUND = 'item not found';
const ERROR_CHECKING_ITEM = 'error checking item validity';
const ERROR_OTHER_ERROR = 'other error';

const PLAYER = 'player1';
const ITEM = 'someItem';
const QUANTITY = 5;

describe('shopService: When buyItem is called', function() {
    describe('And item is not found', function() {
        it('Throws error with correct message', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem")
                .throws('errorName', ERROR_ITEM_NOT_FOUND);
            try {
                await shopService.buyItem(PLAYER, ITEM, QUANTITY);
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
                await shopService.buyItem(PLAYER, ITEM, QUANTITY);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(ERROR_CHECKING_ITEM);
            }
            itemServiceMock.restore();
        });
    });
    describe('And item is found', function() {
        describe('And player does not have enough money', function() {
            it('Throws error with correct message');
        });
        describe('And player has enough money', function() {
            describe('And player is not online', function() {
                it('Throws error with correct message');
            });
            describe('And player is online', function() {
                it('Charges player');
                it('Gives player items');
            });
        });
    });
});