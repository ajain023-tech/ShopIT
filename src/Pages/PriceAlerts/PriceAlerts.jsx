import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs, Button, Chip, CircularProgress, Typography } from '@mui/material'
import { AiOutlineLogin } from 'react-icons/ai'
import { MdNotificationsActive } from 'react-icons/md'
import axios from 'axios'
import EmptyState from '../../Components/EmptyState/EmptyState'
import TrackPriceDialog from '../../Components/PriceTracker/TrackPriceDialog'
import { formatPrice } from '../../Helpers/price'
import usePageTitle from '../../Hooks/usePageTitle'
import { getLoginPath } from '../../Helpers/redirect'
import './PriceAlerts.css'

// all products the user is tracking, with how far each one is from the target price
const PriceAlerts = () => {
    usePageTitle('Price Alerts')
    const location = useLocation()
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(null)
    const authToken = localStorage.getItem('Authorization')

    useEffect(() => {
        window.scroll(0, 0)
        if (!authToken) {
            setLoading(false)
            return
        }
        axios.get(`${process.env.REACT_APP_GET_TRACKED}`, { headers: { 'Authorization': authToken } })
            .then(({ data }) => setAlerts(data))
            .catch(() => setAlerts([]))
            .finally(() => setLoading(false))
    }, [authToken])

    const handleSaved = (saved) => setAlerts(prev => prev.map(alert => alert._id === saved._id ? saved : alert))
    const handleRemoved = (productId) => setAlerts(prev => prev.filter(alert => alert.product._id !== productId))

    if (!authToken) {
        return <EmptyState icon={<AiOutlineLogin />} title='Please login to see your price alerts' actionLabel='Login' actionTo={getLoginPath(location)} />
    }

    if (loading) {
        return <div className='cart-loading' style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><CircularProgress /></div>
    }

    if (alerts.length === 0) {
        return (
            <EmptyState
                icon={<MdNotificationsActive />}
                title='No price alerts yet'
                message='Open any product and click "Track Price". We will tell you when it gets cheaper.'
                actionLabel='Browse products'
            />
        )
    }

    const reachedCount = alerts.filter(alert => alert.product.price <= alert.targetPrice).length

    return (
        <div className='price-alerts'>
            <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Typography fontSize={14} color='text.primary'>Price Alerts</Typography>
            </Breadcrumbs>
            <h1 className='price-alerts__title'>Price Alerts</h1>
            <p className='price-alerts__subtitle'>
                Tracking {alerts.length} {alerts.length === 1 ? 'product' : 'products'}
                {reachedCount > 0 && <> • <b>{reachedCount} at your target price</b></>}
            </p>

            <div className='price-alerts__list'>
                {alerts.map(alert => {
                    const { product } = alert
                    const reached = product.price <= alert.targetPrice
                    const dropSinceStart = alert.startPrice ? alert.startPrice - product.price : 0
                    const toGo = product.price - alert.targetPrice
                    const detailPath = `/Detail/type/${product.type}/${product._id}`
                    return (
                        <div className={`price-alert ${reached ? 'price-alert--reached' : ''}`} key={alert._id}>
                            <Link to={detailPath} className='price-alert__image'>
                                <img src={product.image} alt={product.name} loading='lazy' />
                            </Link>
                            <div className='price-alert__info'>
                                <Link to={detailPath} className='price-alert__name'>{product.name}</Link>
                                <div className='price-alert__prices'>
                                    <span>Now <b>{formatPrice(product.price)}</b></span>
                                    <span>Target <b>{formatPrice(alert.targetPrice)}</b></span>
                                    {alert.startPrice && <span>When added <b>{formatPrice(alert.startPrice)}</b></span>}
                                </div>
                                <div className='price-alert__status'>
                                    {reached
                                        ? <Chip label='Target price reached' color='success' size='small' />
                                        : <Chip label={`${formatPrice(toGo)} to go`} size='small' variant='outlined' />}
                                    {dropSinceStart > 0 && <span className='price-alert__drop'>↓ {formatPrice(dropSinceStart)} since you started tracking</span>}
                                </div>
                            </div>
                            <div className='price-alert__actions'>
                                {reached
                                    ? <Button variant='contained' color='secondary' size='small' component={Link} to={detailPath}>Buy now</Button>
                                    : <Button variant='outlined' size='small' onClick={() => setEditing(alert)}>Change target</Button>}
                                {reached && <Button size='small' onClick={() => setEditing(alert)}>Set new target</Button>}
                            </div>
                        </div>
                    )
                })}
            </div>

            <TrackPriceDialog
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                product={editing?.product}
                alert={editing}
                onSaved={handleSaved}
                onRemoved={handleRemoved}
            />
        </div>
    )
}

export default PriceAlerts
