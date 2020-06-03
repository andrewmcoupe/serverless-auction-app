import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'
import { Auction } from '../auction'

const dynamoDb = new DynamoDB.DocumentClient()

export async function getAuctionById(id: string): Promise<Auction> {
  let auction: Auction | null

  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }
    const result = await dynamoDb.get(params).promise()
    auction = result.Item as Auction
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with id ${id} not found`)
  }

  return auction
}

const getAuction: APIGatewayProxyHandler = async (event, context) => {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  }
}

export const handler = commonMiddleware(getAuction)
