import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

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

export const handler = commonMiddleware(getAuction)
