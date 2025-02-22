import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'; // multi paging
import SignUp from './assets/pages/sign-up/sign-up';
 // route: where we want to go
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes> 
          <Route path='/sign-up' element={<SignUp/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
