import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, CircularProgress, Typography } from '@mui/material'
import { AiOutlineHeart, AiOutlineLogin } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import useWishlist from '../../Hooks/useWishlist'
import ProductCard from '../../Components/Card/Product Card/ProductCard'
import EmptyState from '../../Components/EmptyState/EmptyState'
import './Wishlist.css'

const Wishlist = () => {
    const { wishlistData } = useContext(ContextFunction)
    const { refreshWishlist, wishlistLoading, isAuthenticated } = useWishlist()

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
            <h1 className='wishlist__title'>My Wishlist <span>({products.length} {products.length === 1 ? 'item' : 'items'})</span></h1>
            <div className='wishlist__grid'>
                {products.map(product => <ProductCard prod={product} key={product._id} />)}
            </div>
        </div>
    )
}

export default Wishlist
