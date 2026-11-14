import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MdKeyboardArrowUp } from 'react-icons/md'
import useCompare from '../../Hooks/useCompare'
import './ScrollTop.css'

const SHOW_AFTER = 400

// round button that appears after scrolling and takes the user back to the top
const ScrollTop = () => {
    const [visible, setVisible] = useState(false)
    const { compareList } = useCompare()
    const { pathname } = useLocation()

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > SHOW_AFTER)
        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!visible) return null

    // move up when the compare bar is shown so they don't overlap
    const compareBarShown = compareList.length > 0 && pathname !== '/compare'

    return (
        <button
            className={`scroll-top ${compareBarShown ? 'scroll-top--raised' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label='Back to top'
        >
            <MdKeyboardArrowUp />
        </button>
    )
}

export default ScrollTop
