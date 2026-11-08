import { useContext } from 'react'
import { toast } from 'react-toastify'
import { ContextFunction } from '../Context/Context'

export const MAX_COMPARE = 4

// fields of a product we keep for comparing
const pickFields = (product) => ({
    _id: product._id,
    name: product.name,
    brand: product.brand,
    author: product.author,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    image: product.image,
    type: product.type,
    category: product.category,
    description: product.description,
})

// Price Comparison: add / remove products to compare side by side
const useCompare = () => {
    const { compareList, setCompareList } = useContext(ContextFunction)

    const isInCompare = (productId) => compareList.some(p => p._id === productId)

    const addToCompare = (product) => {
        if (isInCompare(product._id)) return true
        if (compareList.length >= MAX_COMPARE) {
            toast.info(`You can compare up to ${MAX_COMPARE} products`, { autoClose: 1000, theme: 'colored' })
            return false
        }
        setCompareList(list => [...list, pickFields(product)])
        return true
    }

    const removeFromCompare = (productId) => {
        setCompareList(list => list.filter(p => p._id !== productId))
    }

    const toggleCompare = (product) => {
        if (isInCompare(product._id)) removeFromCompare(product._id)
        else addToCompare(product)
    }

    // replace the whole list, e.g. "compare with similar products"
    const compareProducts = (products) => {
        setCompareList(products.slice(0, MAX_COMPARE).map(pickFields))
    }

    const clearCompare = () => setCompareList([])

    return { compareList, isInCompare, addToCompare, removeFromCompare, toggleCompare, compareProducts, clearCompare }
}

export default useCompare
