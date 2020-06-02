import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import createError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamoDb = new DynamoDB.DocumentClient()

const getAuctions: APIGatewayProxyHandler = async (event, context) => {
  let auctions: DynamoDB.DocumentClient.ItemList

  try {
    const result = await dynamoDb
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise()

    auctions = result.Items
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  }
}

export const handler = commonMiddleware(getAuctions)
