#!/bin/bash

aws dynamodb batch-write-item --request-items file://items_1.json
aws dynamodb batch-write-item --request-items file://items_2.json
aws dynamodb batch-write-item --request-items file://items_3.json
aws dynamodb batch-write-item --request-items file://items_4.json
aws dynamodb batch-write-item --request-items file://items_5.json
aws dynamodb batch-write-item --request-items file://items_6.json
aws dynamodb batch-write-item --request-items file://items_7.json
aws dynamodb batch-write-item --request-items file://items_8.json