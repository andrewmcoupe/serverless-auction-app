import { Auction } from '../index'

describe('Auction', () => {
  it('should create an Auction instance', () => {
    const auction = new Auction()

    expect(auction).toBeDefined()
  })

  it('should set the auction title', () => {
    const expected = 'Test title'
    const auction = new Auction()

    auction.title = expected

    expect(auction.title).toEqual(expected)
  })

  it('should have an id when instantiated', () => {
    const auction = new Auction()

    expect(auction.id).toBeDefined()
  })

  it('should have a createdAt field when instantiated', () => {
    const auction = new Auction()

    expect(auction.createdAt).toBeDefined()
  })
})
