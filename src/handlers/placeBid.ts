import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'
import validator from '@middy/validator'
import commonMiddleware from '../lib/commonMiddleware'
import { getAuctionById } from './getAuction'
import { AuctionStatus } from '../auction'
import placeBidSchema from '../lib/schemas/placeBidSchema'

const dynamoDb = new DynamoDB.DocumentClient()

const placeBid: APIGatewayProxyHandler = async (event, context) => {
  if (!event.body || !event.pathParameters) {
    throw new createError.BadRequest('Please provide event body and path parameters')
  }

  const { id } = event.pathParameters
  const { amount } = JSON.parse(event.body)
  const auction = await getAuctionById(id)

  if (auction.status !== AuctionStatus.OPEN) {
    throw new createError.Forbidden('You cannot bid on closed auctions')
  }

  if (amount < auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than the current highest bid of ${auction.highestBid.amount}`,
    )
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME as string,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  }

  let updatedAuction: DynamoDB.DocumentClient.AttributeMap

  const result = await dynamoDb.update(params).promise()

  if (result.Attributes) {
    updatedAuction = result.Attributes
  } else {
    throw new createError.InternalServerError('Something went wrong updating the auction')
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  }
}

export const handler = commonMiddleware(placeBid).use(validator({ inputSchema: placeBidSchema }))
