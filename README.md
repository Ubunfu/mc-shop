# mc-shop
Operates the shop experience where items can be bought and sold.

This service runs as an AWS lambda function.

## Configuration
### IAM Role
AWS's standard IAM role for Lambda micro services is plenty sufficient. The only access that is required is read/write for DynamoDB, and write to CloudWatch logs.

* AWSLambdaMicroserviceExecutionRole
* AWSLambdaBasicExecutionRole

### Environment Variables
| Parameter                    | Description                                                                       | Default | Required? |
|------------------------------|-----------------------------------------------------------------------------------|---------|-----------|
| TABLE_ITEMS                  | The name of a DynamoDB table containing items and their values.                   | n/a     | Yes       |
| LOGGER_ENABLED               | Boolean value controlling writing of logs. Useful to turn off for test execution. | n/a     | Yes       |
| SERVICE_WALLET_URL           | URL of the mc-wallet service.                                                     | n/a     | Yes       |
| SERVER_HOST                  | Hostname of the running minecraft server with RCON enabled.                       | n/a     | Yes       |
| SERVER_RCON_PORT             | Port on which the RCON service is listening on the minecraft server.              | n/a     | Yes       |
| SERVER_RCON_PASS             | Password required to authenticate with the RCON service.                          | n/a     | Yes       |
| SERVER_RCON_CONNECT_DELAY_MS | A configurable number of milliseconds to wait after successfully connecting to the RCON service before sending the actual command.  500ms is probably fine, but it may need to be tweaked based on network latency. | n/a     | Yes       |