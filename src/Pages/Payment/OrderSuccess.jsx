import { Link, useSearchParams } from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import { Button } from '@mui/material'
import './Payment.css'
import usePageTitle from '../../Hooks/usePageTitle'

const OrderSuccess = () => {
    usePageTitle('Order Placed')
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('order')

    return (
        <div className='success'>
            <div className='success__card'>
                <AiFillCheckCircle className='success__icon' />
                <h1>Order placed successfully!</h1>
                {orderId && <p className='success__id'>Order ID: #{orderId.slice(-8).toUpperCase()}</p>}
                <p className='success__text'>
                    Thank you for shopping with ShopIt. You will pay with Cash on Delivery when your order arrives.
                </p>
                <div className='success__buttons'>
                    <Button component={Link} to='/orders' variant='contained' size='large'>View My Orders</Button>
                    <Button component={Link} to='/products' variant='outlined' size='large'>Continue Shopping</Button>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess
