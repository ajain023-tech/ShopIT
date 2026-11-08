import { useState } from 'react'
import { Button, LinearProgress, TextField } from '@mui/material'
import { MdAccountBalanceWallet, MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import useBudget from '../../Hooks/useBudget'
import { formatPrice } from '../../Helpers/price'
import './Budget.css'

const QUICK_BUDGETS = [1000, 2500, 5000, 10000]

// Smart Budget card: set a budget and see how much of it the cart uses
const BudgetCard = () => {
    const { budget, hasBudget, cartTotal, remaining, isOverBudget, percentUsed, saveBudget } = useBudget()
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState('')
    const [saving, setSaving] = useState(false)

    const handleSave = async (amount) => {
        const number = Number(amount)
        if (!Number.isFinite(number) || number < 100) {
            toast.error('Please enter a budget of at least ₹100', { autoClose: 1000, theme: 'colored' })
            return
        }
        try {
            setSaving(true)
            await saveBudget(number)
            setEditing(false)
            setValue('')
            toast.success('Budget saved', { autoClose: 600, theme: 'colored' })
        } catch (error) {
            toast.error(error.response?.data || 'Could not save budget', { autoClose: 1000, theme: 'colored' })
        } finally {
            setSaving(false)
        }
    }

    if (!hasBudget || editing) {
        return (
            <div className='budget'>
                <div className='budget__title'><MdAccountBalanceWallet /> Smart Budget</div>
                <p className='budget__text'>Set how much you want to spend. We will track your cart and suggest cheaper options.</p>
                <form className='budget__form' onSubmit={(e) => { e.preventDefault(); handleSave(value) }}>
                    <TextField
                        size='small'
                        type='number'
                        placeholder={hasBudget ? String(budget) : 'e.g. 5000'}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        InputProps={{ startAdornment: <span style={{ marginRight: 4 }}>₹</span> }}
                        fullWidth
                    />
                    <Button type='submit' variant='contained' disabled={saving}>Save</Button>
                </form>
                <div className='budget__quick'>
                    {QUICK_BUDGETS.map(amount => (
                        <button key={amount} type='button' onClick={() => handleSave(amount)} disabled={saving}>{formatPrice(amount)}</button>
                    ))}
                </div>
                {editing && <Button size='small' onClick={() => setEditing(false)} sx={{ mt: 1 }}>Cancel</Button>}
            </div>
        )
    }

    return (
        <div className={`budget ${isOverBudget ? 'budget--over' : ''}`}>
            <div className='budget__header'>
                <div className='budget__title'><MdAccountBalanceWallet /> Smart Budget</div>
                <Button size='small' startIcon={<MdEdit />} onClick={() => setEditing(true)}>Edit</Button>
            </div>
            <div className='budget__numbers'>
                <span>{formatPrice(cartTotal)} of {formatPrice(budget)}</span>
                <span>{percentUsed}%</span>
            </div>
            <LinearProgress
                variant='determinate'
                value={percentUsed}
                color={isOverBudget ? 'error' : percentUsed >= 80 ? 'warning' : 'success'}
                sx={{ height: 10, borderRadius: 5 }}
            />
            <p className='budget__status'>
                {isOverBudget
                    ? <>You are <b>{formatPrice(-remaining)} over</b> your budget. Try the cheaper options below.</>
                    : <>You can still spend <b>{formatPrice(remaining)}</b>.</>}
            </p>
        </div>
    )
}

export default BudgetCard
