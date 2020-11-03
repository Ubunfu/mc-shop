# mc-shop
Operates the shop experience where items can be bought and sold.

This service runs as an AWS lambda function.

## Configuration
### IAM Role
AWS's standard IAM role for Lambda micro services is plenty sufficient. The only access that is required is read/write for DynamoDB, and write to CloudWatch logs.

* AWSLambdaMicroserviceExecutionRole
* AWSLambdaBasicExecutionRole

### Environment Variables
| Parameter          | Description                                                                       | Default | Required? |
|--------------------|-----------------------------------------------------------------------------------|---------|-----------|
| TABLE_ITEMS        | The name of a DynamoDB table containing items and their values.                   | n/a     | Yes       |
| LOGGER_ENABLED     | Boolean value controlling writing of logs. Useful to turn off for test execution. | n/a     | Yes       |