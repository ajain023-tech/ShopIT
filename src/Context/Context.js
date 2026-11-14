import React, { useState, useEffect, createContext } from 'react'
export const ContextFunction = createContext()

const COMPARE_KEY = 'shopIt_compare'

// read the compare list saved in the browser
const loadCompareList = () => {
    try {
        return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []
    } catch (error) {
        return []
    }
}

const Context = ({ children }) => {
    const [cart, setCart] = useState([])
    const [wishlistData, setWishlistData] = useState([])
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
    const [compareList, setCompareList] = useState(loadCompareList)
    const [budget, setBudget] = useState(0)
    const [coupon, setCoupon] = useState('')

    // keep the compare list after a page refresh
    useEffect(() => {
        try {
            localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList))
        } catch (error) {
            // storage not available, the list just won't be saved
        }
    }, [compareList])

    return (
        <ContextFunction.Provider value={{
            cart, setCart,
            wishlistData, setWishlistData,
            darkMode, setDarkMode,
            compareList, setCompareList,
            budget, setBudget,
            coupon, setCoupon,
        }}>
            {children}
        </ContextFunction.Provider>
    )
}

export default Context
