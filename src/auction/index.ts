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
  createdAt: string

  constructor() {
    this.id = uuid()
    this.status = AuctionStatus.OPEN
    this.highestBid = {
      amount: 0,
    }
    this.createdAt = new Date().toISOString()
  }
}
