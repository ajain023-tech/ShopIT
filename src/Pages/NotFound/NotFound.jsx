import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import { AiOutlineHome } from 'react-icons/ai'
import { MdStorefront } from 'react-icons/md'
import './NotFound.css'
import usePageTitle from '../../Hooks/usePageTitle'

const NotFound = () => {
    usePageTitle('Page not found')
    return (
        <div className='not-found'>
            <div className='not-found__card'>
                <p className='not-found__code'>404</p>
                <h1 className='not-found__title'>Page not found</h1>
                <p className='not-found__text'>
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <div className='not-found__buttons'>
                    <Button component={Link} to='/' variant='contained' startIcon={<AiOutlineHome />}>
                        Go to Home
                    </Button>
                    <Button component={Link} to='/products' variant='outlined' startIcon={<MdStorefront />}>
                        Browse Products
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
