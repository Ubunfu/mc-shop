const axios = require('axios');
const { log } = require('../util/logger');

async function getWallet(walletId) {
    return await axios.get(
        process.env.SERVICE_WALLET_URL + '/wallet',
        {
            params: {
                id: walletId
            }
        }
    ).data;
}

async function chargeWallet(walletId, amount) {
    log(`[walletService] Charging ${walletId} ${amount}`);
    await axios.post(
        process.env.SERVICE_WALLET_URL + '/charge',
        {
            player: walletId,
            amount: amount
        }
    );
}

async function payWallet(walletId, amount) {
    log(`[walletService] Paying ${walletId} ${amount}`);
    await axios.post(
        process.env.SERVICE_WALLET_URL + '/pay',
        {
            player: walletId,
            amount: amount
        }
    );
}

exports.getWallet = getWallet;
exports.chargeWallet = chargeWallet;
exports.payWallet = payWallet;