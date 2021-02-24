const fs = require('fs');

const TABLE_NAME = 'myTableName'
const SCAN_OUTPUT_FILE = 'db-scan.json'
const BATCH_OUTPUT_FILE_PREFIX = 'batch'

async function makeBatch() {
    const backupString = await fs.readFileSync(SCAN_OUTPUT_FILE, 'utf-8')
    const backupItems = JSON.parse(backupString).Items

    let batchRequests = []
    backupItems.forEach(backupItem => {
        batchRequests.push({
            PutRequest: {
                Item: backupItem
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

makeBatch()