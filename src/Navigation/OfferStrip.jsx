import React from 'react'
import { Link } from 'react-router-dom'

// thin offer bar shown above the header
const OfferStrip = () => {
  return (
    <div className='offer-strip'>
      <span>Free delivery on orders above ₹999</span>
      <span className='offer-strip__dot'>•</span>
      <span>Cash on Delivery available</span>
      <span className='offer-strip__dot'>•</span>
      <Link to='/products'>Shop the latest deals →</Link>
    </div>
  )
}

export default OfferStrip
