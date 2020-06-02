import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import middy from '@middy/core'
import createError from 'http-errors'
import httpErrorHandler from '@middy/http-error-handler'

const dynamoDb = new DynamoDB.DocumentClient()

const getAuction: APIGatewayProxyHandler = async (event, context) => {
  let auction: DynamoDB.DocumentClient.GetItemOutput | null
  const { id } = event.pathParameters

  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }
    const result = await dynamoDb.get(params).promise()
    auction = result.Item
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with id ${id} not found`)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  }
}

export const handler = middy(getAuction).use(httpErrorHandler())
