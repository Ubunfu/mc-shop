const sinon = require('sinon');
const shopService = require('../src/service/shopService.js');
const itemService = require('../src/service/itemService.js');
const index = require('../src/index.js');
const expect = require('chai').expect;

const EVENT_BUY_ITEM = {
    requestContext: {
        routeKey: 'POST /item/buy'
    },
    body: '{"player": "player1", "itemName": "itemName", "quantity": 1}'
}
const EVENT_GET_ITEM = {
    requestContext: {
        routeKey: 'GET /item'
    },
    queryStringParameters: {
        item: 'an item'
    }
}
const EVENT_GET_ITEMS = {
    requestContext: {
        routeKey: 'GET /items'
    }
}
const EVENT_SELL_ITEM = {
    requestContext: {
        routeKey: 'POST /item/sell'
    },
    body: '{"player": "player1", "itemName": "item name", "quantity": 1}'
}
const EVENT_UNKNOWN_REQ = {
    requestContext: {
        routeKey: 'GET /unknown/api'
    }
}

const ITEM_SERVICE_GET_ITEM_SUCCESS_RESP = {
    itemName: 'an item',
    itemId: 'minecraft:item',
    price: 100
}

const ITEM_SERVICE_GET_ITEMS_SUCCESS_RESP = [
    ITEM_SERVICE_GET_ITEM_SUCCESS_RESP
]

const ERROR_PURCHASE_FAILED = 'purchase failed';
const ERROR_GET_ITEM_FAILED = 'failed to get item';
const ERROR_SELL_ITEM_FAILED = 'sale failed';
const ERROR_DETAIL_ITEM_NOT_FOUND = 'item not found';
const ERROR_DETAIL_ITEM_NOT_SELLABLE = 'item not sellable';
const ERROR_DETAIL_OTHER_ERROR = 'some other error';

const SUCCESS_RESP_GET_ITEM = {
    itemName: 'an item',
    price: 100
}
const ERROR_RESP_GET_ITEM_404 = {
    error: ERROR_GET_ITEM_FAILED,
    errorDetail: ERROR_DETAIL_ITEM_NOT_FOUND
}
const ERROR_RESP_GET_ITEM_500 = {
    error: ERROR_GET_ITEM_FAILED,
    errorDetail: ERROR_DETAIL_OTHER_ERROR
}
const ERROR_RESP_SELL_ITEM_404 = {
    error: ERROR_SELL_ITEM_FAILED,
    errorDetail: ERROR_DETAIL_ITEM_NOT_FOUND
}
const ERROR_RESP_SELL_ITEM_403 = {
    error: ERROR_SELL_ITEM_FAILED,
    errorDetail: ERROR_DETAIL_ITEM_NOT_SELLABLE
}
const ERROR_RESP_SELL_ITEM_500 = {
    error: ERROR_SELL_ITEM_FAILED,
    errorDetail: ERROR_DETAIL_OTHER_ERROR
}

describe('index: When unknown request is received', function() {
    it('Should return HTTP 404', async function() {
        const indexResp = await index.handler(EVENT_UNKNOWN_REQ);
        expect(indexResp.statusCode).to.be.equal('404');
    });
});

describe('index: When GET Item request is received', function() {
    describe('And shop service returns the item', function() {
        it('Should return the item', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem")
                .returns(ITEM_SERVICE_GET_ITEM_SUCCESS_RESP);
            const indexResp = await index.handler(EVENT_GET_ITEM);
            expect(indexResp.statusCode).to.be.equal('200');
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ITEM_SERVICE_GET_ITEM_SUCCESS_RESP);
            itemServiceMock.restore();
        });
    });
    describe('And item is not found', function() {
        it('Should return HTTP 404', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem")
                .throws('errorName', ERROR_DETAIL_ITEM_NOT_FOUND);
            const indexResp = await index.handler(EVENT_GET_ITEM);
            expect(indexResp.statusCode).to.be.equal('404');
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_RESP_GET_ITEM_404);
            itemServiceMock.restore();
        });
    });
    describe('And shop service fails', function() {
        it('Should return 500 error', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItem")
                .throws('errorName', ERROR_DETAIL_OTHER_ERROR);
            const indexResp = await index.handler(EVENT_GET_ITEM);
            expect(indexResp.statusCode).to.be.equal('500');
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_RESP_GET_ITEM_500);
            itemServiceMock.restore();
        });
    });
});

describe('index: When GET Items request is received', function() {
    describe('And shop service returns a list of items', function() {
        it('Should return the list', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItems")
                .returns(ITEM_SERVICE_GET_ITEMS_SUCCESS_RESP)
            const indexResp = await index.handler(EVENT_GET_ITEMS);
            expect(indexResp.statusCode).to.be.equal('200');
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ITEM_SERVICE_GET_ITEMS_SUCCESS_RESP);
            itemServiceMock.restore();
        });
    });
    describe('And shop service fails', function() {
        it('Should return 500 error', async function() {
            const itemServiceMock = sinon.stub(itemService, "getItems")
                .throws('errorName', ERROR_DETAIL_OTHER_ERROR)
            const indexResp = await index.handler(EVENT_GET_ITEMS)
            expect(indexResp.statusCode).to.be.equal('500')
            expect(JSON.parse(indexResp.body)).to.be.deep.equal({
                error: 'failed to get item',
                errorDetail: ERROR_DETAIL_OTHER_ERROR
            })
            itemServiceMock.restore();
        });
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
        it('Should return HTTP 200', async function() {
            const shopServiceMock = sinon.stub(shopService, "sellItem")
                .returns({});
            const indexResp = await index.handler(EVENT_SELL_ITEM);
            expect(indexResp.statusCode).to.be.equal('200');
            shopServiceMock.restore();
        });
    });
    describe('And shop service fails', function() {
        describe('Because item not found', function() {
            it('Should return 404 error', async function() {
                const shopServiceMock = sinon.stub(shopService, "sellItem")
                    .throws('errorName', ERROR_DETAIL_ITEM_NOT_FOUND);
                const indexResp = await index.handler(EVENT_SELL_ITEM);
                expect(indexResp.statusCode).to.be.equal('404');
                expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_RESP_SELL_ITEM_404);
                shopServiceMock.restore();
            });
        });
        describe('Because item not sellable', function() {
            it('Should return 403 error', async function() {
                const shopServiceMock = sinon.stub(shopService, "sellItem")
                    .throws('errorName', ERROR_DETAIL_ITEM_NOT_SELLABLE);
                const indexResp = await index.handler(EVENT_SELL_ITEM);
                expect(indexResp.statusCode).to.be.equal('403');
                expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_RESP_SELL_ITEM_403);
                shopServiceMock.restore();
            });
        });
        describe('For any other reason', function() {
            it('Should return 500 error', async function() {
                const shopServiceMock = sinon.stub(shopService, "sellItem")
                    .throws('errorName', ERROR_DETAIL_OTHER_ERROR);
                const indexResp = await index.handler(EVENT_SELL_ITEM);
                expect(indexResp.statusCode).to.be.equal('500');
                expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_RESP_SELL_ITEM_500);
                shopServiceMock.restore();
            });
        });
    });
});