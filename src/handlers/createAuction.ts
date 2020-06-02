import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import 'source-map-support/register'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

import { Auction } from '../auction'

const dynamoDb = new DynamoDB.DocumentClient()
const auction = new Auction()

const createAuction: APIGatewayProxyHandler = async (event, context) => {
  const { title } = JSON.parse(event.body)

  auction.title = title

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

export const handler = commonMiddleware(createAuction)
