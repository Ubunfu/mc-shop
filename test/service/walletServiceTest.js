const axios = require('axios');
const walletService = require('../../src/service/walletService.js');
const expect = require('chai').expect;
const sinon = require('sinon');

const AN_ERROR = 'an error occurred';
const A_WALLET = {
    WalletId: 'player1',
    Balance: 100
};

describe('walletService: When getWallet is called', function() {
    describe('And wallet service returns an error', function() {
        it('Throws the error', async function() {
            const getWalletMock = sinon.stub(axios, "get")
                .throws('errorName', AN_ERROR);
            try {
                await walletService.getWallet();
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(AN_ERROR);
            }
            getWalletMock.restore();
        });
    });
    describe('And wallet service succeeds', function() {
        it('Returns a wallet', async function() {
            const getWalletMock = sinon.stub(axios, "get")
                .returns(A_WALLET);
            const wallet = await walletService.getWallet();
            expect(wallet).to.be.deep.equal(A_WALLET);
            getWalletMock.restore();
        });
    });
});