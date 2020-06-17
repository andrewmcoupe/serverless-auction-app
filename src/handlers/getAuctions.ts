import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import createError from 'http-errors'
import validator from '@middy/validator'
import commonMiddleware from '../lib/commonMiddleware'
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema'

const dynamoDb = new DynamoDB.DocumentClient()

const getAuctions: APIGatewayProxyHandler = async (event, context) => {
  let auctions: DynamoDB.DocumentClient.ItemList | undefined
  const status = event.queryStringParameters?.status

  if (!status) {
    throw new createError.BadRequest('Status of OPEN or CLOSED must be provided as a query string')
  }

  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

  try {
    const result = await dynamoDb.query(params).promise()

    auctions = result?.Items
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  }
}

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: getAuctionsSchema }),
)
