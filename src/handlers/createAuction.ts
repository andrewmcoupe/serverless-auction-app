import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

enum AuctionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export const createAuction: APIGatewayProxyHandler = async (event, context) => {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  const defaultStatus: AuctionStatus = AuctionStatus.OPEN;

  const auction = {
    title,
    status: defaultStatus,
    createdAt: now.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};
