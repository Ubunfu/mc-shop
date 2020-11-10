require('dotenv').config();
const { log } = require('./util/logger.js');
const shopService = require('./service/shopService.js');
const itemService = require('./service/itemService.js');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

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
    } else if (event.requestContext.routeKey == 'GET /item') {
        const itemName = event.queryStringParameters.item;
        try {
            const item = await itemService.getItem(docClient, itemName);
            body = {
                itemName: item.itemName,
                price: item.price
            }
        } catch (err) {
            if (err.message == 'item not found') {
                statusCode = '404';
            } else {
                statusCode = '500';
            }
            body = {
                error: 'failed to get item',
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