const axios = require('axios');

async function getWallet(walletId) {
    return await axios.get(
        process.env.SERVICE_WALLET_URL,
        {
            params: {
                id: walletId
            }
        }
    );
}

async function chargeWallet(walletId, amount) {
    await axios.post(
        process.env.SERVICE_WALLET_URL,
        {
            player: walletId,
            amount: amount
        }
    );
}

exports.getWallet = getWallet;
exports.chargeWallet = chargeWallet;