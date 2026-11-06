import React, { useState, createContext } from 'react'
export const ContextFunction = createContext()

const Context = ({ children }) => {
    const [cart, setCart] = useState([])
    const [wishlistData, setWishlistData] = useState([])
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')




    return (
        <ContextFunction.Provider value={{ cart, setCart, wishlistData, setWishlistData, darkMode, setDarkMode }}>
            {children}
        </ContextFunction.Provider>
    )
}

export default Context