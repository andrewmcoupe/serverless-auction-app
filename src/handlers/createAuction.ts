import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { v4 as uuid } from 'uuid';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

enum AuctionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

interface Auction {
  id: string;
  title: string;
  status: AuctionStatus;
  createdAt: string;
}

export const createAuction: APIGatewayProxyHandler = async (event, context) => {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  const defaultStatus = AuctionStatus.OPEN;

  const auction: Auction = {
    id: uuid(),
    title,
    status: defaultStatus,
    createdAt: now.toISOString(),
  };

  const params = {
    TableName: 'AuctionsTable',
    Item: auction,
  };

  // default put uses callbacks, chain promise method to use async await
  await dynamoDb.put(params).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};
