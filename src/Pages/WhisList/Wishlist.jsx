import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs, Button, CircularProgress, Typography } from '@mui/material'
import { AiOutlineHeart, AiOutlineLogin } from 'react-icons/ai'
import { MdAddShoppingCart } from 'react-icons/md'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import useWishlist from '../../Hooks/useWishlist'
import ProductCard from '../../Components/Card/Product Card/ProductCard'
import EmptyState from '../../Components/EmptyState/EmptyState'
import { addToCart } from '../../Constants/Constant'
import './Wishlist.css'

const Wishlist = () => {
    usePageTitle('Wishlist')
    const location = useLocation()
    const { wishlistData, setCart } = useContext(ContextFunction)
    const { refreshWishlist, wishlistLoading, isAuthenticated, authToken } = useWishlist()
    const [movingAll, setMovingAll] = useState(false)

    useEffect(() => {
        window.scroll(0, 0)
        if (isAuthenticated) {
            refreshWishlist().catch((error) => {
                toast.error(error.message, { autoClose: 700, theme: 'colored' })
            })
        }
    }, [refreshWishlist, isAuthenticated])

    if (!isAuthenticated) {
        return <EmptyState icon={<AiOutlineLogin />} title='Please login to see your wishlist' actionLabel='Login' actionTo='/login' />
    }

    const products = wishlistData.map(item => item.productId).filter(Boolean)

    // add every wishlist product to the cart, one after another
    const moveAllToCart = async () => {
        setMovingAll(true)
        let added = 0
        let alreadyInCart = 0
        let failed = 0
        for (const product of products) {
            try {
                await addToCart(product._id, 1, authToken, setCart)
                added++
            } catch (error) {
                if (error.response?.status === 400) alreadyInCart++
                else failed++
            }
        }
        setMovingAll(false)

        const parts = []
        if (alreadyInCart > 0) parts.push(`${alreadyInCart} already in cart`)
        if (failed > 0) parts.push(`${failed} could not be added`)
        const extra = parts.length > 0 ? ` (${parts.join(', ')})` : ''
        const message = `${added} ${added === 1 ? 'item' : 'items'} added to cart${extra}`
        if (added > 0) toast.success(message, { autoClose: 1500, theme: 'colored' })
        else toast.info(message, { autoClose: 1500, theme: 'colored' })
    }

    if (wishlistLoading && products.length === 0) {
        return <div className='wishlist-loading'><CircularProgress /></div>
    }

    if (products.length === 0) {
        return (
            <EmptyState
                icon={<AiOutlineHeart />}
                title='Your wishlist is empty'
                message='Tap the heart on any product to save it here.'
            />
        )
    }

    return (
        <div className='wishlist'>
            <Breadcrumbs sx={{ mb: 2, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Typography fontSize={14} color='text.primary'>Wishlist</Typography>
            </Breadcrumbs>
            <div className='wishlist__header'>
                <h1 className='wishlist__title'>My Wishlist <span>({products.length} {products.length === 1 ? 'item' : 'items'})</span></h1>
                <Button variant='contained' startIcon={<MdAddShoppingCart />} onClick={moveAllToCart} disabled={movingAll}>
                    {movingAll ? 'Adding...' : 'Move all to cart'}
                </Button>
            </div>
            <div className='wishlist__grid'>
                {products.map(product => <ProductCard prod={product} key={product._id} />)}
            </div>
        </div>
    )
}

export default Wishlist
