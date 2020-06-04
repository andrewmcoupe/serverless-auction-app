import { DynamoDB } from 'aws-sdk'

const dynamodb = new DynamoDB.DocumentClient()

export const closeAuction = async (auction) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    ExpressionAttributeNames: {
      '#status': 'status', // status is a reserved word in AWS
    },
  }

  const result = await dynamodb.update(params).promise()

  return result
}
