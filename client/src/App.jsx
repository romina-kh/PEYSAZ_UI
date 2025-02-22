import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'; // multi paging
import SignUp from './pages/sign-up/sign-up';
import SignIn from './pages/sign-in/sign-in';
 // route: where we want to go
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes> 
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
