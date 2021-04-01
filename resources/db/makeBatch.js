const fs = require('fs');

const TABLE_NAME = process.env.TABLE_NAME
const SCAN_OUTPUT_FILE = process.env.SCAN_OUTPUT_FILE
const BATCH_OUTPUT_FILE_PREFIX = 'items'

async function makeBatch() {
    const backupString = await fs.readFileSync(SCAN_OUTPUT_FILE, 'utf-8')
    const backupItems = JSON.parse(backupString)

    let batchRequests = []
    backupItems.forEach(backupItem => {
        batchRequests.push({
            PutRequest: {
                Item: decorateWithDataTypes(backupItem)
            }
        })
    })
    
    for (let batchFileIndex = 0; batchFileIndex < (batchRequests.length/25); batchFileIndex++) {
        let batchObject = {}
        batchObject[TABLE_NAME] = []
    
        for (let requestIndex = 0; requestIndex < 25; requestIndex++) {
            const overallRequestIndex = (batchFileIndex*25+requestIndex)
            if (overallRequestIndex == batchRequests.length) {
                break
            }
            batchObject[TABLE_NAME].push(batchRequests[overallRequestIndex])
        }
        await fs.writeFileSync(BATCH_OUTPUT_FILE_PREFIX+`_${batchFileIndex}.json`, JSON.stringify(batchObject), 'utf8')
    }
}

function decorateWithDataTypes(item) {
    // {"itemName":"Cobblestone","itemId":"minecraft:cobblestone","price":1,"sellPrice":0.05}
    item.itemName = {
        S: item.itemName
    }
    item.itemId = {
        S: item.itemId
    }
    if (item.price) {
        item.price = {
            N: `${item.price}`
        }
    } else {
        item.price = undefined
    }
    if (item.sellPrice) {
        item.sellPrice = {
            N: `${item.sellPrice}`
        }
    } else {
        item.sellPrice = undefined
    }
    return item
}

makeBatch()