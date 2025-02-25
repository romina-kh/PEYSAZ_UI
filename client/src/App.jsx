import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'; // multi paging
import SignUp from './pages/sign-up/sign-up';
import SignIn from './pages/sign-in/sign-in';
import Home from './pages/home/home';
import AddressManager from './pages/address/address';
 // route: where we want to go
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes> 
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path= '/' element={<Home/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
