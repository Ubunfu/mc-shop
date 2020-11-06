const rconService = require('../../src/service/rconService.js');
const sinon = require('sinon');
const expect = require('chai').expect;

const A_PLAYER = 'player';
const A_ITEM_ID = 'minecraft:diamond_axe';
const QUANTITY = 5;
const COMMAND_STRING = `/give ${A_PLAYER} ${A_ITEM_ID} ${QUANTITY}`;

describe('rconService: When giveItem is called', function() {
    it('The proper command is issued', async function() {
        const rconServiceMock = {
            on: sinon.stub().returnsThis(),
            connect: sinon.stub().returns(null),
            disconnect: sinon.stub().returns(null),
            send: sinon.stub().returns(null)
        };
        await rconService.giveItem(rconServiceMock, A_PLAYER, A_ITEM_ID, QUANTITY);
        expect(rconServiceMock.connect.calledOnce).to.be.true;
        expect(rconServiceMock.send.calledOnceWithExactly(COMMAND_STRING)).to.be.true;
    });
});