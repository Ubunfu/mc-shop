const axios = require('axios');

async function getWallet(walletId) {

    return axios.get(
        process.env.SERVICE_WALLET_URL,
        {
            params: {
                id: walletId
            }
        }
    )

}

async function chargeWallet() {

}

exports.getWallet = getWallet;
exports.chargeWallet = chargeWallet;