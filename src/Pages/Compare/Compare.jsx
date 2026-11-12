import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Breadcrumbs, Button, CircularProgress, Typography } from '@mui/material'
import { AiOutlineClose, AiFillStar, AiOutlineShareAlt } from 'react-icons/ai'
import { MdCompareArrows, MdSavings, MdThumbUp, MdLocalOffer } from 'react-icons/md'
import { toast } from 'react-toastify'
import EmptyState from '../../Components/EmptyState/EmptyState'
import useCompare, { MAX_COMPARE } from '../../Hooks/useCompare'
import { ContextFunction } from '../../Context/Context'
import { addToCart, FREE_SHIPPING_ABOVE, getAllProducts, getShippingCharge } from '../../Constants/Constant'
import { formatPrice, getDiscountPercent, getOriginalPrice } from '../../Helpers/price'
import { typeLabels } from '../../SingleCategory/SingleCategory'
import '../../Components/Compare/Compare.css'
import usePageTitle from '../../Hooks/usePageTitle'
import { getLoginPath } from '../../Helpers/redirect'

// pick the product with the highest value of `score`
const best = (products, score) => products.reduce((a, b) => (score(b) > score(a) ? b : a))

// Price Comparison page: products side by side with the best options highlighted
const Compare = () => {
    const { compareList, removeFromCompare, clearCompare, compareProducts } = useCompare()
    const { setCart } = useContext(ContextFunction)
    const [addingId, setAddingId] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const sharedIds = searchParams.get('ids')
    const navigate = useNavigate()
    const location = useLocation()
    const authToken = localStorage.getItem('Authorization')

    // open a shared comparison link: /compare?ids=id1,id2,...
    useEffect(() => {
        if (!sharedIds) return
        const ids = sharedIds.split(',').map(id => id.trim()).filter(Boolean).slice(0, MAX_COMPARE)
        getAllProducts((products) => {
            const shared = ids
                .map(id => (products || []).find(product => product._id === id))
                .filter(Boolean)
            if (shared.length > 0) {
                compareProducts(shared)
            } else {
                toast.error('The shared products could not be found', { autoClose: 1000, theme: 'colored' })
            }
            const params = new URLSearchParams(searchParams)
            params.delete('ids')
            setSearchParams(params, { replace: true })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sharedIds])

    const shareComparison = async () => {
        const url = `${window.location.origin}/compare?ids=${compareList.map(p => p._id).join(',')}`
        try {
            await navigator.clipboard.writeText(url)
            toast.success('Link copied', { autoClose: 800, theme: 'colored' })
        } catch (error) {
            toast.error('Could not copy the link', { autoClose: 800, theme: 'colored' })
        }
    }

    if (sharedIds) {
        return <div className='cart-loading' style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><CircularProgress /></div>
    }

    if (compareList.length === 0) {
        return (
            <EmptyState
                icon={<MdCompareArrows />}
                title='Nothing to compare yet'
                message='Tick "Compare" on up to 4 products to see their prices side by side.'
                actionLabel='Browse products'
            />
        )
    }

    const cheapest = best(compareList, p => -p.price)
    const topRated = best(compareList, p => p.rating || 0)
    const biggestDiscount = best(compareList, p => getDiscountPercent(p))
    const mostExpensive = best(compareList, p => p.price)
    const savingVsMostExpensive = mostExpensive.price - cheapest.price

    const handleAddToCart = async (product) => {
        if (!authToken) {
            toast.info('Please login to add items to your cart', { autoClose: 900, theme: 'colored' })
            return navigate(getLoginPath(location))
        }
        try {
            setAddingId(product._id)
            await addToCart(product._id, 1, authToken, setCart)
            toast.success('Added to cart', { autoClose: 500, theme: 'colored' })
        } catch (error) {
            toast.info(error.response?.data?.msg || 'Could not add to cart', { autoClose: 800, theme: 'colored' })
        } finally {
            setAddingId(null)
        }
    }

    // each row of the table: label + how to show the value for one product
    const rows = [
        {
            label: 'Price',
            highlight: p => p._id === cheapest._id,
            render: p => (
                <>
                    <div className='compare-table__price'>{formatPrice(p.price)}</div>
                    {getDiscountPercent(p) > 0 && <div className='compare-muted'>MRP {formatPrice(getOriginalPrice(p))}</div>}
                    {p._id === cheapest._id && <span className='compare-tag'>Lowest price</span>}
                    {p._id !== cheapest._id && <div style={{ fontSize: 13, color: '#d32f2f' }}>{formatPrice(p.price - cheapest.price)} more than lowest</div>}
                </>
            ),
        },
        {
            label: 'Discount',
            highlight: p => p._id === biggestDiscount._id && getDiscountPercent(p) > 0,
            render: p => (
                <>
                    {getDiscountPercent(p)}% off
                    {getDiscountPercent(p) > 0 && <div style={{ fontSize: 13, color: '#2e7d32' }}>You save {formatPrice(getOriginalPrice(p) - p.price)}</div>}
                </>
            ),
        },
        {
            label: 'Rating',
            highlight: p => p._id === topRated._id,
            render: p => (
                <>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>{(p.rating || 0).toFixed(1)} <AiFillStar color='#f59e0b' /></span>
                    {p._id === topRated._id && <div><span className='compare-tag'>Top rated</span></div>}
                </>
            ),
        },
        {
            label: 'Value for money',
            highlight: () => false,
            // rating points per ₹1000 spent
            render: p => `${((p.rating || 0) / (p.price / 1000)).toFixed(2)} ★ per ₹1,000`,
        },
        {
            label: 'Delivery',
            highlight: () => false,
            render: p => (getShippingCharge(p.price) === 0 ? 'Free delivery' : `${formatPrice(getShippingCharge(p.price))} (free above ${formatPrice(FREE_SHIPPING_ABOVE)})`),
        },
        { label: 'Brand', highlight: () => false, render: p => p.brand || p.author || '—' },
        { label: 'Category', highlight: () => false, render: p => `${typeLabels[p.type] || p.type}${p.category ? ' • ' + p.category : ''}` },
        { label: 'About', highlight: () => false, render: p => <span style={{ color: '#6b7280' }}>{p.description}</span> },
    ]

    return (
        <div className='compare-page'>
            <Breadcrumbs sx={{ mb: 1, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                <Typography fontSize={14} color='text.primary'>Compare</Typography>
            </Breadcrumbs>

            <div className='compare-page__header'>
                <div>
                    <h1>Price Comparison</h1>
                    <p>Comparing {compareList.length} {compareList.length === 1 ? 'product' : 'products'}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button variant='contained' startIcon={<AiOutlineShareAlt />} onClick={shareComparison}>Share</Button>
                    <Button variant='outlined' component={Link} to='/products'>Add more</Button>
                    <Button color='error' onClick={clearCompare}>Clear all</Button>
                </div>
            </div>

            {compareList.length > 1 && (
                <div className='compare-verdict'>
                    <div className='compare-verdict__item'>
                        <MdSavings />
                        <span><b>Best price:</b> {cheapest.name} at {formatPrice(cheapest.price)}
                            {savingVsMostExpensive > 0 && <> — {formatPrice(savingVsMostExpensive)} cheaper than the most expensive</>}</span>
                    </div>
                    <div className='compare-verdict__item compare-verdict__item--blue'>
                        <MdThumbUp />
                        <span><b>Top rated:</b> {topRated.name} ({(topRated.rating || 0).toFixed(1)}★)</span>
                    </div>
                    {getDiscountPercent(biggestDiscount) > 0 && (
                        <div className='compare-verdict__item compare-verdict__item--orange'>
                            <MdLocalOffer />
                            <span><b>Biggest discount:</b> {biggestDiscount.name} ({getDiscountPercent(biggestDiscount)}% off)</span>
                        </div>
                    )}
                </div>
            )}

            <div className='compare-table-wrap'>
                <table className='compare-table'>
                    <tbody>
                        <tr>
                            <th>Product</th>
                            {compareList.map(p => (
                                <td key={p._id}>
                                    <div className='compare-table__product'>
                                        <button className='compare-table__remove' onClick={() => removeFromCompare(p._id)} aria-label='Remove'>
                                            <AiOutlineClose />
                                        </button>
                                        <Link to={`/Detail/type/${p.type}/${p._id}`}>
                                            <img src={p.image} alt={p.name} />
                                        </Link>
                                        <Link to={`/Detail/type/${p.type}/${p._id}`} className='compare-table__name'>{p.name}</Link>
                                        <Button variant='contained' size='small' onClick={() => handleAddToCart(p)} disabled={addingId === p._id}>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </td>
                            ))}
                        </tr>
                        {rows.map(row => (
                            <tr key={row.label}>
                                <th>{row.label}</th>
                                {compareList.map(p => (
                                    <td key={p._id} className={compareList.length > 1 && row.highlight(p) ? 'compare-best' : ''}>
                                        {row.render(p)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Compare
