import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Skeleton } from '@mui/material'
import { MdTrendingDown, MdTrendingUp, MdTrendingFlat, MdShowChart } from 'react-icons/md'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ContextFunction } from '../../Context/Context'
import { formatPrice } from '../../Helpers/price'
import './PriceHistory.css'

const DAY = 24 * 60 * 60 * 1000
const RANGES = [
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: 'All', days: null },
]

const shortDate = (time) => new Date(time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

// is today's price a good deal compared with the price history?
export const getPriceVerdict = (stats) => {
    if (!stats) return null
    const { current, lowest, highest, average } = stats
    if (lowest === highest) {
        return { tone: 'flat', icon: <MdTrendingFlat />, title: 'Stable price', text: 'The price has not changed recently.' }
    }
    if (current <= lowest) {
        return { tone: 'good', icon: <MdTrendingDown />, title: 'Lowest price', text: 'This is the lowest price we have seen — a great time to buy.' }
    }
    const diff = Math.round((Math.abs(current - average) / average) * 100)
    if (current < average) {
        return { tone: 'good', icon: <MdTrendingDown />, title: 'Good deal', text: `${diff}% below the average price.` }
    }
    if (diff <= 2) {
        return { tone: 'flat', icon: <MdTrendingFlat />, title: 'Fair price', text: 'About the same as the average price.' }
    }
    return { tone: 'bad', icon: <MdTrendingUp />, title: 'Higher than usual', text: `${diff}% above the average price. Track it to get told when it drops.` }
}

const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const point = payload[0].payload
    return (
        <div className='price-history__tooltip'>
            <b>{formatPrice(point.price)}</b>
            <span>{point.isToday ? 'Today' : shortDate(point.time)}</span>
        </div>
    )
}

// price history graph + lowest / highest / average for one product
const PriceHistory = ({ productId, onStats }) => {
    const { darkMode } = useContext(ContextFunction)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState(RANGES[1])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        axios.get(`${process.env.REACT_APP_PRICE_HISTORY}/${productId}`)
            .then(({ data }) => { if (!cancelled) setData(data) })
            .catch(() => { if (!cancelled) setData(null) })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [productId])

    useEffect(() => {
        if (onStats) onStats(data?.stats || null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    // chart points for the chosen range; the price stays the same until the next change
    const points = useMemo(() => {
        if (!data?.history?.length) return []
        const now = Date.now()
        const from = range.days ? now - range.days * DAY : -Infinity
        const all = data.history.map(entry => ({ time: new Date(entry.date).getTime(), price: entry.price }))
        const inRange = all.filter(point => point.time >= from)
        // price that was active at the start of the range
        const before = all.filter(point => point.time < from).pop()
        if (before) inRange.unshift({ time: from, price: before.price })
        inRange.push({ time: now, price: data.stats.current, isToday: true })
        return inRange
    }, [data, range])

    if (loading) {
        return (
            <section className='price-history'>
                <Skeleton width={180} height={32} />
                <Skeleton variant='rounded' height={220} sx={{ mt: 1 }} />
            </section>
        )
    }

    if (!data || points.length === 0) return null

    const { stats } = data
    const verdict = getPriceVerdict(stats)
    const axisColor = darkMode ? '#94a3b8' : '#6b7280'
    const gridColor = darkMode ? '#334155' : '#eef0f3'

    return (
        <section className='price-history'>
            <div className='price-history__header'>
                <h2><MdShowChart /> Price History</h2>
                <div className='price-history__ranges' role='group' aria-label='Price history range'>
                    {RANGES.map(item => (
                        <button
                            key={item.label}
                            className={item.label === range.label ? 'price-history__range--active' : ''}
                            onClick={() => setRange(item)}
                            aria-pressed={item.label === range.label}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {verdict && (
                <div className={`price-history__verdict price-history__verdict--${verdict.tone}`}>
                    {verdict.icon}
                    <span><b>{verdict.title}:</b> {verdict.text}</span>
                </div>
            )}

            <div className='price-history__stats'>
                <div><span>Current</span><b>{formatPrice(stats.current)}</b></div>
                <div><span>Lowest</span><b className='price-history__low'>{formatPrice(stats.lowest)}</b></div>
                <div><span>Highest</span><b className='price-history__high'>{formatPrice(stats.highest)}</b></div>
                <div><span>Average</span><b>{formatPrice(stats.average)}</b></div>
            </div>

            <div className='price-history__chart'>
                <ResponsiveContainer width='100%' height={240}>
                    <LineChart data={points} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey='time'
                            type='number'
                            scale='time'
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={shortDate}
                            tick={{ fill: axisColor, fontSize: 12 }}
                            stroke={gridColor}
                            minTickGap={24}
                        />
                        <YAxis
                            domain={[dataMin => Math.floor(dataMin * 0.95), dataMax => Math.ceil(dataMax * 1.03)]}
                            tickFormatter={formatPrice}
                            tick={{ fill: axisColor, fontSize: 12 }}
                            stroke={gridColor}
                            width={72}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={stats.average} stroke={axisColor} strokeDasharray='4 4' label={{ value: 'Avg', fill: axisColor, fontSize: 11, position: 'insideTopRight' }} />
                        <Line type='stepAfter' dataKey='price' stroke='#ff6f00' strokeWidth={2.5} dot={{ r: 3, fill: '#ff6f00' }} activeDot={{ r: 5 }} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}

export default PriceHistory
