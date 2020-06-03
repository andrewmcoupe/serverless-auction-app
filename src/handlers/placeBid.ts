import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import createError from 'http-errors'

import commonMiddleware from '../lib/commonMiddleware'
import { getAuctionById } from './getAuction'

const dynamoDb = new DynamoDB.DocumentClient()

const placeBid: APIGatewayProxyHandler = async (event, context) => {
  const { id } = event.pathParameters
  const { amount } = JSON.parse(event.body)
  const auction = await getAuctionById(id)

  if (amount < auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than the current highest bid of ${auction.highestBid.amount}`,
    )
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  }

  let updatedAuction: DynamoDB.DocumentClient.AttributeMap

  try {
    const result = await dynamoDb.update(params).promise()
    updatedAuction = result.Attributes
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  }
}

export const handler = commonMiddleware(placeBid)
