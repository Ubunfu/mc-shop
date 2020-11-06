const axios = require('axios');
const walletService = require('../../src/service/walletService.js');
const expect = require('chai').expect;
const sinon = require('sinon');

const AN_ERROR = 'an error';
const A_PLAYER = 'player1';
const A_WALLET = {
    WalletId: A_PLAYER,
    Balance: 100
};

describe('walletService: When getWallet is called', function() {
    describe('And wallet service returns an error', function() {
        it('Throws the error', async function() {
            const getWalletMock = sinon.stub(axios, "get")
                .throws('errorName', AN_ERROR);
            try {
                await walletService.getWallet(A_PLAYER);
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
            const wallet = await walletService.getWallet(A_PLAYER);
            expect(wallet).to.be.equal(A_WALLET);
            getWalletMock.restore();
        });
    });
});