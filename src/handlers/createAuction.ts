import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'
import validator from '@middy/validator'

import { Auction } from '../auction'
import createAuctionSchema from '../lib/schemas/createAuctionSchema'

const dynamoDb = new DynamoDB.DocumentClient()
const auction = new Auction()

const createAuction: APIGatewayProxyHandler = async (event, context) => {
  if (!event.body) {
    throw new createError.BadRequest('Event body must be provided')
  }

  const { title } = JSON.parse(event.body)

  auction.title = title

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME as string,
    Item: auction,
  }

  try {
    await dynamoDb.put(params).promise()
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  }
}

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema }),
)
