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

  constructor(title: string, status: AuctionStatus, createdAt: string) {
    this.id = uuid()
    this.title = title
    this.status = status
    this.createdAt = createdAt
  }

  updateStatus(status: AuctionStatus): void {
    this.status = status
  }
}
