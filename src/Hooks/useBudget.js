import { useCallback, useContext, useEffect } from 'react'
import axios from 'axios'
import { ContextFunction } from '../Context/Context'
import { getCartTotals } from '../Constants/Constant'

// Smart Budget: the user's budget, how much of it the cart uses, and saving it
const useBudget = () => {
    const { budget, setBudget, cart } = useContext(ContextFunction)
    const authToken = localStorage.getItem('Authorization')

    // load the saved budget from the user's account once
    useEffect(() => {
        if (!authToken || budget) return
        axios.get(`${process.env.REACT_APP_GET_USER_DETAILS}`, { headers: { 'Authorization': authToken } })
            .then(({ data }) => setBudget(data?.budget || 0))
            .catch(() => {})
    }, [authToken, budget, setBudget])

    const saveBudget = useCallback(async (amount) => {
        const value = Math.round(Number(amount))
        await axios.put(`${process.env.REACT_APP_UPDATE_USER_DETAILS}`,
            { userDetails: JSON.stringify({ budget: value }) },
            { headers: { 'Authorization': authToken } })
        setBudget(value)
    }, [authToken, setBudget])

    const cartTotal = getCartTotals(cart).total
    const hasBudget = budget > 0
    const remaining = budget - cartTotal

    return {
        budget,
        hasBudget,
        cartTotal,
        remaining,
        isOverBudget: hasBudget && remaining < 0,
        percentUsed: hasBudget ? Math.min(100, Math.round((cartTotal / budget) * 100)) : 0,
        saveBudget,
        isLoggedIn: Boolean(authToken),
    }
}

export default useBudget
