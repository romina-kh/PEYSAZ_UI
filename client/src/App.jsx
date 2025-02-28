import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'; // multi paging
import SignUp from './pages/sign-up/sign-up';
import SignIn from './pages/sign-in/sign-in';
import Home from './pages/home/home';
import ExpiringDiscounts from './pages/general/expiringdiscounts';
import CartStateList from './pages/general/cartstate';
import AddressManager from './pages/address/address';
import Sazgaryab from './pages/general/compatible';
 // route: where we want to go
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes> 
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path= '/' element={<Home/>} />
          <Route path='/discounts' element={<ExpiringDiscounts/>} />
          <Route path='/shopping' element={<CartStateList/>} />
          <Route path='/address' element={<AddressManager/>} />
          <Route path='/sazgaryab' element={<Sazgaryab/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
