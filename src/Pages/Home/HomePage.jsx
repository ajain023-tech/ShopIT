import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { Container, Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ContextFunction } from '../../Context/Context'
import CategoryCard from '../../Components/Category_Card/CategoryCard'
import BannerData from '../../Helpers/HomePageBanner'
import Carousel from '../../Components/Carousel/Carousel'
import SearchBar from '../../Components/SearchBar/SearchBar'
import CopyRight from '../../Components/CopyRight/CopyRight'
import './HomePage.css'

/* ─── Feature card data ─────────────────────────────────────── */
const features = [
  {
    icon: '🚀',
    title: 'Free Shipping',
    desc: 'Enjoy free shipping on all orders over $50. Fast, reliable delivery straight to your doorstep — no hidden fees, ever.',
  },
  {
    icon: '🔐',
    title: 'Secure Payment',
    desc: 'Shop with confidence using 256-bit SSL encryption. Your payment details are always protected and never stored.',
  },
  {
    icon: '↩️',
    title: 'Easy Returns',
    desc: 'Not happy? Return anything within 30 days — no questions asked. We make returns simple, fast, and completely hassle-free.',
  },
]

/* ─── Floating emoji data ───────────────────────────────────── */
const floatingIcons = ['👟', '👗', '💻', '📚', '💍', '🎒', '⌚']

/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const { setCart } = useContext(ContextFunction)
  const navigate = useNavigate()
  const authToken = localStorage.getItem('Authorization')

  useEffect(() => {
    getCart()
    window.scroll(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCart = async () => {
    if (authToken !== null) {
      const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
        headers: { Authorization: authToken },
      })
      setCart(data)
    }
  }

  return (
    <>
      {/* ══════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="hero-section">
        {/* Glowing background orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* Test mode badge */}
        <div className="test-mode-badge">
          <span className="test-mode-dot" />
          Test Mode
        </div>

        {/* Floating product emoji icons */}
        <div className="floating-icons" aria-hidden="true">
          {floatingIcons.map((emoji, i) => (
            <span key={i} className="float-icon">
              {emoji}
            </span>
          ))}
        </div>

        {/* Hero content */}
        <div className="hero-content">
          {/* Eyebrow label */}
          <div className="hero-eyebrow">
            ✨ &nbsp; New Season, New Deals
          </div>

          {/* Main headline */}
          <Typography component="h1" className="hero-headline">
            Shop The{' '}
            <span className="hero-headline-gradient">Best,</span>
            <br />
            Pay Less
          </Typography>

          {/* Subtitle */}
          <Typography className="hero-subtitle">
            Discover <strong>118+</strong> premium products across{' '}
            <strong>8 categories</strong> — curated for quality, priced for everyone.
          </Typography>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <Button
              variant="contained"
              size="large"
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Shop Now &nbsp;→
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="btn-secondary"
              onClick={() => {
                document.getElementById('categories-section')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              Browse Categories
            </Button>
          </div>

          {/* Stats bar */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">118+</div>
              <div className="hero-stat-label">Products</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-number">8</div>
              <div className="hero-stat-label">Categories</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-number">4.9★</div>
              <div className="hero-stat-label">Avg Rating</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-number">24/7</div>
              <div className="hero-stat-label">Support</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. CAROUSEL (existing)
      ══════════════════════════════════════════════ */}
      <Box sx={{ background: '#fff', pt: 1, pb: 1 }}>
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Box padding={1}>
            <Carousel />
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════
          3. SEARCH BAR (existing)
      ══════════════════════════════════════════════ */}
      <section className="search-section">
        <Typography className="search-section-title">
          Find What You Love
        </Typography>
        <Typography className="search-section-sub">
          Search across our entire catalogue instantly
        </Typography>
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </Container>
      </section>



      {/* ══════════════════════════════════════════════
          5. CATEGORIES SECTION (existing BannerData)
      ══════════════════════════════════════════════ */}
      <section id="categories-section" className="categories-section">
        <Typography className="categories-title">
          Shop by Category
        </Typography>
        <Typography className="categories-subtitle">
          Hand-picked collections for every style and need
        </Typography>

        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {BannerData.map((data) => (
            <CategoryCard data={data} key={data.img} />
          ))}
        </Container>
      </section>

      {/* ══════════════════════════════════════════════
          6. COPYRIGHT (existing)
      ══════════════════════════════════════════════ */}
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  )
}

export default HomePage