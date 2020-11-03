const sinon = require('sinon');
const itemService = require('../../src/service/itemService.js');
const expect = require('chai').expect;

const ERROR_OTHER = 'other error';
const ERROR_ITEM_NOT_FOUND = 'item not found';

const ITEM_NAME = 'itemName';
const ITEM_ID = 'itemId';
const ITEM_PRICE = 10;
const AN_ITEM = {
    itemName: ITEM_NAME,
    itemId: ITEM_ID,
    price: ITEM_PRICE
};
const DB_ITEM_RESP = {
    Item: AN_ITEM
};

describe('itemService: When getItem is called', function() {
    describe('And the database throws an unexpected error', function() {
        it('Throws the same error', async function() {
            const fakeDocClient = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().rejects('errorName', ERROR_OTHER)
            };
            try {
                await itemService.getItem(fakeDocClient, ITEM_NAME);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(ERROR_OTHER);
            }
        });
    });
    describe('And the database does not return a result', function() {
        it('Throws the correct error', async function() {
            const fakeDocClient = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().resolves({})
            };
            try {
                await itemService.getItem(fakeDocClient, ITEM_NAME);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(ERROR_ITEM_NOT_FOUND);
            }
        });
    });
    describe('And the database returns a result', function() {
        it('Returns the item', async function() {
            const fakeDocClient = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().resolves(DB_ITEM_RESP)
            };
            const item = await itemService.getItem(fakeDocClient, ITEM_NAME);
            expect(item).to.deep.equal(AN_ITEM);
        });
    });
});