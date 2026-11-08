import { Button, Divider } from '@mui/material'
import { IoBagCheckOutline } from 'react-icons/io5'
import { FREE_SHIPPING_ABOVE } from '../../Constants/Constant'
import { formatPrice } from '../../Helpers/price'

// price details box used on the cart and checkout pages
const OrderSummary = ({ totals, onCheckout, buttonLabel = 'Proceed to Checkout', disabled }) => {
    const { itemCount, itemsTotal, mrpTotal, savings, shipping, total } = totals
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
            <div className='summary__line'>
                <span>Delivery Charges</span>
                <span className={shipping === 0 ? 'summary__green' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <Divider />
            <div className='summary__line summary__total'>
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
            </div>
            {savings > 0 && <p className='summary__savings'>You save {formatPrice(savings)} on this order</p>}
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
