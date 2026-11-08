import { Link, useSearchParams } from 'react-router-dom'
import { AiOutlineFileDone } from 'react-icons/ai'
import { Box, Button, Typography } from '@mui/material'
import { payment } from '../../Assets/Images/Image'
import './Payment.css'
import CopyRight from '../../Components/CopyRight/CopyRight'

const OrderSuccess = () => {
    const searchParams = useSearchParams()[0]
    const orderId = searchParams.get('order')
    return (
        <>
            <div className='main-payment-box'>
                <Typography variant='h6' sx={{ marginTop: 1 }}>Order Placed <AiOutlineFileDone style={{ color: '#1976d2' }} /></Typography>
                {orderId && <Typography variant='body2'>Order ID: {orderId}</Typography>}
                <Typography variant='body2' textAlign='center'>
                    Thank you for shopping with us! You can see this order under Previous Orders in your cart.
                </Typography>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="main-payment-card">
                        <img src={payment} alt="order placed" className="payment-img" />
                        <Link style={{ color: 'white' }} to='/'><Button variant='contained' sx={{ borderRadius: 3 }}>Back To Home</Button></Link>
                    </div>
                </Box>
            </div>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default OrderSuccess
