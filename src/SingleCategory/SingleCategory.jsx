import './singlecategory.css'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
    Box, Breadcrumbs, Button, Checkbox, Chip, Drawer, FormControl, FormControlLabel, MenuItem,
    Pagination, Radio, RadioGroup, Select, Slider, Typography
} from '@mui/material'
import { BiFilterAlt } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import Loading from '../Components/loading/Loading'
import ProductCard from '../Components/Card/Product Card/ProductCard'
import EmptyState from '../Components/EmptyState/EmptyState'
import { getAllProducts } from '../Constants/Constant'
import useBudget from '../Hooks/useBudget'
import { formatPrice, getDiscountPercent } from '../Helpers/price'

const PRODUCTS_PER_PAGE = 12
const MAX_BRANDS = 10

export const typeLabels = {
    cloths: 'Clothing',
    shoe: 'Shoes',
    electronics: 'Electronics',
    book: 'Books',
    jewelry: 'Jewellery',
}

const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'discount', label: 'Discount' },
]

const sortProducts = (products, sort) => {
    const list = [...products]
    if (sort === 'priceLow') return list.sort((a, b) => a.price - b.price)
    if (sort === 'priceHigh') return list.sort((a, b) => b.price - a.price)
    if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating)
    if (sort === 'discount') return list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
    return list
}

const formatLabel = (text) =>
    ['ssd', 'hdd'].includes(text) ? text.toUpperCase() : text.charAt(0).toUpperCase() + text.slice(1)

const matchesSearch = (product, term) =>
    ['name', 'brand', 'type', 'category', 'author', 'gender'].some(field =>
        product[field] && product[field].toLowerCase().includes(term))

