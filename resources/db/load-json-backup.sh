#!/bin/bash

export TABLE_NAME=$1
export SCAN_OUTPUT_FILE=$2

if [[ -z "$TABLE_NAME" ]]; then
    echo "missing a parameter"
    exit 1
fi
if [[ -z "$SCAN_OUTPUT_FILE" ]]; then
    echo "missing a parameter"
    exit 1
fi

node makeBatch.js

aws dynamodb batch-write-item --request-items file://items_0.json
aws dynamodb batch-write-item --request-items file://items_1.json
aws dynamodb batch-write-item --request-items file://items_2.json
aws dynamodb batch-write-item --request-items file://items_3.json
aws dynamodb batch-write-item --request-items file://items_4.json
aws dynamodb batch-write-item --request-items file://items_5.json
aws dynamodb batch-write-item --request-items file://items_6.json
aws dynamodb batch-write-item --request-items file://items_7.json