import './Productsimilar.css'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Chip, Dialog, DialogActions, DialogContent, Skeleton, Typography } from '@mui/material'
import { MdAddShoppingCart, MdLocalShipping, MdAssignmentReturn, MdPayments, MdVerifiedUser } from 'react-icons/md'
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt, AiFillStar, AiOutlineLogin, AiFillCloseCircle } from 'react-icons/ai'
import { BsLightningChargeFill } from 'react-icons/bs'
import { MdCompareArrows, MdAccountBalanceWallet } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import ProductCard from '../../Components/Card/Product Card/ProductCard'
import { Transition, addToCart, FREE_SHIPPING_ABOVE } from '../../Constants/Constant'
import useWishlist from '../../Hooks/useWishlist'
import useCompare from '../../Hooks/useCompare'
import useBudget from '../../Hooks/useBudget'
import { formatPrice, getDiscountPercent, getOriginalPrice } from '../../Helpers/price'
import { typeLabels } from '../../SingleCategory/SingleCategory'
import { getLoginPath } from '../../Helpers/redirect'
import usePageTitle from '../../Hooks/usePageTitle'

const MAX_QUANTITY = 5
const SIMILAR_COUNT = 8
const RECENT_KEY = 'shopIt_recent'
const MAX_RECENT = 8

// remember the products the user opened, newest first, no duplicates
const saveRecentlyViewed = (productId) => {
    try {
        const saved = JSON.parse(localStorage.getItem(RECENT_KEY)) || []
        const recent = [productId, ...saved.filter(savedId => savedId !== productId)].slice(0, MAX_RECENT)
        localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
    } catch (error) {
        // storage not available, recently viewed just won't be saved
    }
}

// expected delivery date, 4 days from today
const getDeliveryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 4)
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
}

