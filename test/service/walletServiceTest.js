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
const AN_AMOUNT = 10;
const PAY_WALLET_REQ = {
    player: A_PLAYER,
    amount: AN_AMOUNT
}
const CHARGE_WALLET_REQ = {
    player: A_PLAYER,
    amount: AN_AMOUNT
}

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

describe('walletService: When payWallet is called', function() {
    describe('And wallet service returns an error', function() {
        it('Throws the error', async function() {
            const payWalletMock = sinon.stub(axios, "post").throws('errorName', AN_ERROR);
            try {
                await walletService.payWallet(A_PLAYER, AN_AMOUNT);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(AN_ERROR);
            }
            payWalletMock.restore();
        });
    });
    describe('And wallet service succeeds', function() {
        it('Paid the correct amount', async function() {
            const payWalletMock = sinon.stub(axios, "post").returns();
            await walletService.payWallet(A_PLAYER, AN_AMOUNT);
            expect(payWalletMock.calledOnce).to.be.true;
            expect(payWalletMock.lastCall.args[1]).to.be.deep.equal(PAY_WALLET_REQ);
            payWalletMock.restore();
        });
    });
});

describe('walletService: When chargeWallet is called', function() {
    describe('And wallet service returns an error', function() {
        it('Throws the error', async function() {
            const chargeWalletMock = sinon.stub(axios, "post").throws('errorName', AN_ERROR);
            try {
                await walletService.chargeWallet(A_PLAYER, AN_AMOUNT);
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal(AN_ERROR);
            }
            chargeWalletMock.restore();
        });
    });
    describe('And wallet service succeeds', function() {
        it('Charges the correct amount', async function() {
            const chargeWalletMock = sinon.stub(axios, "post").returns();
            await walletService.chargeWallet(A_PLAYER, AN_AMOUNT);
            expect(chargeWalletMock.calledOnce).to.be.true;
            expect(chargeWalletMock.lastCall.args[1]).to.be.deep.equal(CHARGE_WALLET_REQ);
            chargeWalletMock.restore();
        });
    });
});