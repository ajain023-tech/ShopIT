import React, { useEffect, useState } from 'react'
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify'
import { formatPrice } from '../../Helpers/price'
import './PriceTracker.css'

// target suggestions: lowest price seen, 5% off and 10% off (only if lower than today's price)
const getSuggestions = (price, stats) => {
    const roundDown = (value) => Math.floor(value / 10) * 10 - 1
    const list = []
    if (stats && stats.lowest < price) list.push({ label: `Lowest ever ${formatPrice(stats.lowest)}`, value: stats.lowest })
    list.push({ label: '5% lower', value: roundDown(price * 0.95) })
    list.push({ label: '10% lower', value: roundDown(price * 0.9) })
    return list.filter((item, index, all) => item.value > 0 && item.value < price && all.findIndex(other => other.value === item.value) === index)
}

// set, change or remove the target price of one product
const TrackPriceDialog = ({ open, onClose, product, alert, stats, onSaved, onRemoved }) => {
    const [target, setTarget] = useState('')
    const [saving, setSaving] = useState(false)
    const authToken = localStorage.getItem('Authorization')
    const suggestions = product ? getSuggestions(product.price, stats) : []

    useEffect(() => {
        if (open) setTarget(alert ? String(alert.targetPrice) : String(suggestions[suggestions.length > 1 ? 1 : 0]?.value || ''))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, alert])

    if (!product) return null

    const targetNumber = Number(target)
    const error = target === ''
        ? ''
        : !Number.isFinite(targetNumber) || targetNumber <= 0
            ? 'Enter a valid price'
            : targetNumber >= product.price
                ? `Must be lower than today's price (${formatPrice(product.price)})`
                : ''

    const save = async (e) => {
        e.preventDefault()
        if (!target || error) return
        try {
            setSaving(true)
            const { data } = await axios.post(`${process.env.REACT_APP_TRACK_PRICE}`, { productId: product._id, targetPrice: targetNumber }, {
                headers: { 'Authorization': authToken }
            })
            toast.success(`We'll tell you when it drops to ${formatPrice(data.targetPrice)}`, { autoClose: 1200, theme: 'colored' })
            onSaved && onSaved(data)
            onClose()
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Could not save the price alert', { autoClose: 1200, theme: 'colored' })
        } finally {
            setSaving(false)
        }
    }

    const remove = async () => {
        try {
            setSaving(true)
            await axios.delete(`${process.env.REACT_APP_TRACK_PRICE}/${product._id}`, { headers: { 'Authorization': authToken } })
            toast.info('Stopped tracking this product', { autoClose: 900, theme: 'colored' })
            onRemoved && onRemoved(product._id)
            onClose()
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Could not remove the price alert', { autoClose: 1200, theme: 'colored' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth='xs'>
            <form onSubmit={save}>
                <DialogTitle>{alert ? 'Change price alert' : 'Set a price alert'}</DialogTitle>
                <DialogContent>
                    <div className='track-dialog__product'>
                        <img src={product.image} alt='' />
                        <div>
                            <Typography fontWeight={600} fontSize={14}>{product.name}</Typography>
                            <Typography fontSize={14}>Today: <b>{formatPrice(product.price)}</b></Typography>
                        </div>
                    </div>

                    <TextField
                        label='Notify me when the price drops to'
                        type='number'
                        fullWidth
                        autoFocus
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        error={Boolean(error)}
                        helperText={error || 'You will get a notification on ShopIt when the price reaches this amount.'}
                        InputProps={{ startAdornment: <InputAdornment position='start'>₹</InputAdornment> }}
                        inputProps={{ min: 1, max: product.price - 1, step: 1 }}
                        sx={{ mt: 2 }}
                    />

                    {suggestions.length > 0 && (
                        <div className='track-dialog__chips'>
                            {suggestions.map(item => (
                                <Chip
                                    key={item.label}
                                    label={`${item.label}${item.label.startsWith('Lowest') ? '' : ` • ${formatPrice(item.value)}`}`}
                                    onClick={() => setTarget(String(item.value))}
                                    color={Number(target) === item.value ? 'primary' : 'default'}
                                    variant={Number(target) === item.value ? 'filled' : 'outlined'}
                                    size='small'
                                />
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, justifyContent: alert ? 'space-between' : 'flex-end' }}>
                    {alert && <Button color='error' onClick={remove} disabled={saving}>Stop tracking</Button>}
                    <div>
                        <Button onClick={onClose} disabled={saving}>Cancel</Button>
                        <Button type='submit' variant='contained' disabled={saving || !target || Boolean(error)}>
                            {saving ? 'Saving...' : alert ? 'Update' : 'Track Price'}
                        </Button>
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default TrackPriceDialog
