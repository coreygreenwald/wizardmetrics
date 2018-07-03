import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import './index.scss'; 

const App = () => {
  return (
    <div className="main-container">
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
