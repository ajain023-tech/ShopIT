import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button, CircularProgress } from '@mui/material'
import { AiOutlineLogin, AiOutlinePrinter, AiOutlineArrowLeft } from 'react-icons/ai'
import { FiPackage } from 'react-icons/fi'
import { FaShoppingBag } from 'react-icons/fa'
import axios from 'axios'
import EmptyState from '../../Components/EmptyState/EmptyState'
import { formatPrice } from '../../Helpers/price'
import usePageTitle from '../../Hooks/usePageTitle'
import { getLoginPath } from '../../Helpers/redirect'
import './Invoice.css'

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

// printable invoice for one order of the logged in user
const Invoice = () => {
    const { id } = useParams()
    const location = useLocation()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const authToken = localStorage.getItem('Authorization')
    usePageTitle(order ? `Invoice #${order._id.slice(-8).toUpperCase()}` : 'Invoice')

    useEffect(() => {
        window.scroll(0, 0)
        if (!authToken) {
            setLoading(false)
            return
        }
        // the orders API only returns the user's own orders
        axios.get(`${process.env.REACT_APP_GET_PREVIOUS_ORDER}`, { headers: { 'Authorization': authToken } })
            .then(({ data }) => setOrder(data.find(o => o._id === id) || null))
            .catch(() => setOrder(null))
            .finally(() => setLoading(false))
    }, [authToken, id])

    if (!authToken) {
        return <EmptyState icon={<AiOutlineLogin />} title='Please login to see this invoice' actionLabel='Login' actionTo={getLoginPath(location)} />
    }

    if (loading) {
        return <div className='cart-loading' style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><CircularProgress /></div>
    }

    if (!order) {
        return <EmptyState icon={<FiPackage />} title='Invoice not found' message='This order does not exist or is not yours.' actionLabel='My Orders' actionTo='/orders' />
    }

    const items = order.productData.filter(item => item.productId)
    const itemsTotal = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
    const customer = order.userData || {}
    const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ')

    return (
        <div className='invoice-page'>
            <div className='invoice-actions'>
                <Button component={Link} to='/orders' startIcon={<AiOutlineArrowLeft />}>Back to My Orders</Button>
                <Button variant='contained' startIcon={<AiOutlinePrinter />} onClick={() => window.print()}>Print</Button>
            </div>

            <article className='invoice'>
                <header className='invoice__head'>
                    <div className='invoice__brand'>
                        <FaShoppingBag /> <span>ShopIt</span>
                    </div>
                    <div className='invoice__meta'>
                        <h1>Invoice</h1>
                        <p>Order ID: <b>#{order._id.slice(-8).toUpperCase()}</b></p>
                        <p>Date: <b>{formatDate(order.createdAt)}</b></p>
                        {order.status === 'Cancelled' && <p className='invoice__cancelled'>Cancelled</p>}
                    </div>
                </header>

                <section className='invoice__customer'>
                    <p className='invoice__label'>Bill to</p>
                    <p><b>{customerName || 'Customer'}</b></p>
                    {customer.address && <p>{customer.address}, {customer.city}, {customer.userState} {customer.zipCode}</p>}
                    {customer.phoneNumber && <p>Phone: {customer.phoneNumber}</p>}
                    {customer.userEmail && <p>Email: {customer.userEmail}</p>}
                </section>

                <table className='invoice__table'>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item.productId.name}</td>
                                <td>{item.quantity}</td>
                                <td>{formatPrice(item.productId.price)}</td>
                                <td>{formatPrice(item.productId.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='invoice__totals'>
                    <p><span>Item total</span><span>{formatPrice(itemsTotal)}</span></p>
                    <p><span>Delivery</span><span>{order.shippingCharge > 0 ? formatPrice(order.shippingCharge) : 'Free'}</span></p>
                    {order.couponDiscount > 0 && (
                        <p className='invoice__discount'><span>Coupon ({order.couponCode})</span><span>− {formatPrice(order.couponDiscount)}</span></p>
                    )}
                    <p className='invoice__grand'><span>Grand total</span><span>{formatPrice(order.totalAmount)}</span></p>
                </div>

                <p className='invoice__payment'>Payment: {order.paymentMethod || 'Cash on Delivery'}</p>
                <p className='invoice__thanks'>Thank you for shopping with ShopIt!</p>
            </article>
        </div>
    )
}

export default Invoice
