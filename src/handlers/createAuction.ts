import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import middy from '@middy/core'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

import { Auction, AuctionStatus } from '../auction'

const dynamoDb = new DynamoDB.DocumentClient()

const handler: APIGatewayProxyHandler = async (event, context) => {
  const { title } = JSON.parse(event.body)
  const now = new Date().toISOString()
  const defaultStatus = AuctionStatus.OPEN

  const auction: Auction = new Auction(title, defaultStatus, now)

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
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

export const createAuction = middy(handler).use(httpEventNormalizer()).use(httpErrorHandler())
