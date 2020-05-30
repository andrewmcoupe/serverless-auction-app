import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB } from 'aws-sdk';

import { Auction, AuctionStatus } from '../auction';

const dynamoDb = new DynamoDB.DocumentClient();

export const createAuction: APIGatewayProxyHandler = async (event, context) => {
  const { title } = JSON.parse(event.body);
  const now = new Date().toISOString();
  const defaultStatus = AuctionStatus.OPEN;

  const auction: Auction = new Auction(title, defaultStatus, now);

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  };

  // default put uses callbacks, chain on the promise method to use async await
  await dynamoDb.put(params).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};
