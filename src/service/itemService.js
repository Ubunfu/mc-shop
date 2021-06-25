async function getItem(docClient, itemName) {

    let params = {
        TableName: process.env.TABLE_ITEMS,
        Key: {
            itemName: itemName
        }
    }
    const item = await docClient.get(params).promise();
    if (item.Item == undefined) {
        throw Error('item not found');
    }
    return item.Item;
}

async function getItems(docClient) {

}

exports.getItem = getItem;
exports.getItems = getItems;