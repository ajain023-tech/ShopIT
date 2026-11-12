import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdLocalShipping, MdAssignmentReturn, MdPayments, MdSupportAgent } from 'react-icons/md'
import Carousel from '../../Components/Carousel/Carousel'
import CategoryCard from '../../Components/Category_Card/CategoryCard'
import ProductCard from '../../Components/Card/Product Card/ProductCard'
import Loading from '../../Components/loading/Loading'
import categories from '../../Helpers/HomePageBanner'
import { getAllProducts } from '../../Constants/Constant'
import { getDiscountPercent } from '../../Helpers/price'
import { Books, Jewelry } from '../../Assets/Images/Image'
import './HomePage.css'

const PRODUCTS_PER_ROW = 8
const RECENT_KEY = 'shopIt_recent'

// ids of the products the user opened most recently (newest first)
const getRecentIds = () => {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY))
    return Array.isArray(ids) ? ids : []
  } catch (error) {
    return []
  }
}

const promises = [
  { icon: <MdLocalShipping />, title: 'Free Delivery', text: 'On orders above ₹999' },
  { icon: <MdAssignmentReturn />, title: 'Easy Returns', text: '7-day return policy' },
  { icon: <MdPayments />, title: 'Cash on Delivery', text: 'Pay when you receive' },
  { icon: <MdSupportAgent />, title: '24x7 Support', text: 'We are here to help' },
]

// heading of a product row with a "View all" link
const SectionHeader = ({ title, subtitle, to }) => (
  <div className='section-header'>
    <div>
      <h2 className='section-title'>{title}</h2>
      {subtitle && <p className='section-subtitle'>{subtitle}</p>}
    </div>
    {to && <Link to={to} className='section-link'>View all →</Link>}
  </div>
)

const ProductRow = ({ products, loading }) => (
  <div className='product-grid'>
    {loading
      ? Array.from({ length: 4 }).map((_, i) => <Loading key={i} />)
      : products.map(product => <ProductCard prod={product} key={product._id} />)}
  </div>
)

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scroll(0, 0)
    getAllProducts((data) => {
      setProducts(data || [])
      setLoading(false)
    })
  }, [])

  const recentlyViewed = getRecentIds()
    .map(id => products.find(product => product._id === id))
    .filter(Boolean)
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, PRODUCTS_PER_ROW)
  const bestDeals = [...products].sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a)).slice(0, PRODUCTS_PER_ROW)
  // MongoDB ids grow over time, so the biggest ids are the newest products
  const newArrivals = [...products].sort((a, b) => (a._id < b._id ? 1 : a._id > b._id ? -1 : 0)).slice(0, PRODUCTS_PER_ROW)

  return (
    <div className='home'>
      <Carousel />

      <section className='promises'>
        {promises.map(item => (
          <div className='promise' key={item.title}>
            <span className='promise__icon'>{item.icon}</span>
            <div>
              <p className='promise__title'>{item.title}</p>
              <p className='promise__text'>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className='home-section'>
        <SectionHeader title='Shop by Category' subtitle='Find exactly what you are looking for' />
        <div className='category-grid'>
          {categories.map(category => <CategoryCard data={category} key={category.name} />)}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className='home-section'>
          <SectionHeader title='Recently Viewed' subtitle='Pick up where you left off' />
          <ProductRow products={recentlyViewed} loading={false} />
        </section>
      )}

      <section className='home-section'>
        <SectionHeader title='Trending Now' subtitle='Top rated by our customers' to='/products?sort=rating' />
        <ProductRow products={trending} loading={loading} />
      </section>

      <section className='home-section promo-grid'>
        <Link to='/product/type/book' className='promo' style={{ backgroundImage: `url(${Books})` }}>
          <div className='promo__content'>
            <span className='promo__tag'>Bestsellers</span>
            <h3>Books for every reader</h3>
            <p>Sci-fi, mystery, business and cookbooks</p>
          </div>
        </Link>
        <Link to='/product/type/jewelry' className='promo' style={{ backgroundImage: `url(${Jewelry})` }}>
          <div className='promo__content'>
            <span className='promo__tag'>New Arrivals</span>
            <h3>Jewellery that shines</h3>
            <p>Rings, necklaces, earrings and bracelets</p>
          </div>
        </Link>
      </section>

      <section className='home-section'>
        <SectionHeader title='Best Deals' subtitle='Biggest discounts right now' to='/products?sort=discount' />
        <ProductRow products={bestDeals} loading={loading} />
      </section>

      <section className='home-section'>
        <SectionHeader title='New Arrivals' subtitle='Just added to the store' to='/products' />
        <ProductRow products={newArrivals} loading={loading} />
      </section>
    </div>
  )
}

export default HomePage
