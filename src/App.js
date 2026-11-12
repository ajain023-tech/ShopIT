import './App.css';
import { useContext, useEffect } from 'react';
import { ContextFunction } from './Context/Context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/Home/HomePage';
import Login from './Auth/Login/Login';
import Register from './Auth/Register/Register';
import Cart from './Pages/Cart/Cart';
import ProductDetail from './Pages/Detail/ProductDetail';
import SingleCategory from './SingleCategory/SingleCategory';
import MobileNavigation from './Navigation/MobileNavigation';
import Footer from './Components/Footer/Footer';
import DesktopNavigation from './Navigation/DesktopNavigation';
import Wishlist from './Pages/WhisList/Wishlist';
import OrderSuccess from './Pages/Payment/OrderSuccess';
import Orders from './Pages/Orders/Orders';
import Compare from './Pages/Compare/Compare';
import CompareBar from './Components/Compare/CompareBar';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutForm from './Components/Checkout/CheckoutForm';
import UpdateDetails from './Pages/Update_User/UpdateDetails';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import NotFound from './Pages/NotFound/NotFound';

function App() {
  const { darkMode } = useContext(ContextFunction)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])
  return (
    <>
      <ToastContainer toastClassName='toastContainerBox' transition={Flip} position='top-center' />
      <Router>
        <DesktopNavigation />
        <div className="margin">
          <Routes>
            <Route path='/' index element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/Detail/type/:cat/:id' element={<ProductDetail />} />
            <Route path='/products' element={<SingleCategory />} />
            <Route path='/product/type/:cat' element={<SingleCategory />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/checkout' element={<CheckoutForm />} />
            <Route path='/update' element={<UpdateDetails />} />
            <Route path='/ordersuccess' element={<OrderSuccess />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/compare' element={<Compare />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        <CompareBar />
        <MobileNavigation />
        <Footer />
      </Router>
    </>
  );
}
export default App;