const ProductDetail = () => {
    const { setCart } = useContext(ContextFunction)
    const { addToWishlist, removeFromWishlist, getWishlistItemByProductId, isInWishlist, wishlistLoading } = useWishlist()
    const { id, cat } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { isInCompare, toggleCompare, compareProducts } = useCompare()
    const { hasBudget, remaining } = useBudget()

    const [product, setProduct] = useState(null)
    const [similarProducts, setSimilarProducts] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })

    const authToken = localStorage.getItem('Authorization')
    const isLoggedIn = Boolean(authToken)
    usePageTitle(product?.name || (loading ? '' : 'Product not found'))

    useEffect(() => {
        window.scroll(0, 0)
        setLoading(true)
        setQuantity(1)
        const loadProduct = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`)
                setProduct(data)
                if (data && data._id) saveRecentlyViewed(data._id)
            } catch (error) {
                setProduct(null)
            } finally {
                setLoading(false)
            }
        }
        const loadSimilar = async () => {
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_PRODUCT_TYPE}`, { userType: cat })
                setSimilarProducts(data.filter(p => p._id !== id).slice(0, SIMILAR_COUNT))
            } catch (error) {
                setSimilarProducts([])
            }
        }
        loadProduct()
        loadSimilar()
    }, [id, cat])

    const handleAddToCart = async (goToCart = false) => {
        if (!isLoggedIn) return setOpenAlert(true)
        try {
            setAdding(true)
            await addToCart(product._id, quantity, authToken, setCart)
            if (goToCart) {
                navigate('/cart')
            } else {
                toast.success('Added to cart', { autoClose: 500, theme: 'colored' })
            }
        } catch (error) {
            const message = error.response?.data?.msg
            // "Buy Now" on a product already in the cart just opens the cart
            if (goToCart && message) return navigate('/cart')
            toast.info(message || 'Could not add to cart', { autoClose: 800, theme: 'colored' })
        } finally {
            setAdding(false)
        }
    }

    const handleWishlist = async () => {
        if (!isLoggedIn) return setOpenAlert(true)
        try {
            if (isInWishlist(product._id)) {
                await removeFromWishlist(getWishlistItemByProductId(product._id))
                toast.success('Removed from wishlist', { autoClose: 500, theme: 'colored' })
            } else {
                await addToWishlist(product)
                toast.success('Added to wishlist', { autoClose: 500, theme: 'colored' })
            }
        } catch (error) {
            toast.error(error.message, { autoClose: 700, theme: 'colored' })
        }
    }

    const shareProduct = async () => {
        const url = window.location.href
        try {
            if (navigator.share) {
                await navigator.share({ title: product.name, text: product.name, url })
            } else {
                await navigator.clipboard.writeText(url)
                toast.success('Link copied', { autoClose: 600, theme: 'colored' })
            }
        } catch (error) {
            // user closed the share sheet
        }
    }

    // move the zoomed image with the mouse
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        setZoom({ active: true, x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 })
    }

    if (loading) {
        return (
            <div className='detail'>
                <div className='detail__layout'>
                    <Skeleton variant='rounded' height={460} />
                    <div>
                        <Skeleton width='30%' height={28} />
                        <Skeleton width='80%' height={48} />
                        <Skeleton width='40%' height={40} />
                        <Skeleton variant='rounded' height={160} sx={{ mt: 2 }} />
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className='detail' style={{ textAlign: 'center' }}>
                <Typography variant='h6'>Product not found</Typography>
                <Button component={Link} to='/products' variant='contained' sx={{ mt: 2 }}>Browse products</Button>
            </div>
        )
    }

    const discount = getDiscountPercent(product)
    const originalPrice = getOriginalPrice(product)
    const inWishlist = isInWishlist(product._id)
    const highlights = [product.brand, product.author, product.category, product.gender].filter(Boolean)

    return (
        <div className='detail'>
            <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Link to={`/product/type/${cat}`}>{typeLabels[cat] || cat}</Link>
                <Typography fontSize={14} color='text.primary' noWrap sx={{ maxWidth: 260 }}>{product.name}</Typography>
            </Breadcrumbs>

            <div className='detail__layout'>
                <div
                    className='detail__image-box'
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setZoom({ ...zoom, active: false })}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className='detail__image'
                        style={{
                            transform: zoom.active ? 'scale(1.8)' : 'scale(1)',
                            transformOrigin: `${zoom.x}% ${zoom.y}%`,
                        }}
                    />
                    {discount > 0 && <span className='detail__badge'>{discount}% OFF</span>}
                    <span className='detail__zoom-hint' aria-hidden='true'>Hover to zoom</span>
                </div>

                <div className='detail__info'>
                    <p className='detail__brand'>{product.brand || product.author}</p>
                    <h1 className='detail__name'>{product.name}</h1>

                    {product.rating > 0 && (
                        <span className='detail__rating'>{product.rating.toFixed(1)} <AiFillStar /></span>
                    )}

                    <div className='detail__price-row'>
                        <span className='detail__price'>{formatPrice(product.price)}</span>
                        {discount > 0 && <span className='detail__mrp'>MRP {formatPrice(originalPrice)}</span>}
                        {discount > 0 && <span className='detail__off'>({discount}% off)</span>}
                    </div>
                    <p className='detail__tax'>Inclusive of all taxes</p>

                    {hasBudget && (
                        <p className={`detail__budget ${product.price * quantity > remaining ? 'detail__budget--over' : ''}`}>
                            <MdAccountBalanceWallet />
                            {product.price * quantity <= remaining
                                ? <>Fits your budget — {formatPrice(remaining - product.price * quantity)} left after this</>
                                : remaining <= 0
                                    ? <>Your cart is already over your budget — check Smart Savings in your cart</>
                                    : <>{formatPrice(product.price * quantity - remaining)} over your remaining budget</>}
                        </p>
                    )}

                    <p className='detail__description'>{product.description}</p>

                    {highlights.length > 0 && (
                        <div className='detail__chips'>
                            {highlights.map(item => <Chip key={item} label={item} variant='outlined' size='small' />)}
                        </div>
                    )}

                    <div className='detail__quantity'>
                        <span>Quantity</span>
                        <div className='qty'>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label='Decrease quantity'>−</button>
                            <span aria-live='polite'>{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(MAX_QUANTITY, q + 1))} disabled={quantity >= MAX_QUANTITY} aria-label='Increase quantity'>+</button>
                        </div>
                    </div>

                    <div className='detail__buttons'>
                        <Button variant='outlined' size='large' startIcon={<MdAddShoppingCart />} disabled={adding} onClick={() => handleAddToCart(false)}>
                            Add to Cart
                        </Button>
                        <Button variant='contained' size='large' color='secondary' startIcon={<BsLightningChargeFill />} disabled={adding} onClick={() => handleAddToCart(true)}>
                            Buy Now
                        </Button>
                        <Button variant='outlined' size='large' color={inWishlist ? 'error' : 'inherit'} disabled={wishlistLoading} onClick={handleWishlist} aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                            {inWishlist ? <AiFillHeart size={22} /> : <AiOutlineHeart size={22} />}
                        </Button>
                        <Button variant='outlined' size='large' color='inherit' onClick={shareProduct} aria-label='Share product'>
                            <AiOutlineShareAlt size={22} />
                        </Button>
                    </div>

                    <div className='detail__compare'>
                        <Button size='small' startIcon={<MdCompareArrows />} variant={isInCompare(product._id) ? 'contained' : 'text'} onClick={() => toggleCompare(product)}>
                            {isInCompare(product._id) ? 'Added to compare' : 'Add to compare'}
                        </Button>
                        {similarProducts.length > 0 && (
                            <Button size='small' onClick={() => { compareProducts([product, ...[...similarProducts].sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))]); navigate('/compare') }}>
                                Compare price with similar products →
                            </Button>
                        )}
                    </div>

                    <div className='detail__delivery'>
                        <div><MdLocalShipping /> <span>Delivery by <b>{getDeliveryDate()}</b>{product.price * quantity >= FREE_SHIPPING_ABOVE ? ' • Free delivery' : ` • Free above ${formatPrice(FREE_SHIPPING_ABOVE)}`}</span></div>
                        <div><MdAssignmentReturn /> <span>Easy 7-day returns and exchange</span></div>
                        <div><MdPayments /> <span>Cash on Delivery available</span></div>
                        <div><MdVerifiedUser /> <span>100% original product</span></div>
                    </div>
                </div>
            </div>

            {similarProducts.length > 0 && (
                <section className='detail__similar'>
                    <h2>Similar Products</h2>
                    <div className='detail__similar-row'>
                        {similarProducts.map(prod => (
                            <div className='detail__similar-item' key={prod._id}>
                                <ProductCard prod={prod} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)}>
                <DialogContent sx={{ width: { xs: 280, md: 350 }, textAlign: 'center' }}>
                    <Typography variant='h6'>Please login to continue</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-evenly', pb: 2 }}>
                    <Button component={Link} to={getLoginPath(location)} variant='contained' endIcon={<AiOutlineLogin />}>Login</Button>
                    <Button variant='outlined' color='error' endIcon={<AiFillCloseCircle />} onClick={() => setOpenAlert(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ProductDetail
