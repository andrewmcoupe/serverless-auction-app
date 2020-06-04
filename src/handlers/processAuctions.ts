import { getEndedAuctions } from '../lib/getEndedAuctions'

const processAuctions = async (event, context) => {
  const auctionsToClose = await getEndedAuctions()

  console.log(auctionsToClose)
}

export const handler = processAuctions
