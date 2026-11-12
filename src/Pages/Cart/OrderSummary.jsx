import { useContext, useState } from 'react'
import { Button, Divider, TextField } from '@mui/material'
import { IoBagCheckOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import { COUPON_CODE, FREE_SHIPPING_ABOVE, isValidCoupon } from '../../Constants/Constant'
import { formatPrice } from '../../Helpers/price'

// price details box used on the cart and checkout pages
const OrderSummary = ({ totals, onCheckout, buttonLabel = 'Proceed to Checkout', disabled }) => {
    const { itemCount, itemsTotal, mrpTotal, savings, shipping, couponDiscount = 0, total } = totals
    const { coupon, setCoupon } = useContext(ContextFunction)
    const [couponInput, setCouponInput] = useState('')
    const totalSavings = savings + couponDiscount

    const applyCoupon = (e) => {
        e.preventDefault()
        if (!couponInput.trim()) {
            toast.error('Please enter a coupon code', { autoClose: 800, theme: 'colored' })
        } else if (!isValidCoupon(couponInput)) {
            toast.error('Invalid coupon code', { autoClose: 800, theme: 'colored' })
        } else {
            setCoupon(COUPON_CODE)
            setCouponInput('')
            toast.success(`Coupon ${COUPON_CODE} applied`, { autoClose: 800, theme: 'colored' })
        }
    }

    const removeCoupon = () => {
        setCoupon('')
        toast.info('Coupon removed', { autoClose: 800, theme: 'colored' })
    }
    const amountForFreeShipping = FREE_SHIPPING_ABOVE - itemsTotal

    return (
        <div className='summary'>
            <p className='summary__title'>Price Details</p>
            <Divider />
            <div className='summary__line'>
                <span>Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>{formatPrice(mrpTotal)}</span>
            </div>
            {savings > 0 && (
                <div className='summary__line summary__green'>
                    <span>Discount</span>
                    <span>− {formatPrice(savings)}</span>
                </div>
            )}
            {coupon && (
                <div className='summary__line summary__green'>
                    <span>
                        Coupon {coupon}{' '}
                        <button type='button' className='summary__remove' onClick={removeCoupon}>Remove</button>
                    </span>
                    <span>− {formatPrice(couponDiscount)}</span>
                </div>
            )}
            <div className='summary__line'>
                <span>Delivery Charges</span>
                <span className={shipping === 0 ? 'summary__green' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <Divider />
            <div className='summary__line summary__total'>
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
            </div>
            {totalSavings > 0 && <p className='summary__savings'>You save {formatPrice(totalSavings)} on this order</p>}
            {!coupon && (
                <form className='summary__coupon' onSubmit={applyCoupon}>
                    <TextField
                        size='small'
                        placeholder='Coupon code'
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        inputProps={{ 'aria-label': 'Coupon code' }}
                        fullWidth
                    />
                    <Button type='submit' variant='outlined'>Apply</Button>
                </form>
            )}
            {shipping > 0 && amountForFreeShipping > 0 && (
                <p className='summary__hint'>Add {formatPrice(amountForFreeShipping)} more for free delivery</p>
            )}
            {onCheckout && (
                <Button fullWidth variant='contained' size='large' color='secondary' endIcon={<IoBagCheckOutline />} onClick={onCheckout} disabled={disabled} sx={{ mt: 1 }}>
                    {buttonLabel}
                </Button>
            )}
        </div>
    )
}

export default OrderSummary