// list of products with filters; used for /products, /products?search=... and /product/type/:cat
const SingleCategory = () => {
    const { cat } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = (searchParams.get('search') || '').trim()

    const [allProducts, setAllProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [sort, setSort] = useState(searchParams.get('sort') || 'relevance')
    const [selectedTypes, setSelectedTypes] = useState([])
    const [selectedSubCategories, setSelectedSubCategories] = useState([])
    const [selectedBrands, setSelectedBrands] = useState([])
    const [priceRange, setPriceRange] = useState(null)
    const [minRating, setMinRating] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [withinBudget, setWithinBudget] = useState(false)
    const { hasBudget, remaining } = useBudget()
    const budgetLeft = Math.max(0, remaining)

    useEffect(() => {
        getAllProducts((data) => {
            setAllProducts(data || [])
            setIsLoading(false)
        })
    }, [])

    // start fresh when the category or search changes
    useEffect(() => {
        window.scroll(0, 0)
        setSelectedTypes([])
        setSelectedSubCategories([])
        setSelectedBrands([])
        setPriceRange(null)
        setMinRating(0)
        setCurrentPage(1)
        setSort(searchParams.get('sort') || 'relevance')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cat, searchTerm])

    // products of this page before the sidebar filters
    const baseProducts = useMemo(() => {
        let list = cat ? allProducts.filter(p => p.type === cat) : allProducts
        if (searchTerm) list = list.filter(p => matchesSearch(p, searchTerm.toLowerCase()))
        return list
    }, [allProducts, cat, searchTerm])

    const priceLimits = useMemo(() => {
        if (baseProducts.length === 0) return [0, 0]
        const prices = baseProducts.map(p => p.price)
        return [Math.min(...prices), Math.max(...prices)]
    }, [baseProducts])

    const activePrice = priceRange || priceLimits
    const types = [...new Set(baseProducts.map(p => p.type))]
    const subCategories = [...new Set(baseProducts.map(p => p.category).filter(Boolean))]
    const brandCounts = baseProducts.reduce((acc, p) => {
        const brand = p.brand || p.author
        if (brand) acc[brand] = (acc[brand] || 0) + 1
        return acc
    }, {})
    const brands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]).slice(0, MAX_BRANDS)

    const filteredProducts = useMemo(() => {
        const list = baseProducts.filter(p =>
            (selectedTypes.length === 0 || selectedTypes.includes(p.type)) &&
            (selectedSubCategories.length === 0 || selectedSubCategories.includes(p.category)) &&
            (selectedBrands.length === 0 || selectedBrands.includes(p.brand || p.author)) &&
            p.price >= activePrice[0] && p.price <= activePrice[1] &&
            (p.rating || 0) >= minRating &&
            (!withinBudget || !hasBudget || p.price <= budgetLeft)
        )
        return sortProducts(list, sort)
    }, [baseProducts, selectedTypes, selectedSubCategories, selectedBrands, activePrice, minRating, sort, withinBudget, hasBudget, budgetLeft])

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
    const pageProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)

    const toggle = (list, setList, value) => {
        setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSelectedTypes([])
        setSelectedSubCategories([])
        setSelectedBrands([])
        setPriceRange(null)
        setMinRating(0)
        setWithinBudget(false)
        setCurrentPage(1)
    }

    // keep the sort in the URL so it survives a refresh and can be shared
    const handleSortChange = (value) => {
        setSort(value)
        setCurrentPage(1)
        const params = new URLSearchParams(searchParams)
        if (value === 'relevance') params.delete('sort')
        else params.set('sort', value)
        setSearchParams(params, { replace: true })
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
        window.scroll(0, 0)
    }

    // filters currently applied, shown as chips that can be removed one by one
    const activeFilters = [
        ...selectedTypes.map(type => ({
            key: `type-${type}`, label: typeLabels[type] || formatLabel(type),
            onDelete: () => toggle(selectedTypes, setSelectedTypes, type),
        })),
        ...selectedSubCategories.map(sub => ({
            key: `sub-${sub}`, label: formatLabel(sub),
            onDelete: () => toggle(selectedSubCategories, setSelectedSubCategories, sub),
        })),
        ...selectedBrands.map(brand => ({
            key: `brand-${brand}`, label: brand,
            onDelete: () => toggle(selectedBrands, setSelectedBrands, brand),
        })),
        ...(priceRange ? [{
            key: 'price', label: `${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`,
            onDelete: () => { setPriceRange(null); setCurrentPage(1) },
        }] : []),
        ...(minRating > 0 ? [{
            key: 'rating', label: `${minRating}★ & above`,
            onDelete: () => { setMinRating(0); setCurrentPage(1) },
        }] : []),
        ...(withinBudget ? [{
            key: 'budget', label: 'Within my budget',
            onDelete: () => { setWithinBudget(false); setCurrentPage(1) },
        }] : []),
    ]

    const title = searchTerm
        ? `Results for "${searchTerm}"`
        : cat ? (typeLabels[cat] || formatLabel(cat)) : 'All Products'

    const filterPanel = (
        <div className='filters'>
            <div className='filters__header'>
                <Typography fontWeight={700}>Filters</Typography>
                <Button size='small' onClick={clearFilters}>Clear all</Button>
            </div>

            {hasBudget && (
                <div className='filters__group'>
                    <p className='filters__title'>Smart Budget</p>
                    <FormControlLabel
                        label={`Within my budget (${formatPrice(budgetLeft)} left)`}
                        control={<Checkbox size='small' checked={withinBudget} onChange={() => { setWithinBudget(!withinBudget); setCurrentPage(1) }} />}
                    />
                </div>
            )}

            {!cat && types.length > 1 && (
                <div className='filters__group'>
                    <p className='filters__title'>Category</p>
                    {types.map(type => (
                        <FormControlLabel key={type} label={typeLabels[type] || formatLabel(type)}
                            control={<Checkbox size='small' checked={selectedTypes.includes(type)} onChange={() => toggle(selectedTypes, setSelectedTypes, type)} />} />
                    ))}
                </div>
            )}

            {cat && subCategories.length > 1 && (
                <div className='filters__group'>
                    <p className='filters__title'>Type</p>
                    {subCategories.map(sub => (
                        <FormControlLabel key={sub} label={formatLabel(sub)}
                            control={<Checkbox size='small' checked={selectedSubCategories.includes(sub)} onChange={() => toggle(selectedSubCategories, setSelectedSubCategories, sub)} />} />
                    ))}
                </div>
            )}

            {priceLimits[1] > priceLimits[0] && (
                <div className='filters__group'>
                    <p className='filters__title'>Price</p>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={activePrice}
                            min={priceLimits[0]}
                            max={priceLimits[1]}
                            step={50}
                            onChange={(e, value) => { setPriceRange(value); setCurrentPage(1) }}
                            valueLabelDisplay='auto'
                            valueLabelFormat={formatPrice}
                        />
                    </Box>
                    <div className='filters__price'>
                        <span>{formatPrice(activePrice[0])}</span>
                        <span>{formatPrice(activePrice[1])}</span>
                    </div>
                </div>
            )}

            {brands.length > 1 && (
                <div className='filters__group'>
                    <p className='filters__title'>{cat === 'book' ? 'Author' : 'Brand'}</p>
                    {brands.map(brand => (
                        <FormControlLabel key={brand} label={`${brand} (${brandCounts[brand]})`}
                            control={<Checkbox size='small' checked={selectedBrands.includes(brand)} onChange={() => toggle(selectedBrands, setSelectedBrands, brand)} />} />
                    ))}
                </div>
            )}

            <div className='filters__group'>
                <p className='filters__title'>Customer Rating</p>
                <RadioGroup value={minRating} onChange={(e) => { setMinRating(Number(e.target.value)); setCurrentPage(1) }}>
                    <FormControlLabel value={4} control={<Radio size='small' />} label='4★ & above' />
                    <FormControlLabel value={3} control={<Radio size='small' />} label='3★ & above' />
                    <FormControlLabel value={0} control={<Radio size='small' />} label='Any rating' />
                </RadioGroup>
            </div>
        </div>
    )

    return (
        <div className='listing'>
            <Breadcrumbs sx={{ mb: 1, fontSize: 14 }}>
                <Link to='/'>Home</Link>
                {cat || searchTerm ? <Link to='/products'>Products</Link> : <Typography fontSize={14} color='text.primary'>Products</Typography>}
                {(cat || searchTerm) && <Typography fontSize={14} color='text.primary'>{searchTerm ? 'Search' : title}</Typography>}
            </Breadcrumbs>

            <div className='listing__layout'>
                <aside className='listing__sidebar'>{filterPanel}</aside>

                <main className='listing__main'>
                    <div className='listing__toolbar'>
                        <div>
                            <h1 className='listing__title'>{title}</h1>
                            {!isLoading && <p className='listing__count'>{filteredProducts.length} products</p>}
                        </div>
                        <div className='listing__actions'>
                            <Button className='listing__filter-btn' variant='outlined' startIcon={<BiFilterAlt />} onClick={() => setFiltersOpen(true)}>
                                Filters
                            </Button>
                            <FormControl size='small'>
                                <Select value={sort} onChange={(e) => handleSortChange(e.target.value)} sx={{ minWidth: 190, bgcolor: 'background.paper' }}>
                                    {sortOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>Sort: {option.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className='listing__chips'>
                            {activeFilters.map(filter => (
                                <Chip key={filter.key} label={filter.label} onDelete={filter.onDelete} color='primary' variant='outlined' size='small' />
                            ))}
                            <Button size='small' onClick={clearFilters}>Clear all</Button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className='listing__grid'>
                            {Array.from({ length: 8 }).map((_, i) => <Loading key={i} />)}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <EmptyState
                            icon={<AiOutlineSearch />}
                            title='No products found'
                            message={baseProducts.length === 0 ? 'Try searching for something else.' : 'Try removing some filters.'}
                            actionLabel={baseProducts.length === 0 ? 'Browse all products' : null}
                            actionTo={baseProducts.length === 0 ? '/products' : null}
                        />
                    ) : (
                        <div className='listing__grid'>
                            {pageProducts.map(prod => <ProductCard prod={prod} key={prod._id} />)}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color='primary' shape='rounded' />
                        </Box>
                    )}
                </main>
            </div>

            <Drawer anchor='left' open={filtersOpen} onClose={() => setFiltersOpen(false)}>
                <Box sx={{ width: 290, p: 2 }}>
                    {filterPanel}
                    <Button fullWidth variant='contained' sx={{ mt: 2 }} onClick={() => setFiltersOpen(false)}>
                        Show {filteredProducts.length} products
                    </Button>
                </Box>
            </Drawer>
        </div>
    )
}

export default SingleCategory
