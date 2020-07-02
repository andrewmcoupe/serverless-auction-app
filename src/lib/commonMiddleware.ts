import middy from '@middy/core'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'

export default (handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>) =>
  middy(handler).use([httpEventNormalizer(), httpErrorHandler()])
