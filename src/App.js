import {BrowserRouter, Routes, Route} from "react-router-dom"

import  Home from './components/Home'
import EachCity from './components/EachCity'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/:cityname" element={<EachCity/>}/>
      </Routes>
    </BrowserRouter>
  )  
}

export default App;
