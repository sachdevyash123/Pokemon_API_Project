import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Pokemon from './components/Pokemon'
import PokemonDetails from './components/PokemonDetails'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  

  return (
    <>
     <Router>
      <Routes>
          <Route path='/' element={<Pokemon/>}/>
          <Route path='/pokemon/:id' element={<PokemonDetails/>}/>
      </Routes>
     </Router>
    </>
  )
}

export default App
