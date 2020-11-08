const sinon = require('sinon');
const shopService = require('../src/service/shopService.js');
const index = require('../src/index.js');
const expect = require('chai').expect;

const EVENT_BUY_ITEM = {
    requestContext: {
        routeKey: 'POST /buyItem'
    },
    body: '{"player": "player1", "itemName": "itemName", "quantity": 1}'
}

const ERROR_PURCHASE_FAILED = 'purchase failed';
const ERROR_DETAIL_ITEM_NOT_FOUND = 'item not found';
const ERROR_DETAIL_OTHER_ERROR = 'some other error';

describe('index: When GET Items request is received', function() {
    describe('And shop service returns a list of items', function() {
        it('Should return the list');
    });
    describe('And shop service fails', function() {
        it('Should return 500 error');
        it('Should return error code');
    });
});

describe('index: When Search Items request is received', function() {
    describe('And shop service returns a list of items', function() {
        it('Should return the list');
    });
    describe('And shop service fails', function() {
        it('Should return 500 error');
        it('Should return error code');
    });
});

describe('index: When Buy Item request is received', function() {
    describe('And shop service succeeds', function() {
        it('Should return HTTP 200', async function() {
            const shopServiceMock = sinon.stub(shopService, "buyItem")
                .returns({});
            const indexResp = await index.handler(EVENT_BUY_ITEM);
            expect(indexResp.statusCode).to.be.equal('200');
            shopServiceMock.restore();
        });
    });
    describe('And shop service fails', function() {
        describe('Because item not found', function() {
            it('Should return 404 error', async function() {
                const shopServiceMock = sinon.stub(shopService, "buyItem")
                    .throws('errorName', ERROR_DETAIL_ITEM_NOT_FOUND);
                const indexResp = await index.handler(EVENT_BUY_ITEM);
                expect(indexResp.statusCode).to.be.equal('404');
                shopServiceMock.restore();
            });
            it('Should return error code', async function() {
                const shopServiceMock = sinon.stub(shopService, "buyItem")
                    .throws('errorName', ERROR_DETAIL_ITEM_NOT_FOUND);
                const indexResp = await index.handler(EVENT_BUY_ITEM);
                expect(JSON.parse(indexResp.body).error).to.be.equal(ERROR_PURCHASE_FAILED);
                expect(JSON.parse(indexResp.body).errorDetail).to.be.equal(ERROR_DETAIL_ITEM_NOT_FOUND);
                shopServiceMock.restore();
            });
        });
        describe('For any other reason', function() {
            it('Should return 500 error', async function() {
                const shopServiceMock = sinon.stub(shopService, "buyItem")
                    .throws('errorName', ERROR_DETAIL_OTHER_ERROR);
                const indexResp = await index.handler(EVENT_BUY_ITEM);
                expect(indexResp.statusCode).to.be.equal('500');
                shopServiceMock.restore();
            });
            it('Should return error code', async function() {
                const shopServiceMock = sinon.stub(shopService, "buyItem")
                    .throws('errorName', ERROR_DETAIL_OTHER_ERROR);
                const indexResp = await index.handler(EVENT_BUY_ITEM);
                expect(JSON.parse(indexResp.body).error).to.be.equal(ERROR_PURCHASE_FAILED);
                expect(JSON.parse(indexResp.body).errorDetail).to.be.equal(ERROR_DETAIL_OTHER_ERROR);
                shopServiceMock.restore();
            });
        });
    });
});

describe('index: When Sell Item request is received', function() {
    describe('And shop service succeeds', function() {
        it('Should return HTTP 200');
    });
    describe('And shop service fails', function() {
        describe('Because item not found', function() {
            it('Should return 404 error');
            it('Should return error code');
        });
        describe('For any other reason', function() {
            it('Should return 500 error');
            it('Should return error code');
        });
    });
});