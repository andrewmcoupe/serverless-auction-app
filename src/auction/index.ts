import { v4 as uuid } from 'uuid'

export enum AuctionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

type HighestBid = {
  amount: number
}

export class Auction {
  id: string
  title: string
  status: AuctionStatus
  highestBid: HighestBid
  endingAt: string
  createdAt: string

  constructor() {
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1) // sets auction duration to 1 hour

    this.id = uuid()
    this.status = AuctionStatus.OPEN
    this.highestBid = {
      amount: 0,
    }
    this.createdAt = now.toISOString()
    this.endingAt = endDate.toISOString()
  }
}
