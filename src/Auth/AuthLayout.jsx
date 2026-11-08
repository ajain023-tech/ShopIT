import { Link } from 'react-router-dom'
import { FaShoppingBag } from 'react-icons/fa'
import { MdLocalShipping, MdAssignmentReturn, MdPayments } from 'react-icons/md'
import { GroupCloth } from '../Assets/Images/Image'
import './Login/login.css'

// split screen used by the login and register pages: picture on the left, form on the right
const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className='auth'>
            <div className='auth__card'>
                <div className='auth__side' style={{ backgroundImage: `url(${GroupCloth})` }}>
                    <div className='auth__side-overlay' />
                    <div className='auth__side-content'>
                        <Link to='/' className='auth__logo'><FaShoppingBag /> ShopIt</Link>
                        <h2>Everything you love, in one place.</h2>
                        <ul>
                            <li><MdLocalShipping /> Free delivery above ₹999</li>
                            <li><MdAssignmentReturn /> Easy 7-day returns</li>
                            <li><MdPayments /> Cash on Delivery</li>
                        </ul>
                    </div>
                </div>

                <div className='auth__form'>
                    <h1 className='auth__title'>{title}</h1>
                    {subtitle && <p className='auth__subtitle'>{subtitle}</p>}
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
