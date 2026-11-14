import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, CircularProgress, Grid, Radio, Step, StepLabel, Stepper, TextField } from '@mui/material'
import { MdPayments } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import OrderSummary from '../../Pages/Cart/OrderSummary'
import { getCartTotals } from '../../Constants/Constant'
import { formatPrice } from '../../Helpers/price'
import '../../Pages/Cart/Cart.css'
import styles from './Chekout.module.css'
import usePageTitle from '../../Hooks/usePageTitle'
import { getLoginPath } from '../../Helpers/redirect'

const steps = ['Address', 'Review', 'Place Order']

const addressFields = [
    { name: 'firstName', label: 'First Name', half: true },
    { name: 'lastName', label: 'Last Name', half: true },
    { name: 'phoneNumber', label: 'Phone Number', half: true, type: 'tel' },
    { name: 'userEmail', label: 'Email', half: true },
    { name: 'address', label: 'Address (House no, street, area)' },
    { name: 'city', label: 'City', half: true },
    { name: 'zipCode', label: 'PIN Code', half: true, type: 'tel' },
    { name: 'userState', label: 'State' },
]

const CheckoutForm = () => {
    usePageTitle('Checkout')
    const { cart, setCart, coupon, setCoupon } = useContext(ContextFunction)
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [userDetails, setUserDetails] = useState({
        firstName: '', lastName: '', phoneNumber: '', userEmail: '',
        address: '', zipCode: '', city: '', userState: '',
    })

    const navigate = useNavigate()
    const location = useLocation()
    const authToken = localStorage.getItem('Authorization')
    const headers = { headers: { 'Authorization': authToken } }

    useEffect(() => {
        window.scroll(0, 0)
        if (!authToken) {
            navigate(getLoginPath(location), { replace: true })
            return
        }
        const loadData = async () => {
            try {
                const [userRes, cartRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_GET_USER_DETAILS}`, headers),
                    axios.get(`${process.env.REACT_APP_GET_CART}`, headers),
                ])
                const data = userRes.data || {}
                setUserDetails({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    userEmail: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    address: data.address || '',
                    zipCode: data.zipCode || '',
                    city: data.city || '',
                    userState: data.userState || '',
                })
                setCart(cartRes.data)
            } catch (error) {
                toast.error('Could not load checkout', { autoClose: 1000, theme: 'colored' })
            } finally {
                setLoading(false)
            }
        }
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cartItems = cart.filter(item => item.productId)
    const totals = getCartTotals(cartItems, coupon)

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const validateAddress = () => {
        const missing = addressFields.find(field => !String(userDetails[field.name]).trim())
        if (missing) {
            toast.error(`Please enter ${missing.label.toLowerCase()}`, { autoClose: 1200, theme: 'colored' })
            return false
        }
        if (!/^\d{6}$/.test(userDetails.zipCode.trim())) {
            toast.error('Please enter a valid 6 digit PIN code', { autoClose: 1200, theme: 'colored' })
            return false
        }
        return true
    }

    const goToReview = (e) => {
        e.preventDefault()
        if (validateAddress()) setActiveStep(1)
    }

    const placeOrder = async () => {
        try {
            setPlacingOrder(true)
            const { data } = await axios.post(`${process.env.REACT_APP_PLACE_ORDER}`, { userDetails, couponCode: coupon }, headers)
            setActiveStep(2)
            setCart([])
            setCoupon('')
            navigate(`/ordersuccess?order=${data._id}`)
        } catch (error) {
            toast.error(error.response?.data || 'Could not place order', { autoClose: 1500, theme: 'colored' })
        } finally {
            setPlacingOrder(false)
        }
    }

    if (loading) {
        return <div className='cart-loading'><CircularProgress /></div>
    }

    if (cartItems.length === 0) {
        return (
            <div className='checkout' style={{ textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <Button component={Link} to='/products' variant='contained' sx={{ mt: 2 }}>Continue Shopping</Button>
            </div>
        )
    }

    return (
        <div className='checkout'>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map(label => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
            </Stepper>

            <div className='cart__layout'>
                <div className={styles.panel}>
                    {activeStep === 0 && (
                        <form noValidate autoComplete='off' onSubmit={goToReview}>
                            <h2 className={styles.heading}>Delivery Address</h2>
                            <Grid container spacing={2}>
                                {addressFields.map(field => (
                                    <Grid item xs={12} sm={field.half ? 6 : 12} key={field.name}>
                                        <TextField
                                            label={field.label}
                                            name={field.name}
                                            type={field.type || 'text'}
                                            value={userDetails[field.name]}
                                            onChange={handleOnchange}
                                            fullWidth
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <div className={styles.actions}>
                                <Button component={Link} to='/cart'>Back to Cart</Button>
                                <Button type='submit' variant='contained' size='large'>Continue</Button>
                            </div>
                        </form>
                    )}

                    {activeStep >= 1 && (
                        <>
                            <h2 className={styles.heading}>Review your order</h2>

                            <div className={styles.box}>
                                <div className={styles.boxHeader}>
                                    <b>Deliver to</b>
                                    <Button size='small' onClick={() => setActiveStep(0)}>Change</Button>
                                </div>
                                <p>{userDetails.firstName} {userDetails.lastName}, {userDetails.phoneNumber}</p>
                                <p>{userDetails.address}, {userDetails.city}, {userDetails.userState} - {userDetails.zipCode}</p>
                            </div>

                            <div className={styles.box}>
                                <b>Items ({totals.itemCount})</b>
                                {cartItems.map(item => (
                                    <div className={styles.item} key={item._id}>
                                        <img src={item.productId.image} alt={item.productId.name} />
                                        <div>
                                            <p>{item.productId.name}</p>
                                            <span>Qty {item.quantity} × {formatPrice(item.productId.price)}</span>
                                        </div>
                                        <b>{formatPrice(item.productId.price * item.quantity)}</b>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.box}>
                                <b>Payment Method</b>
                                <label className={styles.payment}>
                                    <Radio checked size='small' />
                                    <MdPayments />
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>

                            <div className={styles.actions}>
                                <Button onClick={() => setActiveStep(0)}>Back</Button>
                                <Button variant='contained' color='secondary' size='large' onClick={placeOrder} disabled={placingOrder}>
                                    {placingOrder ? 'Placing Order...' : `Place Order • ${formatPrice(totals.total)}`}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <aside className='cart__summary'>
                    <OrderSummary totals={totals} />
                </aside>
            </div>
        </div>
    )
}

export default CheckoutForm
