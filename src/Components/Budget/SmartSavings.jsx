import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { MdSavings } from 'react-icons/md'
import { AiFillStar } from 'react-icons/ai'
import { getAllProducts } from '../../Constants/Constant'
import { formatPrice } from '../../Helpers/price'
import './Budget.css'

const MIN_RATING = 4
const MAX_SUGGESTIONS = 3

// cheapest well rated product of the same type and category, cheaper than the given one
const findCheaperAlternative = (product, allProducts, excludeIds) => {
    const options = allProducts.filter(p =>
        p.type === product.type &&
        p.category === product.category &&
        p.price < product.price &&
        (p.rating || 0) >= MIN_RATING &&
        !excludeIds.includes(p._id)
    )
    if (options.length === 0) return null
    return options.sort((a, b) => a.price - b.price)[0]
}

// Smart Budget suggestions: swap cart items for cheaper, well rated alternatives
const SmartSavings = ({ cartItems, onSwap, isOverBudget, swappingId }) => {
    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {
        getAllProducts(data => setAllProducts(data || []))
    }, [])

    const cartProductIds = cartItems.map(item => item.productId._id)
    const suggestions = cartItems
        .map(item => {
            const alternative = findCheaperAlternative(item.productId, allProducts, cartProductIds)
            return alternative && { item, alternative, saving: (item.productId.price - alternative.price) * item.quantity }
        })
        .filter(Boolean)
        .sort((a, b) => b.saving - a.saving)
        .slice(0, MAX_SUGGESTIONS)

    if (suggestions.length === 0) return null

    const totalSaving = suggestions.reduce((sum, s) => sum + s.saving, 0)

    return (
        <div className={`savings ${isOverBudget ? 'savings--urgent' : ''}`}>
            <div className='savings__header'>
                <MdSavings />
                <div>
                    <p className='savings__title'>Smart Savings</p>
                    <p className='savings__subtitle'>Swap to these well rated options and save up to {formatPrice(totalSaving)}</p>
                </div>
            </div>
            {suggestions.map(({ item, alternative, saving }) => (
                <div className='savings__row' key={item._id}>
                    <img src={alternative.image} alt={alternative.name} />
                    <div className='savings__info'>
                        <p className='savings__instead'>Instead of {item.productId.name}</p>
                        <p className='savings__name'>{alternative.name}</p>
                        <p className='savings__meta'>
                            {formatPrice(alternative.price)} • {(alternative.rating || 0).toFixed(1)} <AiFillStar color='#f59e0b' />
                        </p>
                    </div>
                    <div className='savings__action'>
                        <span className='savings__save'>Save {formatPrice(saving)}</span>
                        <Button size='small' variant='outlined' color='success' onClick={() => onSwap(item, alternative)} disabled={swappingId === item._id}>
                            {swappingId === item._id ? 'Swapping...' : 'Swap'}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SmartSavings
