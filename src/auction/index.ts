import { v4 as uuid } from 'uuid'

export enum AuctionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export class Auction {
  id: string
  title: string
  status: AuctionStatus
  createdAt: string

  constructor() {
    this.id = uuid()
    this.status = AuctionStatus.OPEN
    this.createdAt = new Date().toISOString()
  }
}
