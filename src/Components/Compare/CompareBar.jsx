import { Link, useLocation } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
import { MdCompareArrows } from 'react-icons/md'
import useCompare, { MAX_COMPARE } from '../../Hooks/useCompare'
import './Compare.css'

// bar at the bottom of the screen showing the products picked for comparison
const CompareBar = () => {
    const { compareList, removeFromCompare, clearCompare } = useCompare()
    const { pathname } = useLocation()

    if (compareList.length === 0 || pathname === '/compare') return null

    return (
        <div className='compare-bar'>
            <div className='compare-bar__items'>
                {compareList.map(product => (
                    <div className='compare-bar__item' key={product._id}>
                        <img src={product.image} alt={product.name} />
                        <button onClick={() => removeFromCompare(product._id)} aria-label={`Remove ${product.name}`}>
                            <AiOutlineClose />
                        </button>
                    </div>
                ))}
                {Array.from({ length: MAX_COMPARE - compareList.length }).map((_, i) => (
                    <div className='compare-bar__item compare-bar__item--empty' key={i}>+</div>
                ))}
            </div>
            <div className='compare-bar__actions'>
                <button className='compare-bar__clear' onClick={clearCompare}>Clear</button>
                <Link to='/compare' className={`compare-bar__go ${compareList.length < 2 ? 'compare-bar__go--disabled' : ''}`}>
                    <MdCompareArrows /> Compare ({compareList.length})
                </Link>
            </div>
            {compareList.length < 2 && <p className='compare-bar__hint'>Add at least 2 products to compare</p>}
        </div>
    )
}

export default CompareBar
