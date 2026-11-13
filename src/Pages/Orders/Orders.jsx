import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { FiPackage } from 'react-icons/fi'
import { MdSavings } from 'react-icons/md'
import { AiOutlineLogin } from 'react-icons/ai'
import axios from 'axios'
import { toast } from 'react-toastify'
import EmptyState from '../../Components/EmptyState/EmptyState'
import { formatPrice } from '../../Helpers/price'
import '../Cart/Cart.css'
import './Orders.css'

const statusColors = { Placed: 'success', Cancelled: 'error' }

// money saved on one order: MRP minus selling price of every item, plus the coupon discount
const getOrderSaving = (order) => {
    const itemSaving = order.productData.reduce((sum, item) => {
        const product = item.productId
        if (!product || !(product.originalPrice > product.price)) return sum
        return sum + (product.originalPrice - product.price) * item.quantity
    }, 0)
    return itemSaving + (order.couponDiscount || 0)
}

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// list of the logged in user's previous orders
const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [orderToCancel, setOrderToCancel] = useState(null)
    const [cancelling, setCancelling] = useState(false)
    const authToken = localStorage.getItem('Authorization')

    useEffect(() => {
        window.scroll(0, 0)
        if (!authToken) {
            setLoading(false)
            return
        }
        axios.get(`${process.env.REACT_APP_GET_PREVIOUS_ORDER}`, { headers: { 'Authorization': authToken } })
            .then(({ data }) => setOrders(data))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false))
    }, [authToken])

    const cancelOrder = async () => {
        if (!orderToCancel) return
        try {
            setCancelling(true)
            const { data } = await axios.put(`${process.env.REACT_APP_CANCEL_ORDER}/${orderToCancel._id}`, {}, {
                headers: { 'Authorization': authToken }
            })
            setOrders(prev => prev.map(order => order._id === data._id ? { ...order, status: data.status } : order))
            toast.success('Order cancelled', { autoClose: 800, theme: 'colored' })
        } catch (error) {
            toast.error(typeof error.response?.data === 'string' ? error.response.data : 'Could not cancel the order', { autoClose: 1200, theme: 'colored' })
        } finally {
            setCancelling(false)
            setOrderToCancel(null)
        }
    }

    if (!authToken) {
        return <EmptyState icon={<AiOutlineLogin />} title='Please login to see your orders' actionLabel='Login' actionTo='/login' />
    }

    if (loading) {
        return <div className='cart-loading'><CircularProgress /></div>
    }

    if (orders.length === 0) {
        return <EmptyState icon={<FiPackage />} title='No orders yet' message='When you place an order it will show up here.' />
    }

    const activeOrders = orders.filter(order => order.status !== 'Cancelled')
    const totalSaved = activeOrders.reduce((sum, order) => sum + getOrderSaving(order), 0)

    return (
        <div className='orders'>
            <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Typography fontSize={14} color='text.primary'>My Orders</Typography>
            </Breadcrumbs>
            <h1 className='orders__title'>My Orders</h1>

            {totalSaved > 0 && (
                <div className='orders__saved'>
                    <MdSavings />
                    <span>
                        You have saved <b>{formatPrice(totalSaved)}</b> on {activeOrders.length} {activeOrders.length === 1 ? 'order' : 'orders'} with ShopIt 🎉
                    </span>
                </div>
            )}

            {orders.map(order => (
                <div className='order' key={order._id}>
                    <div className='order__header'>
                        <div>
                            <p className='order__label'>Order placed</p>
                            <p>{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                            <p className='order__label'>Total</p>
                            <p>{formatPrice(order.totalAmount)}</p>
                            {order.couponDiscount > 0 && (
                                <p className='order__coupon'>{order.couponCode} − {formatPrice(order.couponDiscount)}</p>
                            )}
                        </div>
                        <div>
                            <p className='order__label'>Payment</p>
                            <p>{order.paymentMethod || 'Cash on Delivery'}</p>
                        </div>
                        <div className='order__id'>
                            <p className='order__label'>Order ID</p>
                            <p>#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <Chip label={order.status || 'Placed'} color={statusColors[order.status || 'Placed'] || 'default'} size='small' />
                    </div>

                    {order.productData.map(item => item.productId && (
                        <Link
                            to={`/Detail/type/${item.productId.type}/${item.productId._id}`}
                            className='order__item'
                            key={item._id}
                        >
                            <img src={item.productId.image} alt={item.productId.name} />
                            <div>
                                <p className='order__item-name'>{item.productId.name}</p>
                                <p className='order__item-meta'>Qty {item.quantity} × {formatPrice(item.productId.price)}</p>
                            </div>
                            <b>{formatPrice(item.productId.price * item.quantity)}</b>
                        </Link>
                    ))}

                    {order.userData?.address && (
                        <p className='order__address'>
                            Delivering to {order.userData.firstName} — {order.userData.address}, {order.userData.city}, {order.userData.userState} {order.userData.zipCode}
                        </p>
                    )}

                    <div className='order__actions'>
                        <Button variant='outlined' size='small' component={Link} to={`/orders/${order._id}/invoice`}>
                            Invoice
                        </Button>
                        {(order.status || 'Placed') === 'Placed' && (
                            <Button variant='outlined' color='error' size='small' onClick={() => setOrderToCancel(order)}>
                                Cancel Order
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            <Dialog open={Boolean(orderToCancel)} onClose={() => !cancelling && setOrderToCancel(null)}>
                <DialogTitle>Cancel this order?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Order #{orderToCancel?._id.slice(-8).toUpperCase()} will be cancelled. This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOrderToCancel(null)} disabled={cancelling}>Keep Order</Button>
                    <Button variant='contained' color='error' onClick={cancelOrder} disabled={cancelling}>
                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Orders
