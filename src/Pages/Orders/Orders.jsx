import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Chip, CircularProgress, Typography } from '@mui/material'
import { FiPackage } from 'react-icons/fi'
import { AiOutlineLogin } from 'react-icons/ai'
import axios from 'axios'
import EmptyState from '../../Components/EmptyState/EmptyState'
import { formatPrice } from '../../Helpers/price'
import '../Cart/Cart.css'
import './Orders.css'

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// list of the logged in user's previous orders
const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
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

    if (!authToken) {
        return <EmptyState icon={<AiOutlineLogin />} title='Please login to see your orders' actionLabel='Login' actionTo='/login' />
    }

    if (loading) {
        return <div className='cart-loading'><CircularProgress /></div>
    }

    if (orders.length === 0) {
        return <EmptyState icon={<FiPackage />} title='No orders yet' message='When you place an order it will show up here.' />
    }

    return (
        <div className='orders'>
            <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Typography fontSize={14} color='text.primary'>My Orders</Typography>
            </Breadcrumbs>
            <h1 className='orders__title'>My Orders</h1>

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
                        </div>
                        <div>
                            <p className='order__label'>Payment</p>
                            <p>{order.paymentMethod || 'Cash on Delivery'}</p>
                        </div>
                        <div className='order__id'>
                            <p className='order__label'>Order ID</p>
                            <p>#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <Chip label={order.status || 'Placed'} color='success' size='small' />
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
                </div>
            ))}
        </div>
    )
}

export default Orders
