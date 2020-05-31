import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import middy from '@middy/core'
import createError from 'http-errors'

const dynamoDb = new DynamoDB.DocumentClient()

const handler: APIGatewayProxyHandler = async (event, context) => {
  let auctions

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

export const getAuctions = middy(handler)
