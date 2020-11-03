const { log } = require('./util/logger.js');
const shopService = require('./service/shopService.js');

exports.handler = async (event, context) => {
    await log('Received event: ' + JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.requestContext.routeKey == 'POST /buyItem') {
        const player = JSON.parse(event.body).player;
        const itemName = JSON.parse(event.body).itemName;
        const quantity = JSON.parse(event.body).quantity;
        try {
            await shopService.buyItem(player, itemName, quantity);
        } catch (err) {
            if (err.message == 'item not found') {
                statusCode = '404';
            } else {
                statusCode = '500';
            }
            body = {
                error: 'purchase failed',
                errorDetail: err.message
            }
        }
    } else if (event.requestContext.routeKey == 'POST /charge') {
        const player = JSON.parse(event.body).player;
        const amount = JSON.parse(event.body).amount;
        try {
            await paymentService.charge(player, amount);
        } catch (err) {
            if (err.message == 'wallet not found') {
                statusCode = '404';
            } else {
                statusCode = '500';
            }
            body = {
                error: 'charge failed',
                errorDetail: err.message
            }
        }
    } else {
        statusCode = '404'
    }

    body = JSON.stringify(body);
    return {
        statusCode,
        body,
        headers,
    };
};