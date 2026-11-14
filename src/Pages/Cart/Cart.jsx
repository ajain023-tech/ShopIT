import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumbs, CircularProgress, Typography } from '@mui/material'
import { AiOutlineLogin } from 'react-icons/ai'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import CartCard from '../../Components/Card/CartCard/CartCard'
import EmptyState from '../../Components/EmptyState/EmptyState'
import OrderSummary from './OrderSummary'
import BudgetCard from '../../Components/Budget/BudgetCard'
import SmartSavings from '../../Components/Budget/SmartSavings'
import useBudget from '../../Hooks/useBudget'
import useWishlist from '../../Hooks/useWishlist'
import { EmptyCart } from '../../Assets/Images/Image'
import { addToCart, getCartTotals } from '../../Constants/Constant'
import './Cart.css'
import usePageTitle from '../../Hooks/usePageTitle'
import { getLoginPath } from '../../Helpers/redirect'

const Cart = () => {
    usePageTitle('Cart')
    const { cart, setCart, coupon } = useContext(ContextFunction)
    const { addToWishlist } = useWishlist()
    const { isOverBudget } = useBudget()
    const [swappingId, setSwappingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const authToken = localStorage.getItem('Authorization')
    const isLoggedIn = Boolean(authToken)
    const headers = { headers: { 'Authorization': authToken } }

    useEffect(() => {
        window.scroll(0, 0)
        if (!isLoggedIn) {
            setLoading(false)
            return
        }
        axios.get(`${process.env.REACT_APP_GET_CART}`, headers)
            .then(({ data }) => setCart(data))
            .catch(() => toast.error('Could not load your cart', { autoClose: 800, theme: 'colored' }))
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const changeQuantity = async (item, quantity) => {
        try {
            setUpdatingId(item._id)
            const { data } = await axios.put(`${process.env.REACT_APP_UPDATE_CART}/${item._id}`, { quantity }, headers)
            setCart(current => current.map(c => (c._id === item._id ? data : c)))
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Could not update quantity', { autoClose: 800, theme: 'colored' })
        } finally {
            setUpdatingId(null)
        }
    }

    const removeItem = async (item, message = 'Removed from cart') => {
        try {
            setUpdatingId(item._id)
            await axios.delete(`${process.env.REACT_APP_DELETE_CART}/${item._id}`, headers)
            setCart(current => current.filter(c => c._id !== item._id))
            toast.success(message, { autoClose: 500, theme: 'colored' })
        } catch (error) {
            toast.error('Something went wrong', { autoClose: 500, theme: 'colored' })
        } finally {
            setUpdatingId(null)
        }
    }

    const moveToWishlist = async (item) => {
        try {
            await addToWishlist(item.productId)
            await removeItem(item, 'Moved to wishlist')
        } catch (error) {
            toast.error(error.message, { autoClose: 700, theme: 'colored' })
        }
    }

    // Smart Budget: replace a cart item with a cheaper alternative
    const swapItem = async (item, alternative) => {
        try {
            setSwappingId(item._id)
            await axios.delete(`${process.env.REACT_APP_DELETE_CART}/${item._id}`, headers)
            await addToCart(alternative._id, item.quantity, authToken, setCart)
            toast.success(`Swapped and saved ${'₹' + ((item.productId.price - alternative.price) * item.quantity).toLocaleString('en-IN')}`, { autoClose: 900, theme: 'colored' })
        } catch (error) {
            toast.error('Could not swap this item', { autoClose: 800, theme: 'colored' })
        } finally {
            setSwappingId(null)
        }
    }

    if (!isLoggedIn) {
        return (
            <EmptyState
                icon={<AiOutlineLogin />}
                title='Please login to see your cart'
                message='Your cart items are saved to your account.'
                actionLabel='Login'
                actionTo={getLoginPath(location)}
            />
        )
    }

    if (loading) {
        return <div className='cart-loading'><CircularProgress /></div>
    }

    const cartItems = cart.filter(item => item.productId)
    const totals = getCartTotals(cartItems, coupon)

    if (cartItems.length === 0) {
        return (
            <EmptyState
                image={EmptyCart}
                title='Your cart is empty'
                message='Looks like you have not added anything yet.'
            />
        )
    }

    return (
        <div className='cart'>
            <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Typography fontSize={14} color='text.primary'>Cart</Typography>
            </Breadcrumbs>

            <div className='cart__layout'>
                <div>
                <div className='cart__items'>
                    <div className='cart__header'>
                        <h1>My Cart <span>({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})</span></h1>
                        <Link to='/orders' className='cart__orders-link'>View my orders</Link>
                    </div>
                    {cartItems.map(item => (
                        <CartCard
                            key={item._id}
                            item={item}
                            updating={updatingId === item._id}
                            onQuantityChange={changeQuantity}
                            onRemove={(cartItem) => removeItem(cartItem)}
                            onMoveToWishlist={moveToWishlist}
                        />
                    ))}
                </div>
                <SmartSavings cartItems={cartItems} onSwap={swapItem} isOverBudget={isOverBudget} swappingId={swappingId} />
                </div>

                <aside className='cart__summary'>
                    <BudgetCard />
                    <OrderSummary totals={totals} onCheckout={() => navigate('/checkout')} />
                </aside>
            </div>
        </div>
    )
}

export default Cart
