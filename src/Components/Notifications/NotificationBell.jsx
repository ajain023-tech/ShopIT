import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Popover } from '@mui/material'
import { MdNotificationsNone, MdTrendingDown } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import { formatPrice } from '../../Helpers/price'
import './NotificationBell.css'

const CHECK_EVERY = 60 * 1000

const timeAgo = (date) => {
    const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours} h ago`
    const days = Math.round(hours / 24)
    return days === 1 ? 'yesterday' : `${days} days ago`
}

// bell in the header with the user's price drop notifications
const NotificationBell = () => {
    const [notifications, setNotifications] = useState([])
    const [anchor, setAnchor] = useState(null)
    const seenIds = useRef(null)
    const authToken = localStorage.getItem('Authorization')

    const loadNotifications = useCallback(async () => {
        if (!localStorage.getItem('Authorization')) return
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_PRICE_NOTIFICATIONS}`, {
                headers: { 'Authorization': localStorage.getItem('Authorization') }
            })
            const unread = data.filter(item => !item.read)
            if (seenIds.current === null) {
                // first check after opening the site: one summary message
                if (unread.length > 0) {
                    toast.info(unread.length === 1 ? unread[0].message : `You have ${unread.length} new price drop alerts`, { autoClose: 2500, theme: 'colored' })
                }
            } else {
                // later checks: one message per new price drop
                unread.filter(item => !seenIds.current.has(item._id))
                    .forEach(item => toast.info(item.message, { autoClose: 2500, theme: 'colored' }))
            }
            seenIds.current = new Set(data.map(item => item._id))
            setNotifications(data)
        } catch (error) {
            // keep the old list, try again on the next check
        }
    }, [])

    useEffect(() => {
        if (!authToken) return
        loadNotifications()
        const timer = setInterval(loadNotifications, CHECK_EVERY)
        window.addEventListener('focus', loadNotifications)
        return () => {
            clearInterval(timer)
            window.removeEventListener('focus', loadNotifications)
        }
    }, [authToken, loadNotifications])

    if (!authToken) return null

    const unreadCount = notifications.filter(item => !item.read).length

    const openList = async (e) => {
        setAnchor(e.currentTarget)
        if (unreadCount === 0) return
        try {
            await axios.put(`${process.env.REACT_APP_READ_PRICE_NOTIFICATIONS}`, {}, { headers: { 'Authorization': authToken } })
        } catch (error) {
            // they will be marked read next time
        }
    }

    // keep the "new" highlight while the list is open, clear it when closing
    const closeList = () => {
        setAnchor(null)
        setNotifications(prev => prev.map(item => ({ ...item, read: true })))
    }

    return (
        <>
            <button
                className='nav__action nav__bell'
                onClick={openList}
                aria-label={unreadCount > 0 ? `Price alerts, ${unreadCount} new` : 'Price alerts'}
                aria-haspopup='true'
                aria-expanded={Boolean(anchor)}
            >
                <Badge badgeContent={unreadCount} color='error' aria-hidden='true'>
                    <MdNotificationsNone />
                </Badge>
                <span className='nav__bell-label'>Alerts</span>
            </button>

            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={closeList}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ className: 'notifications' }}
            >
                <div className='notifications__header'>
                    <b>Price drop alerts</b>
                </div>
                {notifications.length === 0 ? (
                    <p className='notifications__empty'>
                        No alerts yet. Click "Track Price" on a product and we'll tell you here when it gets cheaper.
                    </p>
                ) : (
                    <ul className='notifications__list'>
                        {notifications.map(item => (
                            <li key={item._id}>
                                <Link
                                    to={item.product ? `/Detail/type/${item.product.type}/${item.product._id}` : '/price-alerts'}
                                    className={`notifications__item ${item.read ? '' : 'notifications__item--new'}`}
                                    onClick={closeList}
                                >
                                    {item.product?.image
                                        ? <img src={item.product.image} alt='' />
                                        : <span className='notifications__icon'><MdTrendingDown /></span>}
                                    <span className='notifications__text'>
                                        <span>{item.message}</span>
                                        <small>
                                            {item.oldPrice > item.newPrice && <>{formatPrice(item.oldPrice)} → {formatPrice(item.newPrice)} • </>}
                                            {timeAgo(item.createdAt)}
                                        </small>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
                <Link to='/price-alerts' className='notifications__all' onClick={closeList}>See all price alerts</Link>
            </Popover>
        </>
    )
}

export default NotificationBell
